const flatten = (array) => {
  return [].concat.apply([], array)
}

const getIn = (object, path) => {
  if (path.length == 0) {
    return object;
  }
  const child = path.splice(0, 1)[0];
  if (object.constructor === Object) {
    return getIn(object[child], path);
  } else if (object.constructor === Array) {
    const match = object.find((el) => el.name == child);
    return getIn(match, path);
  }
  return getIn(undefined, []);
}

const diff = (newArray, oldArray) => {
  const left = new Set(newArray);
  const right = new Set(oldArray);
  return left.difference(right);
}

module.exports = {
  flatten: flatten,
  getIn: getIn,
  diff: diff
}
