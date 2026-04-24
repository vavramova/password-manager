import bcrypt from 'bcryptjs'

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    return { hash, salt }
}

export async function verifyPassword(password, storedHash) {
    return bcrypt.compare(password, storedHash)
}