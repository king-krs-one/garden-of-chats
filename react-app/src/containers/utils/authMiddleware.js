import jwt_decode from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  // Decode the token and check for expiration
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp > currentTime;
};

export { isAuthenticated }