/**
   * Calculates and returns the original color when a darker shade is passed.
   * @param {string} darkerColor - The darker shade color in hexadecimal format (#RRGGBB).
   * @return {string} The original color in hexadecimal format (#RRGGBB).
   */
export function getOriginalColor(darkerColor) {
  const darkFactor = 0.8;
  const darkR = parseInt(darkerColor.substr(1, 2), 16);
  const darkG = parseInt(darkerColor.substr(3, 2), 16);
  const darkB = parseInt(darkerColor.substr(5, 2), 16);
  const r = Math.ceil(darkR / darkFactor);
  const g = Math.ceil(darkG / darkFactor);
  const b = Math.ceil(darkB / darkFactor);
  let originalColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  originalColor = originalColor.toUpperCase();
  return originalColor;
}

/**
   * Calculates and returns a darker shade of the given color.
   * @param {string} color - The color in hexadecimal format (#RRGGBB).
   * @return {string} The darker shade of the color in hexadecimal format (#RRGGBB).
   */
export function getDarkerShade(color) {
  const darkFactor = 0.8;
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const darkR = Math.floor(r * darkFactor);
  const darkG = Math.floor(g * darkFactor);
  const darkB = Math.floor(b * darkFactor);
  let newColor = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
  newColor = newColor.toUpperCase();
  return newColor;
}
