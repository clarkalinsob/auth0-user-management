FROM node:10

WORKDIR /home/node/app/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"] 
