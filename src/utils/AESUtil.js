import CryptoJS from 'crypto-js'

/**
 * 生成 AESKEY
 * @returns {String} 返回生成的 32位 AESKEY
 */
export function createAesKey() {
  return createString(32)
}

/**
 * 生成 AES IV
 * @returns {String} 返回生成的 16位 AES IV
 */
export function createAesIv() {
  return createString(16)
}
/**
 * AES ECB 加密
 * @param data 待加密字段
 * @param aesKey 加密 key
 * @returns {String} 返回加密字段
 */
export function encryptByECB(data, aesKey) {
  var key = CryptoJS.enc.Utf8.parse(aesKey)
  data = parseToString(data)
  var srcs = CryptoJS.enc.Utf8.parse(data)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

/**
 * AES ECB 解密
 * @param data 待解密数据
 * @param aesKey 解密 key
 * @returns {String} 返回解密字符串
 */
export function decryptByECB(data, aesKey) {
  var key = CryptoJS.enc.Utf8.parse(aesKey)
  var decrypt = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * AES CBC 加密
 * @param data 待加密字段
 * @param keyStr 加密 key
 * @param aesIv  iv
 * @returns {string} 返回加密字段
 */
export function encryptByCBC(data, aesKey, aesIv) {
  var key = CryptoJS.enc.Utf8.parse(aesKey)
  var iv = CryptoJS.enc.Utf8.parse(aesIv)
  data = parseToString(data)
  var srcs = CryptoJS.enc.Utf8.parse(data)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return encrypted.toString()
}

/**
 * AES CBC 解密
 * @param data 待解密数据
 * @param keyStr 解密 key
 * @param aesIv  iv
 * @returns {string} 返回解密字符串
 */
export function decryptByCBC(data, aesKey, aesIv) {
  var key = CryptoJS.enc.Utf8.parse(aesKey)
  var iv = CryptoJS.enc.Utf8.parse(aesIv)
  var decrypt = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * 转换为字符串
 * @param {*} data
 * @returns {String}
 */
function parseToString(data) {
  var d = ''
  switch (typeof data) {
    case 'string':
      d = data
      break
    case 'object':
      d = JSON.stringify(data)
      break
    default:
      d = data.toString()
  }
  return d
}

/**
 * 生成指定位数字符
 * @param length
 * @returns {String} 返回生成的指定位数字符
 */
function createString(length) {
  var expect = length
  var str = Math.random().toString(36).substr(2)
  while (str.length < expect) {
    str += Math.random().toString(36).substr(2)
  }
  str = str.substr(0, length)
  return str
}
