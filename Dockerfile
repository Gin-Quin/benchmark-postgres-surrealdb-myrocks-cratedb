FROM imbios/bun-node

WORKDIR /app

# root files needed for the build
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

# packages needed for the build
COPY src src/
COPY tests tests/

RUN npm install

EXPOSE $PUBLIC_PORT

CMD ["bun", "run", "src/server.ts"]
