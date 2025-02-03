export const generateSignText = (sign) => {
  if (sign === ">=") {
    return "gte";
  } else if (sign === "<=") {
    return "lte";
  } else if (sign === ">") {
    return "gt";
  } else if (sign === "<") {
    return "lt";
  } else if (sign === "=") {
    return "eq";
  }
};
