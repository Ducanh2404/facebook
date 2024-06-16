const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const { generateToken } = require("../helpers/tokens");
const { validateEmail, validateLength } = require("../helpers/validation");
const User = require("../models/User");
const Code = require("../models/Code");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateCode } = require("../helpers/generateCode");
const Message = require("../models/Message");
const Profile = require("../models/Profile");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "invalid email address",
      });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "The email address is already exist",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "first name must between 3 and 30 characters",
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "last name must between 3 and 30 characters",
      });
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "password must be atleast 6 characters",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const username = first_name.toLowerCase() + last_name.toLowerCase();

    const user = await new User({
      first_name,
      last_name,
      email,
      username,
      password: hashPassword,
      bYear,
      bMonth,
      bDay,
      gender,
      picture:'../../images/default_pic.png'
    }).save();

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    const url = process.env.NODE_ENV === 'production' ? `${process.env.PRODUCTION_URL}/activate/${emailVerificationToken}` : `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");

    res.send({
      id: user._id,
      userName: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      message: "Register Success ! please activate your email to start",
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    const userDecode = jwt.verify(token, process.env.TOKEN_SECRET);
    const userIsExist = await User.findById(userDecode.id);
    if (userIsExist.verified) {
      res.status(400).json({
        message: "this account is already active",
      });
    } else {
      await User.findByIdAndUpdate(userDecode.id, { verified: true });
      res.status(200).json({
        message: "Activate account successfully",
        picture: userIsExist.picture,
        first_name: userIsExist.first_name,
        last_name: userIsExist.last_name
      });
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Người dùng không tồn tại",
      });
    }
  
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }
    if (!user.verified) {
      return res.status(400).json({
        message: "Tài khoản chưa được kích hoạt",
      });
    }
    const token = generateToken({id: user._id.toString()}, '7d')
    return res.send({
      id: user._id,
      username:user.username,
      picture:user.picture,
      first_name:user.first_name,
      last_name:user.last_name,
      token,
      verified:user.verified,
      message:"Login successfully"
    });
  } catch (error) {
    console.log(error)
  }
};

exports.findUser = async (req,res)=>{
  try {
    const { email } = req.body
    const user = await User.findOne({email}).select('-password')
    if(!user){
      return res.status(400).json({
        message:'Account does not exist'
      })
    }

    return res.status(200).json({
      email: user.email,
      picture: user.picture
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

exports.sendResetPasswordCode = async (req,res)=>{
  try {
    const { email } = req.body
    const user = await User.findOne({ email }).select('-password')
    await Code.findOneAndRemove({ user: user._id})
    const code = generateCode(5)
    const savedCode = await new Code({
      code,
      user:user._id
    }).save()
    sendResetCode(user.email, user.first_name, code)
    return res.status(200).json({
      message: 'Email reset code has been sent to your email'
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

exports.validateResetCode = async (req,res)=>{
  try{
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const dbCode = await Code.findOne({ user: user._id });
    
    if(dbCode.code !== code){
      return res.status(400).json({
        message: "Verification code is wrong!"
      })
    }
    return res.status(200).json({
      message: "Verification code is ok!"
    })
  } catch(error){
    res.status(400).json({
      message:error.message
    })
  }
}

exports.changePassword = async (req,res)=>{
  const { email, password } = req.body;

  const cryptedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { password: cryptedPassword});
  return res.status(200).json({
    message: 'Password was changed successfully!'
  })
}

exports.getProfile = async (req,res)=>{
  try{
    const { username } = req.params
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username }).select("-password")
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if(!profile){
      return res.status(200).json({ ok: false })
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }
    return res.status(200).json({...profile.toObject(), friendship})
  }catch(error){
    res.status(400).json({
      message:error.message
    })
  }
}

exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { follower: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "friend request has been sent" });
      } else {
        return res.status(400).json({ message: "Already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { follower: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "you successfully canceled request" });
      } else {
        return res.status(400).json({ message: "Already Canceled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't cancel a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.follower.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { follower: sender._id },
        });

        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);

      if (
        receiver.follower.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { follower: sender._id },
        });

        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "unfollow success" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $push: { friends: sender._id, following: sender._id },
        });
        await sender.updateOne({
          $push: { friends: receiver._id, follower: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({ message: "friend request accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't accept a request from  yourself" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: {
            friends: sender._id,
            following: sender._id,
            follower: sender._id,
          },
        });
        await sender.updateOne({
          $pull: {
            friends: receiver._id,
            following: receiver._id,
            follower: receiver._id,
          },
        });

        res.json({ message: "unfriend request accepted" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfriend yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $pull: {
            requests: sender._id,
            follower: sender._id,
          },
        });
        await sender.updateOne({
          $pull: {
            following: receiver._id,
          },
        });

        res.json({ message: "delete request accepted" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res.status(400).json({ message: "You can't delete yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFriendRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendRequest = await User.findById(userId).select('requests');

    let arr = [];

    if (friendRequest.requests.length > 0) {
      const promises = friendRequest.requests.map(id => {
        return User.findById(id).select('first_name last_name picture username')
          .then(result => result)
          .catch(err => console.log(err));
      });
      arr = await Promise.all(promises);
      return res.status(200).json(arr);
    }
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listFriend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const listOfFriend = await User.findById(userId).select('friends');

    let arr = [];

    if (listOfFriend.friends.length > 0) {
      const promises = listOfFriend.friends.map(id => {
        return User.findById(id).select('first_name last_name picture username')
          .then(result => result)
          .catch(err => console.log(err));
      });
      arr = await Promise.all(promises);
      return res.status(200).json(arr);
    }
    res.status(200).json(listOfFriend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatMessages = async (req,res)=>{
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.search = async (req,res)=>{
  try {
    const searchTerm = req.params.searchTerm
    const result = await User.find({$text: { $search: searchTerm } }).select('first_name last_name username picture')
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.saveProfileDetail = async (req, res) => {
  try {
    const { bio, otherName, job, highschool, relationship, living, hometown, workplace } = req.body;
    const userId = req.user.id
    await Profile.findOneAndRemove({ user: userId })
    const result = await Profile.create({
      user:userId,
      bio,
      otherName,
      job,
      workplace,
      highschool,
      living,
      hometown,
      relationship,
    });

    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfileDetail = async (req, res) => {
  try {
    const userId = req.params.userId
    const result = await Profile.findOne({ user: userId })

    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};