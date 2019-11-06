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

server.use(
  cors({
    credentials: true,
    origin: "https://client.nicholaspatterson36.now.sh"
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
      host: "ec2-100-24-189-176.compute-1.amazonaws.com",
      user: "h",
      port: 22119,
      password:
        "pf49bdb9339f5cbf4a5ba56801d52cdf456538846c9397c16f0126c00b11625dc",
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
