'user strict';

const bigInt = require('big-integer');
const crypto = require('crypto');

/**
 * 生成第二次AES加密的私钥
 * @return {String} 16位随机字符串
 */
function createSecretKey(length) {
  return Array.apply(0, Array(length)).map(function () {
    return (function (charset) {
      return charset.charAt(Math.floor(Math.random() * charset.length));
    }('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'));
  }).join('');
}

/**
 * AES-218-CBC加密算法
 * @param  {String} text   待加密的原始数据
 * @param  {String} secKey 加密私钥
 * @return {String}        加密后的数据
 */
function aesEncrypt(text, secKey) {
  const iv = '0102030405060708';    // 向量
  const cipher = crypto.createCipheriv('aes-128-cbc', secKey, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

/**
 * RSA加密算法
 * @param  {String} text 待加密的原始数据
 * @return {String}      加密后的数据：reverseText^pubKey%modulus
 */
function rsaEncrpt(text) {
  const modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'; // 取模
  const pubKey = '010001';      // 指数
  text = text.split('').reverse().join('');
  text = new Buffer(text).toString('hex');
  const rs = bigInt(text, 16).modPow(parseInt(pubKey, 16), bigInt(modulus, 16)).toString(16);
  return new Array(256 - rs.length + 1).join('0') + rs;
}

/**
 * 生成加密后的参数
 * @param  {String} text 待加密参数
 * @return {String}      加密后参数
 */
function getData(text) {
  const nonce = '0CoJUm6Qyw8W8jud';
  const secKey = createSecretKey(16);
  const params = aesEncrypt(aesEncrypt(text, nonce), secKey);
  const encSecKey = rsaEncrpt(secKey);
  return {params: params, encSecKey: encSecKey};
}
exports.getData = getData;
