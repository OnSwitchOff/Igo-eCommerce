export const preprocessBigInt = (val) => {
  // convert string or number to bigint
  if (typeof val === 'string' || typeof val === 'number') {
    return BigInt(val);
  }
  return val;
};
