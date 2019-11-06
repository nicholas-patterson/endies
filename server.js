const express = require("express");
require("dotenv").config();

// Routes
const UserRouter = require("./Users/UserRoutes");
const todosRouter = require("./Todos/todoRouter");
// Cors
const cors = require("cors");
const server = express();

const db = require("./models/index");
// Redis Setup
const redis = require("redis");
const session = require("express-session");
const redisClient = redis.createClient(process.env.REDIS_URL);
const redisStore = require("connect-redis")(session);

// production redis url
let redis_url;

if (process.env.ENVIRONMENT === "development") {
  redis_url = "redis://127.0.0.1";
} else {
  redis_url = process.env.REDIS_URL;
}

server.use(
  cors({
    credentials: true,
    origin: "client-40jwsl6zl.now.sh"
  })
);

server.use(
  session({
    secret: "ThisIsMySessionSecret",
    name: "dealer_crm",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    store: new redisStore({
      // host: "127.0.0.1",
      // port: 6379,
      client: redisClient,
      ttl: 86400
    })
  })
);

server.use(express.json());
server.use("/api/users", UserRouter);
server.use("/api/todos", todosRouter);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = server;
