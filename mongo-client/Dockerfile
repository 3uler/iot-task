FROM python:2.7-slim

ENV RABBIT_HOST=localhost
ENV MONGO_HOST=localhost
ENV MONGO_PORT=27017

ADD src/main.py requirement.txt /

RUN pip install -r requirement.txt

CMD [ "python", "./main.py" ]