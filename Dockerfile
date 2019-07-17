FROM circleci/node:10.11

# This is the directory the user in the circleci/node image can write to
WORKDIR /home/circleci

# Everything that isn't in .dockerignore ships
COPY . .

# Allow circleci user to run npm build
USER root
RUN /bin/bash -c 'chown -R circleci dist node_modules'

# Build and run app using non-privileged account
USER circleci

# Install dependencies
RUN npm install

# Build the app *within* the container because environment variables are fixed at build-time
RUN npm run build

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
