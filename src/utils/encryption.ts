//@ts-ignore
import cryptojs from "crypto-js";

function encrypt(hash: String, key: String) {
  let bytes = cryptojs.AES.encrypt(JSON.stringify(hash), key);
  return bytes.toString();
}

function decrypt(hash: String, key: String) {
  let bytes = cryptojs.AES.decrypt(hash, key);
  return JSON.parse(bytes.toString(cryptojs.enc.Utf8));
}

export { encrypt, decrypt };
