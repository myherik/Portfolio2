FROM node
WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/Backend
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]