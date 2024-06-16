const React = require('../models/React')

exports.reactPost = async (req, res)=>{
    try {
        const { postId, react } = req.body;
        const check = await React.findOne({
            postRef: postId,
            reactBy: req.user.id
        })

        if(!check){
            const newReact = await new React({
                react,
                postRef: postId,
                reactBy: req.user.id
            }).save()
        }else{
            if(check.react == react){
                await React.findByIdAndRemove(check._id)
            }else{
                await React.findByIdAndUpdate(check._id, {
                    react
                })
            }
        }
        res.status(200).json({message: "oke"})
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.getReacts = async (req, res)=>{
    try {
        const reacts = await React.find({ postRef: req.params.postId })
        const check = await React.findOne({
            postRef: req.params.postId,
            reactBy: req.user.id
        })

        res.json({
            reacts,
            check: check?.react
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.getTotalReactOfPost = async (req, res)=>{
    try {
        const { postId } = req.params
       const totalReact = await React.find({ postRef: postId})
       return res.status(200).json({totalReact})
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}