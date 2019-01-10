const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

exports.encrypt = (string) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(string);
  encrypted = Buffer.concat([encrypted, cipher.final()])
  // return iv.toString('hex') + '~' + encrypted.toString('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  }
}

exports.decrypt = (string) => {
  const encArr = string.split('~');
  const enc = { iv: encArr[0].toString("hex"), encryptedData: encArr[1].toString("hex") };
  console.log(encArr);
  console.log(enc);
  let iv = Buffer.from(enc.iv, 'hex');
  console.log(iv);
  let encryptedText = Buffer.from(enc.encryptedData, 'hex');
  console.log(encryptedText);
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  console.log(decipher);
  let decrypted = decipher.update(encryptedText);
  console.log(decrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log(decrypted);
  return decrypted.toString(); 
};