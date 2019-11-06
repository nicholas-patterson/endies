module.exports = (req, res, next) => {
  if (req.session && req.session.dealer_crm) {
    console.log(req.session, "SESSION");
    next();
  } else {
    res
      .status(401)
      .json({ message: "You need to be logged in to view this page" });
  }
};
