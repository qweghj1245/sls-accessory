module.exports.generateCode = (len) => {
  const key = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let code = '';
  for (let index = 0; index < len; index++) {
    code += key.charAt(Math.floor(Math.random() * key.length));
  }
  return code;
};