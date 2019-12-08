module.exports.dateParse = (typeObject, changeArr) => {
  changeArr.forEach(item => {
    typeObject[item] = Date.parse(typeObject[item]);
  });
  return typeObject;
};