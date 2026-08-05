export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export function validatePassword(password) {

  return password.length >= 8;

}