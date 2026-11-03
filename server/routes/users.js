import { Router } from "express";
import { addUser, getUser, getUsers } from "../services/users.js";

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

usersRouter.post('/', async (req, res, next) => {
    try{
        const userToAdd = getUserFields(req.body);

        if(!userToAdd)
            return res.status(404).json({
                error: 'user lacking fields'
            });

        const addedUserId = await addUser(userToAdd);
        const addedUser = { _id: addedUserId?.insertedId, ...userToAdd };

        res.json(addedUser);
    } catch(error){
        next(error);
    }
});

usersRouter.get('/', async (req, res, next) => {
    try{
        const users = await getUsers();

        res.json({ users });
    } catch(error){
        next(error);
    }
});

usersRouter.get('/:userid', async (req, res, next) => {
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
});

export default usersRouter;