import crypto from 'crypto'

//const secretKey = 'ddsd4855';
//const iv = crypto.randomBytes(16);

export function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(data.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptData(data) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


