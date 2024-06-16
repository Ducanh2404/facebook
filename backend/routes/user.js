const express = require("express");
const router = express.Router();
const { register, activateAccount, login, auth,findUser, sendResetPasswordCode, validateResetCode, changePassword, getProfile, updateProfilePicture, addFriend, cancelRequest, follow, unfollow, acceptRequest, getFriendRequest, unfriend, deleteRequest, listFriend, getChatMessages, search, saveProfileDetail, getProfileDetail } = require("../controllers/user");
const { authUser } = require("../middleware/auth");

router.post("/register", register);
router.post("/activate", activateAccount);
router.post("/login", login);
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);
router.get("/getProfile/:username", authUser, getProfile);
router.put("/updateProfilePicture", authUser, updateProfilePicture);
router.put("/addFriend/:id", authUser, addFriend);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/unfriend/:id", authUser, unfriend);
router.put("/deleteRequest/:id", authUser, deleteRequest);
router.get("/getFriendRequest/:userId", authUser, getFriendRequest);
router.get("/listFriend/:userId", authUser, listFriend);
router.get("/getChatMessages/:chatId", authUser, getChatMessages);
router.get("/search/:searchTerm", authUser, search);
router.get("/getProfileDetail/:userId", authUser, getProfileDetail);
router.post("/saveProfileDetail", authUser, saveProfileDetail);

module.exports = router;
