module.exports = (fn) => {
  console.log('inside async handler');

  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
