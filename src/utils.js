const isUndefined = (val) => {
  return val === undefined;
}

const isNil = (val) => {
  return val == null;
}

const isNull = (val) => {
  return val === null;
}

export { isUndefined, isNil, isNull };
