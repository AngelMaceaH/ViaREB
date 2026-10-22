const crypto = require('node:crypto')
const { promisify } = require('node:util')

const scryptAsync = promisify(crypto.scrypt)

async function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await scryptAsync(plainPassword, salt, 64)
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

module.exports = { hashPassword }
