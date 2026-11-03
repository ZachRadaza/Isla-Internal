import { Router } from "express";
import { insertUser, getUser, getAllUsers } from "../services/users.js";

const usersRouter = Router();

const getUserFields = (user) => {
    const validFields = user?.email && user?.passwordHash && user?.firstName && user?.lastName && user?.role;

    if(!validFields)
        return null;

    return {
        email: user?.email,
        passwordHash: user?.passwordHash, 
        firstName: user?.firstName,
        lastName: user?.lastName,
        role: user?.role
    };
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
        const userAddReq = getUserFields(req.body);

        if(!userAddReq)
            return res.status(404).json({
                error: 'user lacking fields'
            });

        const userToAdd = { createdAt: new Date(), updatedAt: null, ...userAddReq };
        const addedUserId = await insertUser(userToAdd);
        const addedUser = { _id: addedUserId?.insertedId, ...userToAdd };

        res.json(addedUser);
    } catch(error){
        next(error);
    }
}

usersRouter.post('/register', registerUser);
usersRouter.get('/', listAllUsers);
usersRouter.get('/:userid', listUser);

export default usersRouter;