/**
 * Helper to generate a WhatsApp link with a pre-filled message
 * @param {string} phone - The WhatsApp number
 * @param {string} productName - Name of the product
 * @param {string} productPrice - Formatted price of the product
 * @param {string} shopName - Name of the shop
 * @returns {string} - The WhatsApp URL
 */
export const getWhatsAppLink = (phone, productName, productPrice, shopName = 'SWEETO-HUB', imageUrl = '', selectedColor = null) => {
  if (!phone) return null;
  
  const cleanPhone = phone.replace(/\D/g, '');
  let message = '';
  
  if (imageUrl && imageUrl.startsWith('http')) {
    message += `${imageUrl}\n\n`;
  }
  
  message += `🛒 *ORDER REQUEST - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello! I would like to order:\n\n`;
  message += `🏷️ *${productName}*\n`;
  if (selectedColor) {
    message += `🎨 *Color:* ${selectedColor.name}\n`;
  }
  message += `💰 *Price:* ${productPrice}\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ _Sent via Sweeto-Tech premium storefront_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Helper to generate a WhatsApp link for checking availability
 * @param {string} phone - The WhatsApp number
 * @param {string} productName - Name of the product
 * @param {string} shopName - Name of the shop
 * @param {string} imageUrl - Product image URL
 * @param {object} selectedColor - The selected color variant
 * @returns {string} - The WhatsApp URL
 */
export const getInquiryWhatsAppLink = (phone, productName, shopName = 'SWEETO-HUB', imageUrl = '', selectedColor = null) => {
  if (!phone) return null;
  
  const cleanPhone = phone.replace(/\D/g, '');
  let message = '';
  
  if (imageUrl && imageUrl.startsWith('http')) {
    message += `${imageUrl}\n\n`;
  }
  
  message += `🙋‍♂️ *AVAILABILITY INQUIRY - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello! I'm interested in this item:\n\n`;
  message += `📦 *Product:* ${productName}\n`;
  if (selectedColor) {
    message += `🎨 *Color:* ${selectedColor.name}\n`;
  }
  message += `\n`;
  message += `Is this currently available in stock?\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ _Sent via Sweeto-Tech premium storefront_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Helper to generate a WhatsApp link for the entire cart
 * @param {string} phone - The WhatsApp number
 * @param {Array} items - Array of cart items
 * @param {number} total - Total price
 * @param {string} shopName - Name of the shop
 * @param {function} formatPrice - Price formatter function
 * @returns {string} - The WhatsApp URL
 */
export const getCartWhatsAppLink = (phone, items, total, shopName = 'SWEETO-HUB', formatPrice, customerDetails = null) => {
  if (!phone || !items || items.length === 0) return null;

  const cleanPhone = phone.replace(/\D/g, '');
  let message = '';

  message += `🛒 *NEW ORDER REQUEST - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  if (customerDetails) {
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Location: ${customerDetails.location}\n`;
    if (customerDetails.notes) {
      message += `Notes: ${customerDetails.notes}\n`;
    }
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
  }

  message += `📦 *ORDER ITEMS*\n`;
  items.forEach(item => {
    message += `• *${item.name}*\n`;
    if (item.selectedColor) {
      message += `  Color: ${item.selectedColor.name}\n`;
    }
    message += `  Qty: ${item.quantity} × ${formatPrice(item.price)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL: ${formatPrice(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  message += `✨ _Sent via Sweeto-Tech Storefront_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
