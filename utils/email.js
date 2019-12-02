const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SEND_GRID_API_KEY;

sgMail.setApiKey(apiKey);

module.exports.sendResetEmail = (email, message) => {
  const msg = {
    to: email,
    from: 'qweghj1245@gmail.com',
    subject: 'This is your reset password email. Please check in 10 minutes.',
    // text: 'and easy to do anywhere, even with Node.js',
    html: `
      <div style="color: orange">123</div>
      <div style="color: blue">123</div>
      <div style="color: red">123</div>
      <div>${message}</div>
    `,
  };
  sgMail.send(msg);
};