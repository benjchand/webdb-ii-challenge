const knex = require("knex");
const router = require("express").Router();

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
};

router.post("/bears/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    sendUserError(400, "Please provide a name for the bear", res);
    return;
  }
  db("bears")
    .insert(req.body, "name")
    .then(ids => {
      db("bears")
        .where({ id: ids[0] })
        .first()
        .then(role => {
          res.status(201).json(role);
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
    .catch(err => {
      sendUserError(
        500,
        "Something went wrong making the bear.  Try Again!",
        res
      );
    });
});

router.get("/bears/", (req, res) => {
  db("bears")
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/bears/:id", (req, res) => {
  // const { id } = req.params;
  db("bears")
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        sendUserError(404, "Bear not found!", res);
      }
    })
    .catch(err => {
      sendUserError(500, err, res);
    });
});

router.delete("/bears/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count === 0) {
        sendUserError(
          404,
          "The bear with the specified ID does not exist.",
          res
        );
        return;
      } else {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} deleted`
        });
      }
    });
});

router.put("/bears/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} updated`
        });
      } else {
        sendUserError(404, "Bear does not exist", res);
      }
    })
    .catch(err => {
      sendUserError(500, "Something went WRONG", res);
    });
});

module.exports = router;
