# Usar una imagen ligera de Node.js
FROM node:18-alpine

# Crear y usar el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración
COPY package.json tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código (incluyendo la carpeta src)
COPY . .

# Exponer el puerto de la app
EXPOSE 3002

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]