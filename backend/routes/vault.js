import { Router } from "express";
import db from '../db.js'
import { requireAuth } from "../middleware/auth.js";

const router = Router()

router.use(requireAuth)

router.get('/', (req, res) => {
    const entries = db.prepare('SELECT * FROM entries WHERE user_id = ?').all(req.userId)
    res.json(entries)
})

router.post('/', (req, res) => {
    const {title, encrypted_data, iv } = req.body
    db.prepare('INSERT INTO entries (user_id, title, encrypted_data, iv) VALUES (?, ?, ?, ?)'). run(req.userId, title, encrypted_data, iv)
    res.json({message: 'Entry saved!'})
})

router.delete('/:id', (req, res) => {
    db.prepare('DELETE FROM entries WHERE id = ? AND user_id = ?').run(req.params.id, req.userId)
    res.json({ message: 'Entry deleted!'})
})

export default router