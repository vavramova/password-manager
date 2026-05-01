import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32

export function deriveKey( password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256')
}

export function encrypt (text, key){
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return {
        encrypted: encrypted.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    }
}

export function decrypt( encyptedHex, ivHex, authTagHex, key){
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'))

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encyptedHex, 'hex')),
        decipher.final()
    ])

    return decrypted.toString('utf8')
}