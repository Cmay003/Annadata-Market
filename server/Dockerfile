# Annadata Backend — Dockerfile
# Single-stage build to avoid Railway network issues with second image pulls
# Amazon Corretto 21 from ECR Public (no Docker Hub rate limits)

FROM public.ecr.aws/amazoncorretto/amazoncorretto:21-al2023

WORKDIR /app

# Install required tools:
#   tar + gzip    — Maven wrapper needs these to extract .tar.gz Maven binary
#   findutils     — provides xargs/find used during build
#   shadow-utils  — provides groupadd/useradd for non-root user creation
RUN dnf install -y tar gzip findutils shadow-utils && dnf clean all

# Copy Maven wrapper and pom first (layer caching for dependencies)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN ./mvnw package -DskipTests -B

# Non-root user for security
RUN groupadd -r annadata && useradd -r -g annadata annadata

# Move jar to a clean location and set ownership
RUN cp target/*.jar app.jar && chown annadata:annadata app.jar

USER annadata

EXPOSE 5454

ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dspring.profiles.active=prod", \
  "-jar", "app.jar"]

