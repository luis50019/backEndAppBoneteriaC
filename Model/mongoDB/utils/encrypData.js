import crypto from 'crypto'

const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(data.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}