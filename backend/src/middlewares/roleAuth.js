export const roleAuth = (roles) => {
    return async(req, res, next) => {
        if(!req.user) return res.status(401).json({ error: "No autorizado" });
        if(!roles.includes(req.user.role)) return res.status(403).json({ error: "Acceso prohibido" });
        next();
    };
};