const jwt = require("jsonwebtoken");


const verifyToken = async(req,res,next)=>{
    try {
        
        const isToken = req.cookies.accessToken;
        
    
        
        if(!isToken){
            return res.status(401).send({message:"You are not authorized for the action!"})
        }

        jwt.verify(isToken,process.env.secret,(err,user)=>{
            if(err){
                return res.status(401).send({message:"You are not authenticated!!"})
            }
            req.user = user;
            next();
        })
    } catch (error) {
        return res.status(200).send({message:"Error verifying token",error:error})
    }
}


const VerifyUser = (req,res,next)=>{
    
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id) {
          next();
        } else {
            return res.status(404).send("You are not authorized to perform this action!")
        }
      });
}


module.exports = {verifyToken,VerifyUser};