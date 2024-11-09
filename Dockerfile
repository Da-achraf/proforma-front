# Build stage
FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm install --force
COPY . .
RUN npm run build


# Deploy the dist to nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/proforma-invoice /usr/share/nginx/html
EXPOSE 80