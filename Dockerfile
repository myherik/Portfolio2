FROM node
WORKDIR /usr/src/app/Backend
COPY ./Backend/package*.json ./
RUN npm install
WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/Backend
EXPOSE 8080
CMD [ "./startscript.sh" ]