
export const toMessage = (err, fallback = "Något gick fel. Försök igen.") => {
  if (!err) return fallback
  // Vanliga ställen fel kan gömma sig
  const msg =
    err.message ||
    err?.response?.data?.message ||
    err?.data?.message ||
    err?.error ||
    err?.errors?.[0]?.message
  return typeof msg === "string" && msg.trim() ? msg : fallback
}