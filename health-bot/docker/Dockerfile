FROM python:3.10-slim

ENV PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps for scientific libs
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY . /app

# Train model at build time (optional for faster startup)
RUN rasa train

EXPOSE 5005 5055

CMD ["bash", "-lc", "rasa run --enable-api --cors '*' --debug & rasa run actions --debug"]
