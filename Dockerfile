FROM node
WORKDIR /usr/src/app/Backend
COPY ./Backend/package*.json ./
RUN npm install
WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/Backend
EXPOSE 8080
#RUN sed -i -e 's/\r$//' startscript.sh
#CMD [ "./startscript.sh" ]
CMD sed -i -e 's/\r$//' startscript.sh && ./startscript.sh