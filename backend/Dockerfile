# Usa la imagen de Node.js
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto de la aplicación
COPY . .

# Expone el puerto del backend
EXPOSE 5000

# Ejecuta la aplicación
CMD ["node", "server.js"]
