/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {string} imageUrl
 */

/**
 * @typedef {Product & { quantity: number }} CartItem
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} userId
 * @property {CartItem[]} items
 * @property {number} total
 * @property {'pending' | 'paid' | 'delivered'} status
 * @property {Date} createdAt
 */
