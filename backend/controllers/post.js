const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req,res)=>{
  try {
    const posts = await Post.find().populate('user','first_name last_name picture username gender text').populate("comments.commentBy", "first_name last_name picture username").sort({ createdAt: "desc" })
    res.json(posts)
  } catch (error) {
    console.log(error)
  }
}

exports.comment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    console.log(postId)
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            commentBy: req.user.id,
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture first_name last_name username");
    res.json(newComments.comments);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getCommentByPost = async (req,res)=>{
  try {
    const { postId } = req.params
    const commentOfPost = await Post.findById(postId).populate("comments.commentBy", "picture first_name last_name username");
    if(!commentOfPost){
      return res.status(400).json({ message:'This postId is incorrect' });
    }
    res.status(200).json(commentOfPost.comments)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

exports.getPostComment = async (req,res)=>{
  try {
    const { postId } = req.params
    const post = await Post.findById(postId)
    const totalComment = post.comments.length
    return res.status(200).json({ totalComment })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

exports.deletePost = async (req,res)=>{
  try {
    const { postId } = req.params
    const post = await Post.findOneAndDelete({_id: postId})
    return res.status(200).json(post)
  } catch (error) {
    console.log(error.message)
    return res.status(400).json({ message: error.message });
  }
}

exports.getUserPosts = async (req,res)=>{
  try {
    const { userId } = req.params
    const post = await Post.find({user: userId}).populate('user','first_name last_name picture username gender text').populate("comments.commentBy", "first_name last_name picture username").sort({ createdAt: "desc" })
    return res.status(200).json(post)
  } catch (error) {
    console.log(error.message)
    return res.status(400).json({ message: error.message });
  }
}

exports.getFollowingPost = async (req,res)=>{
  try {
    let arr = []
    const userId = req.user.id
    const userFollowing = await User.findById(userId).select("following")
    if(userFollowing.following.length > 0){
      const promises = userFollowing.following.map(id=>{
        return Post.find({ user: id }).populate('user','first_name last_name picture username gender text').populate("comments.commentBy", "first_name last_name picture username").sort({ createdAt: "desc" })
        .then(result => result)
        .catch(e=>{
          console.log(e)
        })
      })
      arr = await Promise.all(promises);
      return res.status(200).json(arr.flat());
    }
    return res.json(userFollowing.following)
  } catch (error) {
    console.log(error.message)
    return res.status(400).json({ message: error.message });
  }
}