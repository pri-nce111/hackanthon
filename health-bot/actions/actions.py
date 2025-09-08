import os
import json
from typing import Any, Dict, List, Text

import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet


def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB", "healthbot"),
        user=os.getenv("POSTGRES_USER", "healthbot"),
        password=os.getenv("POSTGRES_PASSWORD", "healthbot"),
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
    )
    conn.autocommit = True
    return conn


def init_db():
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS interactions (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    channel TEXT,
                    intent TEXT,
                    message TEXT,
                    response TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS subscribers (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT UNIQUE,
                    channel TEXT NOT NULL,
                    address TEXT NOT NULL,
                    language TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );
                """
            )


def log_interaction(user_id: str, channel: str, intent: str, message: str, response: str) -> None:
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO interactions (user_id, channel, intent, message, response) VALUES (%s, %s, %s, %s, %s)",
                    (user_id, channel, intent, message, response),
                )
    except Exception:
        # avoid crashing action server due to logging failures
        pass


def get_channel_and_address(tracker: Tracker) -> Dict[str, str]:
    # Extract channel and sender id; Twilio uses 'sender_id' like phone or whatsapp number
    sender_id = tracker.sender_id
    input_channel = tracker.get_latest_input_channel() or "rest"
    address = sender_id
    return {"channel": input_channel, "address": address}


class ActionSetLanguage(Action):
    def name(self) -> Text:
        return "action_set_language"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        text = (tracker.latest_message.get("text") or "").lower()
        language = "English" if "english" in text else "Hindi" if ("hindi" in text or "हिंदी" in text or "हिन्दी" in text) else "English"
        dispatcher.utter_message(text=f"Language set to {language}.\nभाषा {language} पर सेट कर दी गई है।")
        return [SlotSet("language", language)]


SYMPTOMS = {
    "dengue": {
        "en": "Fever, severe headache, pain behind eyes, joint and muscle pains, rash.",
        "hi": "बुखार, तेज सिरदर्द, आंखों के पीछे दर्द, जोड़ों और मांसपेशियों में दर्द, चकत्ते।",
    },
    "malaria": {
        "en": "Fever, chills, sweats, headaches, nausea, vomiting, body aches.",
        "hi": "बुखार, ठंड लगना, पसीना, सिरदर्द, मतली, उल्टी, बदन दर्द।",
    },
    "covid-19": {
        "en": "Fever, cough, tiredness, loss of taste or smell, breathing difficulty.",
        "hi": "बुखार, खांसी, थकान, स्वाद/गंध का अभाव, सांस लेने में दिक्कत।",
    },
}

PREVENTION = {
    "dengue": {
        "en": "Avoid mosquito bites: use repellents, wear long sleeves, remove standing water.",
        "hi": "मच्छरों से बचें: रिपेलेंट लगाएँ, फुल-बाहों के कपड़े पहनें, ठहरा पानी हटाएँ।",
    },
    "malaria": {
        "en": "Prevent bites: bed nets, repellents; take prophylaxis if advised.",
        "hi": "काटने से बचें: मच्छरदानी, रिपेलेंट; सलाह मिले तो प्रोफिलैक्सिस लें।",
    },
    "covid-19": {
        "en": "Vaccination, masks in crowded spaces, hand hygiene, ventilation.",
        "hi": "टीकाकरण, भीड़ में मास्क, हाथों की सफाई, वेंटिलेशन।",
    },
}


class ActionProvideSymptoms(Action):
    def name(self) -> Text:
        return "action_provide_symptoms"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        lang = (tracker.get_slot("language") or "English").lower()
        disease = tracker.get_slot("disease")
        if not disease:
            # Try to extract from text heuristically
            text = (tracker.latest_message.get("text") or "").lower()
            for key in SYMPTOMS.keys():
                if key in text or (key.split("-")[0] in text):
                    disease = key
                    break
        disease = (disease or "dengue").lower()
        disease = "covid-19" if disease in {"covid", "corona", "coronavirus"} else disease
        info = SYMPTOMS.get(disease, SYMPTOMS["dengue"])  # default
        msg = info["en"] if lang.startswith("english") else info["hi"]
        dispatcher.utter_message(text=msg)
        log_interaction(tracker.sender_id, tracker.get_latest_input_channel() or "rest", "ask_symptoms", tracker.latest_message.get("text", ""), msg)
        return [SlotSet("disease", disease)]


class ActionProvidePrevention(Action):
    def name(self) -> Text:
        return "action_provide_prevention"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        lang = (tracker.get_slot("language") or "English").lower()
        disease = tracker.get_slot("disease")
        if not disease:
            text = (tracker.latest_message.get("text") or "").lower()
            for key in PREVENTION.keys():
                if key in text or (key.split("-")[0] in text):
                    disease = key
                    break
        disease = (disease or "dengue").lower()
        disease = "covid-19" if disease in {"covid", "corona", "coronavirus"} else disease
        info = PREVENTION.get(disease, PREVENTION["dengue"])  # default
        msg = info["en"] if lang.startswith("english") else info["hi"]
        dispatcher.utter_message(text=msg)
        log_interaction(tracker.sender_id, tracker.get_latest_input_channel() or "rest", "ask_prevention", tracker.latest_message.get("text", ""), msg)
        return [SlotSet("disease", disease)]


class ActionFetchVaccinationSchedule(Action):
    def name(self) -> Text:
        return "action_fetch_vaccination_schedule"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        lang = (tracker.get_slot("language") or "English").lower()
        base = os.getenv("GOV_HEALTH_API_BASE", "").rstrip("/")
        schedule_text_en = "Infant schedule: BCG at birth; OPV/HEP B; DPT at 6,10,14 weeks; Measles at 9 months."
        schedule_text_hi = "शिशु शेड्यूल: जन्म पर BCG; OPV/HEP B; DPT 6,10,14 सप्ताह; 9 माह पर खसरा।"
        if base:
            try:
                # Placeholder for real API, adapt as per actual spec
                resp = requests.get(f"{base}/vaccination/schedule/infant", timeout=8)
                if resp.ok:
                    data = resp.json()
                    # Simplistic format
                    items = [f"{it.get('name')} - {it.get('age')}" for it in data.get("items", [])]
                    schedule_text_en = "\n".join(items) or schedule_text_en
                    schedule_text_hi = schedule_text_en  # If API returns English only, mirror
            except Exception:
                pass

        msg = schedule_text_en if lang.startswith("english") else schedule_text_hi
        dispatcher.utter_message(text=msg)
        log_interaction(tracker.sender_id, tracker.get_latest_input_channel() or "rest", "ask_vaccination_schedule", tracker.latest_message.get("text", ""), msg)
        return []


class ActionSubscribeAlerts(Action):
    def name(self) -> Text:
        return "action_subscribe_alerts"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        info = get_channel_and_address(tracker)
        language = tracker.get_slot("language") or "English"
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO subscribers (user_id, channel, address, language) VALUES (%s, %s, %s, %s) ON CONFLICT (user_id) DO UPDATE SET channel = EXCLUDED.channel, address = EXCLUDED.address, language = EXCLUDED.language",
                        (tracker.sender_id, info["channel"], info["address"], language),
                    )
            dispatcher.utter_message(text="You will receive outbreak alerts.\nआपको आउटब्रेक अलर्ट मिलेंगे।")
        except Exception:
            dispatcher.utter_message(text="Subscription failed. Please try again later.\nसब्सक्रिप्शन विफल रहा। बाद में प्रयास करें।")
        return []


class ActionUnsubscribeAlerts(Action):
    def name(self) -> Text:
        return "action_unsubscribe_alerts"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("DELETE FROM subscribers WHERE user_id = %s", (tracker.sender_id,))
            dispatcher.utter_message(text="You have been unsubscribed from alerts.\nआप अनसब्सक्राइब हो गए हैं।")
        except Exception:
            dispatcher.utter_message(text="Unsubscribe failed.\nअनसब्सक्राइब विफल रहा।")
        return []


class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        msg = "Sorry, I didn't understand that. Please rephrase.\nक्षमा करें, मैं समझ नहीं पाया/पाई।"
        dispatcher.utter_message(text=msg)
        log_interaction(tracker.sender_id, tracker.get_latest_input_channel() or "rest", "fallback", tracker.latest_message.get("text", ""), msg)
        return []


# Initialize tables at import time
try:
    init_db()
except Exception:
    pass

