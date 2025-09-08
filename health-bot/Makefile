.PHONY: venv install train run actions shell docker-up docker-build

venv:
	python3 -m venv .venv
	. .venv/bin/activate && pip install -r requirements.txt

install:
	. .venv/bin/activate && pip install -r requirements.txt

train:
	. .venv/bin/activate && rasa train

run:
	. .venv/bin/activate && rasa run --enable-api --cors "*" --debug

actions:
	. .venv/bin/activate && rasa run actions --debug

shell:
	. .venv/bin/activate && rasa shell

docker-build:
	docker compose build

docker-up:
	docker compose up --build
