const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");

// Get All Users
router.get("/", (req, res) => {
  db.Users.findAll()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Register
router.post("/register", (req, res) => {
  const hash = req.body.password;
  db.Users.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: hash
  }).then(newUser => {
    res.status(201).json(newUser);
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.Users.findOne({
    where: { username }
  })
    .then(user => {
      const comparePass = bcrypt.compareSync(password, user.password);
      if (comparePass && user) {
        req.session.dealer_crm = user;
        res.status(201).json({ message: `Welcome, ${user.username}` });
      } else {
        res.status(400).json({ error: "Username and Password do not match" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not find that user" });
    });
});

// Logout

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ error: "Server could not log you out" });
      } else {
        res.clearCookie("dealer_crm", { path: "/" });
        res.status(200).json({ message: "Thanks for visiting" });
      }
    });
  } else {
    res.status(200).json({ message: "You are already logged out" });
  }
});
module.exports = router;
