const jwt = require('jsonwebtoken')

exports.authUser = async(req,res,next)=>{
    try {
        let tmp = req.header('Authorization')
        const token = tmp ? tmp.slice(7) : ''
        if(!token) return res.status(401).json({message: 'Invalid Authentication'})
        jwt.verify(token,process.env.TOKEN_SECRET,(error,user)=>{
            if(error){
                return res.status(401).json({message: 'Invalid Authentication'})
            }
            req.user = user
            next()
        })
    } catch (error) {
        console.log(error)
    }
}