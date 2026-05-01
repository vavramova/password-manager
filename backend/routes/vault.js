import { Router } from "express";
import db from '../db.js';
import { requireAuth } from "../middleware/auth.js";
import { deriveKey, encrypt, decrypt } from "../encryption.js";

const router = Router()

router.use(requireAuth)

router.get('/', (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId)
    const key = deriveKey(user.password, user.salt)
    
    const entries = db.prepare('SELECT * FROM entries WHERE user_id = ?').all(req.userId)

    const decrypted = entries.map(entry => ({
        id: entry.id,
        title: entry.title,
        data: decrypt(entry.encrypted_data, entry.iv, entry.auth_tag, key)
    }))

    res.json(decrypted)
})

router.post('/', (req, res) => {
    const {title, data} = req.body

    const user = db.prepare('SELECT * FROM users WHERE id = ? ').get(req.userId)
    const key = deriveKey(user.password, user.salt)

    const { encrypted, iv, authTag } = encrypt(data, key)

    db.prepare('INSERT INTO entries (user_id, title, encrypted_data, iv, auth_tag) VALUES (?, ?, ?, ?, ?)'). run(req.userId, title, encrypted, iv, authTag)
    res.json({message: 'Entry saved!'})
})

router.delete('/:id', (req, res) => {
    db.prepare('DELETE FROM entries WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
    res.json({ message: 'Entry deleted!'})
})

export default router