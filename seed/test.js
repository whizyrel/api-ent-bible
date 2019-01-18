const CryptoJS = require('crypto-js');
const urlEncKey = 'hi there';
const key = '5c3d0ca8361d201ed785e945';

// const encodedData = CryptoJS.AES.encrypt('olaleyeisrael@gmail.com', urlEncKey);

const buffer = Buffer.from(key).toString('base64');
console.log(buffer);

console.log('----------------------------------------------');
const buff = Buffer.from(buffer, 'base64').toString('ascii');
console.log(buff);

/* const decodedData = CryptoJS.AES.decrypt(encodedData.toString(), urlEncKey);
console.log(decodedData.toString(CryptoJS.enc.Utf8)); */
