FROM node:24-alpine

ARG FIREBASE_VERSION=latest
RUN apk --no-cache add openjdk11-jre bash curl openssl && \
    npm cache clean --force && \
    npm i -g firebase-tools@$FIREBASE_VERSION
COPY scripts/serve.sh /usr/bin/
COPY firebase.json /srv/firebase/firebase.json
COPY .firebaserc /srv/firebase/.firebaserc
RUN chmod +x /usr/bin/serve.sh
WORKDIR /srv/firebase
ENTRYPOINT ["/usr/bin/serve.sh"]