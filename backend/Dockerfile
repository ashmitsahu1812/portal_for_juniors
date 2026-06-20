FROM node:20-bullseye

# Install necessary compilers and runtime environments
# - clang (for C and C++)
# - g++ (optional, good to have)
# - python3 (for Python)
# - default-jdk (for Java)
RUN apt-get update && apt-get install -y \
    clang \
    g++ \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
