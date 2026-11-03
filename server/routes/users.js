import { Router } from "express";
import { insertUser, getUser, getAllUsers, checkExistingUser } from "../services/users.js";
import bcrypt from "bcryptjs";

const usersRouter = Router();

const requireEmail = (req, res, next) => {
    const email = req.body?.email;
    if(typeof email !== 'string' || !email)
        return res.status(404).json({
            message: 'Email required'
        });

    next();
}

const requirePassword = (req, res, next) => {
    const password = req.body?.password;
    if(typeof password !== 'string' || !password)
        return res.status(404).json({
            message: 'Password required'
        });

    next();
}

const requireUserFields = (req, res, next) => {
    const user = req.body;

    const validFields = user?.email && user?.password && user?.firstName && user?.lastName && user?.role;
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
        const { email, password } = req.body;

        const userExists = await checkExistingUser(email);

        if(userExists)
            return res.status(404).json({
                message: 'user already exists'
            });

        const passwordHash = await bcrypt.hash(password, 12);

        const userToAdd = {
            email,
            passwordHash: passwordHash, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            createdAt: new Date(), 
            updatedAt: null
        };

        const addedUserId = await insertUser(userToAdd);
        const addedUser = { _id: addedUserId?.insertedId, ...userToAdd };

        res.status(201).json(addedUser);
    } catch(error){
        next(error);
    }
}

usersRouter.post('/register', requireEmail, requirePassword, requireUserFields, registerUser);
usersRouter.get('/', listAllUsers);
usersRouter.get('/:userid', listUser);

export default usersRouter;