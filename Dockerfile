# Usar una imagen base de Node
FROM node:18.17

WORKDIR /app

COPY package.json yarn.lock ./

# COPY .env .env

# Instala las dependencias, incluyendo las de 'devDependencies' para el build
RUN yarn install --frozen-lockfile

COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

EXPOSE $NODE_ENV_PORT

EXPOSE $DATABASE_PORT

# Construye la aplicación para producción
RUN if [ "$NODE_ENV" = "production" ]; then yarn build; fi

# Inicia el servidor de desarrollo o producción según la variable NODE_ENV
CMD if [ "$NODE_ENV" = "production" ]; then yarn start; else yarn dev; fi
