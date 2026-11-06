import { Router } from "express";
import usersRouter from "./users.js";
import propertiesRouter from "./properties.js";
import businessRouter from "./business.js";

const mainRouter = Router();

mainRouter.get('/health', (req, res) => {
    res.json({
        message: "working"
    })
});

mainRouter.use('/users', usersRouter);
mainRouter.use('/business', businessRouter);
mainRouter.use('/properties', propertiesRouter);

export default mainRouter;