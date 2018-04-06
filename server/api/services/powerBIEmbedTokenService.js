var TokenProvider = require('refresh-token');
let accessToken = '';
const timeInterval = 60000 * 20;

let powerBIEmbedTokenService = {};

powerBIEmbedTokenService.setAccessToken = () => {
  powerBIEmbedTokenService.getAccessToken();
  try {
    setInterval(() => {
      powerBIEmbedTokenService.getAccessToken();
    }, timeInterval);
  } catch (e) {
    console.error(e);
  }

}

powerBIEmbedTokenService.getAccessToken = () => {
  var tokenProvider = new TokenProvider('https://login.microsoftonline.com/common/oauth2/token', {
    refresh_token: 'AQABAAAAAABHh4kmS_aKT5XrjzxRAtHzELRbB2vTfQc8YT4Y0STWr1XLSaBUIKgcWra3a1VUSdiGqPu_48F6U6lENrcFZPUIGOKKAAZS_Q_6ckaRcfnAfPpn7aX6rtZgl_GzZD1PBqSQ4OZd-Ni5xrk1TIMsUSoRcTDkiUshc9mCEYCcaK4Fgk3D1Xud0P7VTXy0TJwdLD8uVz1vxQShYKDIntMWayh6jeeaBTNh_nYIPVEWR9i-08d0t3qIPnwD5rv8-63agkIccm_CFt90B0I2wqF6Lb05qda3hPzrelEijDk-k6PSJX2GeZG6VW7fByC7ZUuhyKw1oZw9Qt9iYj2ps5wT7OIphWtaS6sxhBV8qiNlhSzl8vfeSwUtJwCaSepRvvXZ2iRrroFoTSZGKKQqvlWaGRQeaOXBliZQ-qMk2_nZeWEIbiXZEoEkUHpmA15qbNmggztIPw5_unhE2YEAHmw2YWeu7NUxfTOJKWlz4wu09JTXn-sBlTWlN00b4Tdtzhgvr1y7_chc9w_KMvFzPWa5qPXnCWP7Kd7_Hey7v4lrSBmnUL_oniW6MGhEvyLmQXhuN-4AMrqyf9hKp1AqZgI-0aOd30Fbyfux-pPD0s33gw5LUch1tS18MZXYyPcYkJ6N5JWTwHOz-YX-TG_YwlLtS38XHbXxwhlEmRngWjay-BNXC42tQnqgt4ZdBvqoBUjqJJAuuBFDLIYjkBoXiU7Q8ZBFZ3Zr37u6z0_NbJ32V6esCHuk1JMDswU4G_4kaJgJ12B-eUnN1TJ7ax8DR6BRaQMnIAA',
    client_id: 'aad830fd-3ebf-4724-94e3-732209e87d29',
    client_secret: '3sBJQRhVtAycrpC+HNLI4Zr9igM8kRbM8gElIY71t3w='
    /* you can pass an access token optionally
    access_token:  'fdlaksd',
    expires_in:    2133
    */
  });

  tokenProvider.getToken((err, token) => {
    //token will be a valid access token. 
    accessToken = token;
  });
}

powerBIEmbedTokenService.getToken = () => {
  return accessToken;
}

module.exports = powerBIEmbedTokenService;
