FROM node
WORKDIR /usr/src/app
COPY ./dist ./dist
COPY ./package.json ./
COPY ./.env ./
RUN npm install
EXPOSE 5002
CMD [ "npm", "start" ]
