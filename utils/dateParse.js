module.exports.dateParse = (typeObject, changeArr, isResolve) => {
  changeArr.forEach(item => {
    typeObject[item] = Date.parse(typeObject[item]);
  });
  if (isResolve) return Promise.resolve(typeObject);
  return typeObject;
};