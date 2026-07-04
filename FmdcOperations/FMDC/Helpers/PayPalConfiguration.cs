//using PayPal.Api;

namespace FMDC.Helpers
{
    public static class PayPalConfiguration
    {
        static PayPalConfiguration() { }

        public static Dictionary<string, string> GetConfig(string mode)
        {

            return new Dictionary<string, string>(){
                { "mode", mode }};
        }

        //private static string GetAccessToken(string clientId, string secret, string mode)
        //{

        //    var accessToken = new OAuthTokenCredential(clientId, secret, new Dictionary<string, string>(){
        //        { "mode", mode }}).GetAccessToken();
        //    return accessToken;
        //}

        //public static APIContext GetApiContext(string clientId, string secret, string mode)
        //{
        //    var apiContext = new APIContext(GetAccessToken(clientId, secret, mode));
        //    apiContext.Config = GetConfig(mode);
        //    return apiContext;

        //}

    }
}
