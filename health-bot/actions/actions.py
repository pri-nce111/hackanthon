import os
from typing import Any, Dict, List, Text

import requests
from dotenv import load_dotenv
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

load_dotenv()


class ActionVaccinationSchedule(Action):
    def name(self) -> Text:
        return "action_vaccination_schedule"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        # Placeholder: integrate real CoWIN or MoHFW schedule lookup
        message = (
            "Sample vaccination schedule:\n"
            "- Birth: BCG, OPV-0, HepB-0\n"
            "- 6 weeks: DPT-1, OPV-1, HepB-1\n"
            "- 10 weeks: DPT-2, OPV-2\n"
            "- 14 weeks: DPT-3, OPV-3\n"
            "(उदाहरण शिशु टीकाकरण अनुसूची)"
        )
        dispatcher.utter_message(text=message)
        return []


class ActionOutbreakStatus(Action):
    def name(self) -> Text:
        return "action_outbreak_status"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        # Placeholder: call a public health/outbreak API based on location entities
        example_alert = (
            "No active dengue alert reported for your area today."
            " (आज आपके क्षेत्र में कोई डेंगू अलर्ट नहीं)."
        )
        dispatcher.utter_message(text=example_alert)
        return []

