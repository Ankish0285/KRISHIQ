export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export const isMobile = (value) => /^[6-9]\d{9}$/.test(String(value || "").trim());

export const isStrongPassword = (value) => String(value || "").length >= 6;

export function validateLogin({ identifier, password }) {
  const errors = {};
  if (!identifier) errors.identifier = "Email or mobile is required.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

export function validateRegister(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Name is required.";
  if (!isEmail(values.email)) errors.email = "Enter a valid email.";
  if (!isMobile(values.mobile)) errors.mobile = "Enter a valid 10-digit mobile.";
  if (!isStrongPassword(values.password)) errors.password = "Password must be at least 6 characters.";
  if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  if (!values.role) errors.role = "Select a role.";
  if (!values.location?.trim()) errors.location = "Location is required.";
  return errors;
}

export function validateProduce(values) {
  const errors = {};
  if (!values.cropName) errors.cropName = "Crop name is required.";
  if (!values.category) errors.category = "Category is required.";
  if (!values.quantity || Number(values.quantity) <= 0) errors.quantity = "Enter a valid quantity.";
  if (!values.unit) errors.unit = "Unit is required.";
  if (!values.harvestDate) errors.harvestDate = "Harvest date is required.";
  if (!values.minPrice || Number(values.minPrice) <= 0) errors.minPrice = "Enter a minimum price.";
  if (!values.quality) errors.quality = "Quality grade is required.";
  if (!values.location) errors.location = "Location is required.";
  return errors;
}
