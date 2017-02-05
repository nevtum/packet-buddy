FROM node:7.4.0

MAINTAINER Neville Tummon

RUN mkdir -p web_app
ADD . web_app/
WORKDIR /web_app
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "server"]