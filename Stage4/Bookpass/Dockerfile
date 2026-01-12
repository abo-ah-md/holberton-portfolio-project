# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build with production API URL
ARG VITE_API_URL=https://api.book-pass.com
ARG VITE_MOYASAR_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MOYASAR_PUBLIC_KEY=$VITE_MOYASAR_PUBLIC_KEY

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
