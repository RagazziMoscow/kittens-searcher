FROM node:16
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "http-server", "dist" ]
