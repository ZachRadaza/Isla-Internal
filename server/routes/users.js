import { Router } from "express";
import { insertUser, getUserById, getAllUsers, checkExistingUser, getUserByEmail } from "../services/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { isSecureCookies, requireAuth } from "../middleware/auth.js";

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
        const user = await getUserById(req.params?.userid);

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
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            createdAt: new Date(), 
            updatedAt: null
        };

        const addedUserId = await insertUser({ ...userToAdd, passwordHash: passwordHash });
        const addedUser = { _id: addedUserId?.insertedId, ...userToAdd };

        res.status(201).json(addedUser);
    } catch(error){
        next(error);
    }
}

async function loginUser(req, res, next){
    try{
        const { email, password } = req.body;

        const userToSignIn = await getUserByEmail(email);

        if(!userToSignIn)
            return res.status(401).json({
                message: 'Invalid email or password'
            });

        const passwordMatches = await bcrypt.compare(password, userToSignIn.passwordHash);

        if(!passwordMatches)
            return res.status(401).json({
                message: 'Invalid email or password'
            });

        const token = jwt.sign({
            userId: userToSignIn._id.toString(),
            email: userToSignIn.email
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: isSecureCookies,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({
            message: 'logged in',
        });
    } catch(error){
        next(error);
    }
}

function logoutUser(req, res, next){
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: isSecureCookies,
            sameSite: "lax",
            path: "/"
        });
        
        res.json({ message: "Logged out" });
    } catch(error){
        next(error);
    }
}

async function listCurrentUser(req, res, next){
    try{
        const { userId } = req.authUser;

        const user = await getUserById(userId);

        if(!user)
            return res.status(404).json({
                message: 'user does not exist'
            });

        res.json(user);
    } catch(error){
        next(error);
    }
}

usersRouter.post('/register', requireEmail, requirePassword, requireUserFields, registerUser);
usersRouter.post('/login', requireEmail, requirePassword, loginUser);
usersRouter.post('/logout', requireAuth, logoutUser);
usersRouter.get('/mirror', requireAuth, listCurrentUser);
usersRouter.get('/', requireAuth, listAllUsers);
usersRouter.get('/:userid', requireAuth, listUser);

export default usersRouter;