import { BigNumber } from "ethers";

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
export async function getStorageFields(fields) {
  const obj = {};

  for await (const iterator of fields) {
    obj[iterator] = sessionStorage.getItem(iterator);
  }

  return obj;
}
// splis a list into n filters lists based on a single field
// export function splitIntoTwoLists(mainList, field, filters) {
//   const splitLists = [];

//   for (let i = 0; i < filters.length; i++) {
//     const filter = filters[i];

//     const list1 = mainList.filter((obj) => obj[field] === filter);
//     splitLists.push(list1);
//   }

//   return splitLists;
// }

/**
 * Splits a given list of objects into two separate lists based on a specified field and filter criteria.
 *
 * @param {Array} mainList - The main list of objects to be split.
 * @param {string} field - The field name used for filtering the objects.
 * @param {Array} filters - An array of filter criteria to split the list.
 * @returns {Array} An array of @param filters.length lists, each containing objects that match the respective filter criteria.
 */
export function splitIntoTwoLists(mainList, field, filters) {
  const splitLists = Array.from(new Array(filters.length), () => []);
  for (const obj of mainList) {
    const fieldValue = obj[field];
    const filterIndex = filters.indexOf(fieldValue);

    if (filterIndex !== -1) {
      splitLists[filterIndex].push(obj);
    }
  }

  return splitLists;
}

export function compareBalance(num1, num2) {
  const bn1 = BigNumber.from(num1);
  const bn2 = BigNumber.from(num2);

  return bn1.gte(bn2);
}
