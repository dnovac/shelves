FROM node:14
## create an /app directory within our
## image that will hold our application source
## files
RUN mkdir /app
## We specify that we now wish to execute 
## any further commands inside our /app
## directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn

# Bundle app source
COPY . /app
RUN yarn build

EXPOSE 8080:8080
## Our start command which kicks off
## our newly created binary executable
CMD ["yarn", "start"]