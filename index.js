const express = require("express");
const helmet = require("helmet");

const rolesRouter = require("./roles/roles-router.js");

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.use("/api/zoos", rolesRouter);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
