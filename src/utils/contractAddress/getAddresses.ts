export const trimMiddlePartAddress = (address: string, digits: number = 6) => {
  if (!address) return "";
  return `${address.substring(0, digits)}...${address.substring(
    address.length - 3,
    address.length
  )}`;
};
