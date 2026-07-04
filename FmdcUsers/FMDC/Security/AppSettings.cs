namespace FMDC.Security
{
    public class AppSettings
    {

        public string Secret { get; set; } = "eyJhbGciOiJIUzUxMiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY2MzQwMzA5NCwiaWF0IjoxNjYzNDAzMDk0fQ.XMvzZ24m0v34S1KjMvq1e00SLwWMISseDJi4Kkt7Nc6YakjfZB66mG3Fg1esz9SQ_QYvWObeA1l4uc7-vGfrjA";
        public string Issuer { get; set; } = "http://localhost:4000";
        public string Audience { get; set; } = "http://localhost:4200";
        public string EncryptionKey { get; set; } = "G-KaPdSgVkYp3s6v8y/B?E(H+MbQeThW";
        public string EncryptionIv { get; set; } = "Z3JNEL9o4v1gXMFy";

    }
}