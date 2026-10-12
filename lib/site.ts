export const siteContact = {
  email: "microimofficial@gmail.com",
  whatsappDisplay: "+62 851-3747-3695",
  whatsappNumber: "6285137473695",
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteContact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
