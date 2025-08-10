export default function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied");

  next();
}

//status(403) means forbidden
