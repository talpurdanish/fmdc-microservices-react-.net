using Microsoft.Extensions.Options;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Security;
using System.Security.Cryptography;
using System.Text;

namespace FMDC.Security
{

    public interface IEncryptionHandler
    {
       
        string DecryptRsa(string encryptedString);
        string EncryptRsa(string plainString);

    }
    public class EncryptionHandler : IEncryptionHandler
    {
        
        private readonly string _keyFileName = "private.pem";
        private readonly string _keyFilePath = "Security";
        private readonly RSACryptoServiceProvider _cryptoServiceProvider;

        public EncryptionHandler()
        {
            _cryptoServiceProvider = GetPrivateKeyFromFile();
        }


       

        public string DecryptRsa(string encryptedString)
        {
            var plainString = _cryptoServiceProvider.Decrypt(Convert.FromBase64String(encryptedString), false);
            return Encoding.UTF8.GetString(plainString, 0, plainString.Length);
        }

        private RSACryptoServiceProvider GetPrivateKeyFromFile()
        {
            using TextReader privateKeyStringReader = new StringReader(File.ReadAllText(GetPath()));
            AsymmetricCipherKeyPair pemReader = (AsymmetricCipherKeyPair)new PemReader(privateKeyStringReader).ReadObject();
            RSAParameters rsaKeyParameters = DotNetUtilities.ToRSAParameters((RsaPrivateCrtKeyParameters)pemReader.Private);
            RSACryptoServiceProvider cryptoProvider = new();
            cryptoProvider.ImportParameters(rsaKeyParameters);
            return cryptoProvider;
        }

        public string EncryptRsa(string plainString)
        {
            var encryptedString = _cryptoServiceProvider.Encrypt(Encoding.UTF8.GetBytes(plainString), false);
            return Encoding.UTF8.GetString(encryptedString, 0, encryptedString.Length);
        }

        private string GetPath()
        {
            var path = Path.Combine(".", _keyFilePath);
            return Path.Combine(path, _keyFileName);
        }
    }
}
