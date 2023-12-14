// auth.js
import auth0 from 'auth0-js';

const auth = new auth0.WebAuth({
    domain: 'dev-bhkftzl8wc0atcup.us.auth0.com',
    clientID: 'MvskgbwJ1B5u2qRoyeuFJ9PpiOq6dr46',
    responseType: 'token id_token',
    redirectUri: 'https://langenheim-a07134ab155c.herokuapp.com',
});

export default auth;
