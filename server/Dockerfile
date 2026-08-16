# Annadata Backend — Dockerfile
# Multi-stage build: Maven build → slim JRE runtime image
# Uses Amazon Corretto from ECR Public (no Docker Hub rate limits on Railway)

# Stage 1: Build
FROM public.ecr.aws/amazoncorretto/amazoncorretto:21-al2023 AS builder

WORKDIR /app

# Copy Maven wrapper and pom first (layer caching for dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime
FROM public.ecr.aws/amazoncorretto/amazoncorretto:21-al2023-headless AS runtime

WORKDIR /app

# Non-root user for security
RUN groupadd -r annadata && useradd -r -g annadata annadata

COPY --from=builder /app/target/*.jar app.jar

RUN chown annadata:annadata app.jar
USER annadata

EXPOSE 5454

ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]
