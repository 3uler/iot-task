FROM maven:3-jdk-8 AS build  
COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package

FROM openjdk:8-jdk-alpine
COPY --from=build /usr/src/app/target/collector-0.0.1-SNAPSHOT.jar /usr/app/collector-0.0.1-SNAPSHOT.jar
ENV RABBIT_HOST=localhost
ENTRYPOINT ["java","-jar","/usr/app/collector-0.0.1-SNAPSHOT.jar"] 