export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const hasRole = allowedRoles.includes(req.user.role) || (req.user.role === 'super_admin' && allowedRoles.includes('admin'));
    if (!hasRole) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role privileges' });
    }

    next();
  };
};

export default roleMiddleware;