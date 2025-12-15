// src/utils/errorMessage.js
export const errorMessage = (err, fallback = "Något gick fel. Försök igen.") => {
  if (!err) return "" // no error present
  const msg =
    err?.response?.data?.message ||
    err?.data?.message ||
    err?.message ||
    err?.error ||
    err?.errors?.[0]?.message
  return typeof msg === "string" && msg.trim() ? msg : fallback
}
