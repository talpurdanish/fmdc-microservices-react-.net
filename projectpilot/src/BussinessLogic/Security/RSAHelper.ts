
import * as Forge from 'node-forge';

export class RSAHelper {
  publicKey: string = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG1qoKtynUYYy29xeELZ+m5c0Hdz
XExj5PSPAFOpnweziWfLzVr9BaXmGAAMN9q4bd/LVSyke1wrVNR+IuA3q5SXsE9x
9jmM8adQHnsoheuMV9qoFQ2mdOQ8e7A3BN3bSwiFadtsikqNDoxPE/pUmNN8x19O
ihxJh28Q5jQyuH+dAgMBAAE=
-----END PUBLIC KEY-----`;

  constructor() { }

  encrypt(valueToEncrypt: string): string {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
  }
}
