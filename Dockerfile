# Use the official Node.js image.
FROM node

# Create and set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory.
COPY package*.json /app/

# Install dependencies.
RUN npm install

# Copy the rest of the application files to the working directory.
COPY . .

# Start the application with nodemon using npx.
CMD ["npx", "nodemon", "app.js"]
