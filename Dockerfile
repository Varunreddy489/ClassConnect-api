FROM node:19-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

# Command to start the server
CMD ["npm", "start"]
