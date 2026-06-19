import sodium from "libsodium-wrappers-sumo";
import { utf8ToBytes } from '@noble/hashes/utils.js';
import { scrypt } from '@noble/hashes/scrypt.js';

const KeyLength = 32

export const deriveMasterKey = (secret: string, salt: string): Uint8Array => {
    return scrypt(utf8ToBytes(secret), utf8ToBytes(salt), { N: 32768, r: 8, p: 1, dkLen: KeyLength });
}

export const decrypt = async (ciphertext: Uint8Array, key: Uint8Array, nonce: Uint8Array): Promise<Uint8Array> => {
    await sodium.ready;

    return sodium.crypto_stream_xchacha20_xor(
        ciphertext,
        nonce,
        key,
    );
}