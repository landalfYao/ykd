const NODE_API = 'https://ykd.sunwou.com/'
const JAVA_API = 'https://www.sunwou.com/oneplace/'
const crypto = require('crypto');
const _algorithm = 'aes-256-cbc';
const _iv = '73546548679573675465765897096532';
const ivBuffer = new Buffer(_iv, 'hex');
const ivkey = Buffer.from('15464336451324535212156486623224', 'utf8').toString('hex');
var secrets = {};
var da = {

}
/**
 * @desc: 加密
 * @param: data: 待加密的内容； dataEncoding: 内容编码; key: 秘钥；
 *         keyEncoding: 秘钥编码； padding: 自动填充加密向量
 */
secrets.encrypt = function (data, dataEncoding, key, keyEncoding, padding) {
  let keyBuf = null;

  if (key instanceof Buffer) {
    keyBuf = key;
  } else {
    keyBuf = new Buffer(key, keyEncoding);
  }
  let dataBuf = null;
  if (data instanceof Buffer) {
    dataBuf = data;
  } else {
    dataBuf = new Buffer(data, dataEncoding);
  }
  let cipher = crypto.createCipheriv(_algorithm, keyBuf, ivBuffer);
  cipher.setAutoPadding(padding);
  let cipherData = cipher.update(dataBuf, 'buffer', 'base64');
  cipherData += cipher.final('base64');
  return cipherData;
};

/**
 * @desc:  解密
 * @param: data: 待解密的内容； dataEncoding: 内容编码; key: 秘钥；
 *         keyEncoding: 秘钥编码； padding: 自动填充加密向量
 */
secrets.decypt = function (data, dataEncoding, key, keyEncoding, padding) {

  let keyBuf = null;
  if (key instanceof Buffer) {
    keyBuf = key;
  } else {
    keyBuf = new Buffer(key, keyEncoding);
  }

  let dataBuf = null;
  if (data instanceof Buffer) {
    dataBuf = data;
  } else {
    dataBuf = new Buffer(data, dataEncoding);
  }

  var decipher = crypto.createDecipheriv(_algorithm, keyBuf, ivBuffer);
  decipher.setAutoPadding(padding);
  var decipherData = decipher.update(dataBuf, 'binary', 'binary');
  decipherData += decipher.final('binary');
  var str3 = Buffer.from(decipherData, 'binary');

  return str3.toString('utf8');
};

function filterSearch(list) {
  var array = []
  for (let i in list) {
    if (list[i].value != '') {
      array.push(list[i].key + "!like!'%" + list[i].value + "%'")
    }
  }
  return array
}

function getConfig(that, cb) {
  that.$http.get(NODE_API + "admin/getConfig").then(res => {
    if (res.data.code == 1000) {
      res.data.data = that.com.secrets.decypt(res.data.data, 'base64', that.com.ivkey, 'hex', true)
      sessionStorage.setItem("config", res.data.data);
      cb(res.data.data)
    } else {
      that.$message({
        type: "error",
        showClose: true,
        message: res.data.msg
      });
    }
  });
}
module.exports = {
  NODE_API: NODE_API,
  JAVA_API: JAVA_API,
  filterSearch: filterSearch,
  secrets: secrets,
  ivkey: ivkey,
  getConfig: getConfig,
  da: da
}
