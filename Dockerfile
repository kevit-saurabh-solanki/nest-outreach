# Use official Node Alpine image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment to development (if needed)
ENV NODE_ENV=development

# Run the app in dev mode
CMD ["npm", "run", "start:dev"]
