FROM node:14

# Create app directory
RUN mkdir -p /usr/src/acard
WORKDIR /usr/src/acard

# Install app dependencies
COPY package.json /usr/src/acard
# COPY package*.json ./
RUN npm install

# Bundle app source
COPY . /usr/src/acard

# Build arguments
# ARG NODE_VERSION=16.12.0

# Environment
# ENV NODE_VERSION $NODE_VERSION

EXPOSE 8080
CMD [ "npm", "start"]