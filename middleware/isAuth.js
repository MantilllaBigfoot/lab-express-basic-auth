const isAuth = (req, res, next) => {
  console.log('isAuth?');
  if (req.user) {
    next();
  } else {
    next(new Error('User is not authenticated'));
  }
};

module.exports = isAuth;
