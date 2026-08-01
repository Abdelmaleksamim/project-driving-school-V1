# Use Node.js image
FROM node:20-alpine

# Create app directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose backend port
EXPOSE 5000

# Start application
CMD ["npm", "start"]