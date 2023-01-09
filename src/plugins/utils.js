/**
 *
 * @param {string} type local or session
 * @param {string} key storage key
 *
 * @returns
 */
export function getJSONStorage(type, key) {
  try {
    let storageString;
    if (type === "session") {
      storageString = sessionStorage.getItem(key);
    }
    if (type === "local") {
      storageString = localStorage.getItem(key);
    }

    if (!storageString) return {};

    return isJsonString(storageString) ? JSON.parse(storageString) : {};
  } catch (e) {
    return {};
  }
}

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
