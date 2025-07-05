import { logger } from "../logs/logs.js"

export const reqLog = (req, res, next) => {
    logger.info(req.method, req.url);
    next();
};