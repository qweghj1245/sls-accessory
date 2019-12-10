module.exports.generateCode = () => {
  const key = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let code = '';
  for (let index = 0; index < 8; index++) {
    code += key.charAt(Math.floor(Math.random() * key.length));
  }
  return code;
};