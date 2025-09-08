.PHONY: train up down logs

train:
	docker compose run --rm rasa train | cat

up:
	docker compose up -d

down:
	docker compose down -v

logs:
	docker compose logs -f | cat

