FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copy backend requirements
COPY backend/requirements_simple.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements_simple.txt

# Copy frontend package.json
COPY frontend/package.json frontend/package-lock.json /app/frontend/
WORKDIR /app/frontend
RUN npm ci --only=production

# Copy all source code
COPY . /app/

# Build React app
RUN npm run build

# Switch back to app directory
WORKDIR /app

# Create necessary directories
RUN mkdir -p backend/data backend/uploads

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app
ENV NODE_ENV=production

# Start the application
CMD ["python", "backend/server_with_admin.py"]
