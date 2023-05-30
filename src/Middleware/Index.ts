
import express from "express";
import { verify } from "jsonwebtoken"

const auth = (req: any, res: express.Response, next: express.NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token, authorization denied!');
    const decoded = verify(token, "MY-PRIVATE_KEY");
    if (!decoded) return res.status(500).send('Not Authorized');
    req.user = decoded;
    next();
};
export default auth