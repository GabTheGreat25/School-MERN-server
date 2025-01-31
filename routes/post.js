const express = require("express");
const router = express.Router();

// import controller methods

const { create, list, read, update, remove } = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");

router.post("/post", requireSignin, create);
// router.post('/post', create);
router.get("/posts", list);
router.get("/post/:slug", read);
router.put("/post/:slug", update);
router.delete("/post/:slug", remove);
router.get("/secret", requireSignin, (req, res) => {
  res.json({
    data: req.user.name,
  });
});
module.exports = router;
