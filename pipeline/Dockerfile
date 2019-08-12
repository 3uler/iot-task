FROM python:2.7-slim

ENV BATCH_SIZE=10
ENV RABBIT_HOST=localhost

ADD src/main.py requirement.txt /

RUN pip install -r requirement.txt

CMD ./main.py ${BATCH_SIZE}