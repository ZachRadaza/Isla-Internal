import { Router } from "express";
import { insertUser, getUserById, getAllUsers, getUserByEmail } from "../services/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { isSecureCookies, requireAuth } from "../middleware/auth.js";
import { isDuplicateHandler, isValidString } from "../services/utils.js";
import { addUserToBusiness, getIslaBusinessId, usedVerifiedEmail, verifyBusinessEmail } from "../services/business.js";
import { getDefaultRoleId } from "../services/roles.js";

const usersRouter = Router();

export const requireUserId = (req, res, next) => {
    const { userId } = req.params;

    if(!isValidString(userId))
        return res.status(404).json({
            error: 'user id required'
        });

    next();
}

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

const extractUserFields = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    const validFields = (
        isValidString(email) && 
        isValidString(password) && 
        isValidString(firstName) && 
        isValidString(lastName)
    );

    if(!validFields)
        return res.status(404).json({
            message: 'missing or invalid fields for user required'
        });

    req.user = { 
        email, 
        password, 
        firstName, 
        lastName, 
        createdAt: new Date(), 
        updatedAt: null 
    };
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
    const user = req.user;

    const [islaBusiness, defaultRoleId] = await Promise.all([
        getIslaBusinessId(),
        getDefaultRoleId()
    ]);

    const passwordHash = await bcrypt.hash(user.password, 12);
    const email = user.email;
    const businessId = islaBusiness._id;
    const isValid = await verifyBusinessEmail({ businessId, email });

    if(!isValid)
        return res.status(401).json({
            message: 'You are not authorized to make an account'
        });

    const addedUser = await insertUser({ ...user, passwordHash })
    const addedUserId = addedUser?.insertedId;

    addUserToBusiness({
        userId: addedUserId,
        businessId,
        roleId: defaultRoleId,
        createdAt: new Date(),
        updatedAt: null
    });
    
    await usedVerifiedEmail({ businessId, email });

    //res.status(201).json({ user: addedUser });
    next();
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

usersRouter.post('/register', requireEmail, requirePassword, extractUserFields, isDuplicateHandler(registerUser), loginUser);
usersRouter.post('/login', requireEmail, requirePassword, loginUser);
usersRouter.post('/logout', requireAuth, logoutUser);
usersRouter.get('/mirror', requireAuth, listCurrentUser);
usersRouter.get('/', requireAuth, listAllUsers);
usersRouter.get('/:userId', requireAuth, requireUserId, listUser);

export default usersRouter;