/**
 *  @returns {string}
 */
export default function createTimeString() {
  return new Date().toTimeString().replace(/\s.*/, "").trim();
};
