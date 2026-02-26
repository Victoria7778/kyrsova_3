

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Доступ заборонено: у вас немає прав адміністратора" 
      });
    }
    next();
  };
};

module.exports = checkRole;