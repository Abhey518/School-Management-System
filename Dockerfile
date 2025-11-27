# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install http-server globally for serving static files
RUN npm install -g http-server

# Expose port 8080
EXPOSE 8080

# Start the HTTP server
CMD ["http-server", "-p", "8080", "-c-1"]
