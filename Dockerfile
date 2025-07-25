FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
# 复制项目文件到工作目录
COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=0 /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
