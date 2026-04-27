import { Router } from "express";
import db from '../db.js'
import { hashPassword, verifyPassword } from "../crypto.js";

const router =  Router()

// Register a new user
router.post('/register', async (req, res) => {
    const { email, password} = req.body

    //validation
    if(!email || !password) {
        return res.status(400).json( {error: 'Email and password are required!' } )
    }

    if(password.length < 8){
        return res.status(400).json( {error: 'Password must be at least 8 characters' } )
    }

    //if email already exists
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email)

    if(exists){
        return res.status(409).json( {error: 'Account with this email already exists!' } )
    }

    //hash and save user
    const { hash, salt } = await hashPassword(password)
    db.prepare('INSERT INTO users (email, password, salt) VALUES (?, ?, ?)').run(email,hash, salt)

    res.json( {message: 'Account created successfully!' } )
})

//Login
router.post('/login', async (req, res) => {
    const {email, password} = req.body

    //find the user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

    if(!user){
        return res.status(401).json( {error: 'Invalid email or password!' } )
    }

    //check password
    const isValid = await verifyPassword(password, user.password)

    if(!isValid){
        return res.status(401).json( { error: 'Invalid email or password!' } )
    }

    res.json( {message: 'Logged in!', userId: user.id })
})

export default router