export const generateCondition = (sign, value) => {
  if (sign === ">=") {
    return { gte: value };
  }

  if (sign === "<=") {
    return { lte: value };
  }

  if (sign === ">") {
    return { gt: value };
  }

  if (sign === "<") {
    return { lt: value };
  }
};
