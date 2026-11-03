import { Router } from "express";
import { insertUser, getUser, getAllUsers } from "../services/users.js";

const usersRouter = Router();

const requireEmail = (req, res, next) => {
    if(typeof req.body?.email !== 'string')
        return res.status(404).json({
            message: 'Email required'
        });

    next();
}

const requireUserFields = (req, res, next) => {
    const user = req.body;

    const validFields = user?.email && user?.passwordHash && user?.firstName && user?.lastName && user?.role;
    if(!validFields)
        return res.status(404).json({
            message: 'missing fields for user required'
        });

    next();
}

async function listAllUsers(req, res, next){
    try{
        const users = await getAllUsers();

        res.json({ users });
    } catch(error){
        next(error);
    }
}

async function listUser(req, res, next){
    try{
        const user = await getUser(req.params?.userid);

        if(!user)
            return res.status(404).json({
                error: 'user not found'
            });

        res.json(user);
    } catch(error){
        next(error);
    }
}

async function registerUser(req, res, next){
    try{
        const userToAdd = {
            email: req.body.email,
            passwordHash: req.body.passwordHash, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            createdAt: new Date(), 
            updatedAt: null
        };

        const addedUserId = await insertUser(userToAdd);
        const addedUser = { _id: addedUserId?.insertedId, ...userToAdd };

        res.json(addedUser);
    } catch(error){
        next(error);
    }
}

usersRouter.post('/register', requireEmail, requireUserFields, registerUser);
usersRouter.get('/', listAllUsers);
usersRouter.get('/:userid', listUser);

export default usersRouter;