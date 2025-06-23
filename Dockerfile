FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Fix potential Windows line endings in start.sh
RUN sed -i 's/\r$//' start.sh

RUN chmod +x start.sh

EXPOSE 5000

CMD ["./start.sh"]