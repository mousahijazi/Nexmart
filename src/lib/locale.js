export function getLocalizedField(obj, fieldName, locale) {
  if (!obj) return "";

  const localizedKey = `${fieldName}_${locale}`;

  if (obj[localizedKey]) {
    return obj[localizedKey];
  }

  return obj[fieldName] || obj.title_en || obj.title_ar || "";
}