/**
 *  @returns {string}
 */
export default function createFileName() {
  return new Date().toDateString().replace(/\s/g, "-").trim();
};
