FROM node:alpine
LABEL author="Lee Donald"
ENV NODE_ENV=development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 3000
ENTRYPOINT ["npm", "start"]