# Étape 1 : Construction de l'application avec Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copie le fichier pom.xml et télécharge les dépendances (optimisation pour le cache)
COPY pom.xml .
RUN mvn dependency:go-offline
# Copie le code source et construit le JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image finale pour exécuter l'application
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copie le JAR généré depuis l'étape de build
COPY --from=build /app/target/molou3_Backend-0.0.1-SNAPSHOT.jar app.jar
# Expose le port 8080 (port par défaut de Spring Boot)
EXPOSE 8080
# Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]