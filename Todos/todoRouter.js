const router = require("express").Router();
const db = require("../models");
const restricted = require("../middleware/restricted");

// Get
router.get("/", (req, res) => {
  db.Todos.findAll().then(todos => {
    res.status(200).json(todos);
  });
});

// Get Todos By User Id
router.get("/all", restricted, (req, res) => {
  db.Users.findAll({
    where: {
      id: req.session.dealer_crm.id
    },
    attributes: ["firstName", "lastName", "username"],
    include: [
      {
        model: db.Todos,
        required: true
      }
    ]
  })
    .then(([todos]) => {
      res.status(200).json(todos);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "Server could not get todos with user id" });
    });
});

// Post
router.post("/", restricted, (req, res) => {
  const { title, description } = req.body;

  db.Todos.create({
    title,
    description,
    userId: req.session.dealer_crm.id
  })
    .then(newTodo => {
      res.status(201).json(newTodo);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Put
router.put("/:id", restricted, (req, res) => {
  db.Todos.update(
    {
      title: req.body.title,
      description: req.body.description,
      userId: req.session.dealer_crm.id
    },
    { returning: true, where: { id: req.params.id } }
  )
    .then(updated => {
      console.log(updated);
      res.status(200).json(updated);
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not update todo" });
    });
});

// Delete
router.delete("/:id", restricted, (req, res) => {
  const { id } = req.params;
  db.Todos.destroy({
    where: { id }
  })
    .then(deleted => {
      if (deleted === 0) {
        res.status(400).json({ error: "Could not delete todo with that id" });
      } else {
        res.status(200).json({ message: "Todo successfully deleted" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not delete todo" });
    });
});

module.exports = router;
