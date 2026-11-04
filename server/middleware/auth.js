import jwt from "jsonwebtoken";

export const isSecureCookies = process.env.MODE !== "DEV";

export function requireAuth(req, res, next) {
    const token = req.cookies?.token;

    if(!token)
        return res.status(401).json({
            message: 'Authentication required'
        });

    try{
        const decodedUser = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.authUser = decodedUser;
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}