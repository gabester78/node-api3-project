const express = require("express");
const router = express.Router();
// const server = express();
const db = require("./userDb");
const postDb = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  db.insert(req.body)
    .then((article) => {
      res.status(201).json(article);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  req.body.user_id = req.params.id;
  postDb
    .insert(req.body)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Can't post the message." });
    });
});

router.get("/", (req, res) => {
  db.get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Users not found." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  let id = req.params.id;
  db.getById(id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Can't get the user" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  let id = req.params.id;
  db.getUserPosts(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Can't get the posts." });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  let id = req.params.id;
  db.remove(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Can't remove user." });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  let id = req.params.id;
  db.update(id, req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Can't update user." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then((users) => {
      if (users) {
        next();
      } else {
        res.status(404).send("User doesn't exsist");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error validating user id");
    });
}

function validateUser(req, res, next) {
  // console.log("obkeys", Object.keys(req.body));
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      errorMessage: "User data is missing",
    });
  } else if (req.body.name === undefined || req.body.name === "") {
    res.status(400).json({
      errorMessage: "User name is missing",
    });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({
      errorMessage: "Post text is missing",
    });
  } else if (req.body.text === undefined || req.body.text === "") {
    res.status(400).json({
      errorMessage: "Post text is missing",
    });
  } else {
    next();
  }
}

module.exports = router;
