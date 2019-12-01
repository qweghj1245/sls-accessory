module.exports.sendTokenConfig = async (user, statusCode, res) => {
  try {
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + process.env.COOKIEEXPIRE * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true,
    };
    res.cookie('jwt', token, options);

    if (process.env.STAGE === 'prod') options.secure = true;

    res.status(statusCode).send({
      user,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: 'Something get wrong!' });
  }
};