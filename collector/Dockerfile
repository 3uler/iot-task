FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} app.jar
ENV RABBIT_HOST=localhost
ENTRYPOINT ["java","-jar","/app.jar"]