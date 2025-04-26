FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm run build && npx serve -s build -l 3000; fi"]