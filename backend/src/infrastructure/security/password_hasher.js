const crypto = require('node:crypto')
const { promisify } = require('node:util')

const scryptAsync = promisify(crypto.scrypt)

async function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = await scryptAsync(plainPassword, salt, 64)
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

async function verifyPassword(plainPassword, storedHash) {
  if (!storedHash || !storedHash.startsWith('scrypt:')) {
    return false
  }

  const [, salt, expectedHex] = storedHash.split(':')
  if (!salt || !expectedHex) {
    return false
  }

  const derivedKey = await scryptAsync(plainPassword, salt, 64)
  const actualHex = derivedKey.toString('hex')

  const expectedBuffer = Buffer.from(expectedHex, 'hex')
  const actualBuffer = Buffer.from(actualHex, 'hex')

  if (expectedBuffer.length !== actualBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer)
}

module.exports = { hashPassword, verifyPassword }
