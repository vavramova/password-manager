import jwt from 'jsonwebtoken'

export function requireAuth (req, res, next){
    const header = req.headers.authorization

    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({error: 'Not logged in!'})
    }

    const token = header.slice(7)

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    }catch{
        res.status(401).json({error:'Token is invalid or expired!'})
    }
}