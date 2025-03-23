// utils/formatPhoneNumber.js
function formatPhoneNumber(phone) {
  if (!phone) return phone; // If phone is undefined or null, return it as is
  // Replace the + with 00
  phone = phone.replace(/^\+/, "00");
  // Remove any non-digit characters (e.g., spaces, parentheses, hyphens)
  phone = phone.replace(/\D/g, "");
  return phone;
}

module.exports = formatPhoneNumber;
