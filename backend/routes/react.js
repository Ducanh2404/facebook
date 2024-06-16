const express = require("express");
const { reactPost, getReacts, getTotalReactOfPost } = require("../controllers/react");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.put('/reactPost', authUser, reactPost)
router.get('/getReacts/:postId', authUser, getReacts)
router.get('/getTotalReactOfPost/:postId', authUser, getTotalReactOfPost)

module.exports = router;
