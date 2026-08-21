// Input validation utilities

// Simple email format validation using regex
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password must be at least 8 characters
export function validatePassword(password) {
  return password.length >= 8;
}
