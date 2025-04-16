export const formatNumber = (number) => {
    if (typeof number === 'number') { return number.toLocaleString(); }
    return number
};
