
function authorizeSuperUser(req, res, next) {

  if (!req.user || !req.user.isSuperuser) {
    return res.status(403).json({ error: 'Acceso denegado. Debes ser superusuario.' });
  }
  next();
}

module.exports = authorizeSuperUser ;
