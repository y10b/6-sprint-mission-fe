export const formatNumber = (number: number) => {
  if (typeof number === "number") {
    return number.toLocaleString();
  }
  return number;
};
