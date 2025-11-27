# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Expose the port
EXPOSE 8080


# Run the application
CMD ["npm", "start"]
