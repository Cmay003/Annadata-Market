# Annadata Backend — Dockerfile
# Multi-stage build: Maven build → slim JRE runtime image

# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom first (layer caching for dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy AS runtime

WORKDIR /app

# Non-root user for security (use groupadd/useradd — Alpine addgroup/adduser crash on Railway)
RUN groupadd -r annadata && useradd -r -g annadata annadata

COPY --from=builder /app/target/*.jar app.jar

RUN chown annadata:annadata app.jar
USER annadata

EXPOSE 5454

ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]
