FROM node:18-alpine AS build

WORKDIR /app

RUN npm cache clean --force

COPY . .

RUN npm install

RUN npm run build

FROM nginx:latest AS ngi

COPY --from=build /app/dist/medi /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
