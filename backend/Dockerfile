# Usa la imagen de Node.js
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Instala dockerize
ENV DOCKERIZE_VERSION v0.8.0

RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto de la aplicación
COPY . .

# Expone el puerto del backend
EXPOSE 5000

# Ejecuta la aplicación
CMD ["dockerize", "-wait", "tcp://mysql:3306", "-timeout", "30s", "node", "server.js"]
