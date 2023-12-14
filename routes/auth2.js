// main.js
import auth from './auth';

// Attach event listener to the login button
const loginButton = document.getElementById('login-btn');

if (loginButton) {
  loginButton.addEventListener('click', () => {
    // Trigger Auth0 authentication process
    auth.authorize();
  });
} else {
  console.error('Login button not found.');
}

// Handle Auth0 callback
auth.parseHash((err, authResult) => {
  if (authResult && authResult.accessToken && authResult.idToken) {
    // User is authenticated, you can fetch user details and display them.
    auth.client.userInfo(authResult.accessToken, (err, user) => {
      console.log(user);
      // You can now handle the authenticated user, e.g., redirect to a dashboard page.
    });
  } else if (err) {
    console.error('Auth0 parseHash error:', err);
  }
});
