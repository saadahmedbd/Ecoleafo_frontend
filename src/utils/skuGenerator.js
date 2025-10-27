/**
 * Generate a unique SKU from product name
 * Format: XXX-YYYY (3 chars from name + 4 random digits)
 */
export const generateSKU = (productName) => {
  // Get first 3 characters from each word, uppercase
  const namePrefix = productName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');

  // Generate random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `${namePrefix}-${randomNum}`;
};
