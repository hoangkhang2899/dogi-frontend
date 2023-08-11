/**
 * Convert date js to date html
 * @param date Date constructor js
 * @returns yyyy-mm-dd
 */
export const convertDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
