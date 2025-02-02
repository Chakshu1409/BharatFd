# Use official Node.js LTS image
FROM node:18-alpine
# Create app directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install app dependencies
RUN npm install
# Copy the rest of the application
COPY . .
# Build (if you have a build step, e.g., transpile TypeScript)
# RUN npm run build
# Expose the port
EXPOSE 4000
# Start the server
CMD [ "npm", "start" ]