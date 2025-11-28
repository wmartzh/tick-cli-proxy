# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source code and config
COPY src ./src
COPY tsconfig.json .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port
EXPOSE 8080

# Run the compiled application
CMD ["node", "dist/index.js"]
