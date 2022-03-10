import cryptojs from "crypto-js";

import axios from "axios";

const api_key = process.env.API_KEY;
const hash_key = process.env.HASH_KEY;

console.log(api_key, hash_key);

function encrypt(hash, key) {
    try {
        let bytes = cryptojs.AES.encrypt(JSON.stringify(hash), key);
        return bytes.toString();
    } catch (error) {
        return null;
    }
}



axios.post('https://lakecreekgames-neoprint3d.vercel.app/cronIndex', {
    api_key: encrypt(
        api_key, hash_key
    ),
})