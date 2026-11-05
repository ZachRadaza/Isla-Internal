import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { insertBusiness, checkExistingBusiness, getAllBusiness, getBusiness } from "../services/business.js";
import { isValidString } from "../services/utils.js";

const businessRouter = Router();

const requireBusinessId = (req, res, next) => {
    if(isValidString(req.params))
        return res.status(404).json({
            message: 'business id required'
        });

    next();
};

const requireBusinessName = (req, res, next) => {
    const { name } = req.body;

    if(isValidString(name))
        return res.status(404).json({
            message: 'Business name required'
        });

    next();
}

const requireUniqueName = async (req, res, next) => {
    const { name } = req.body;
    
    const exists = await checkExistingBusiness(name);

    if(exists)
        return res.status(404).json({
            message: 'Business name taken'
        });

    next();
}

const extractBusinessFields = (req, res, next) => {
    const { name } = req.body;

    req.business = { 
        name,
        createdById: req.authUser.userId,
        createdAt: new Date(),
        updatedAt: null,
    };
    next();
};

async function listAllBusiness(req, res, next){
    try{
        const business = await getAllBusiness();
        res.json({ business });
    } catch(error){
        next(error);
    }
}

async function listBusiness(req, res, next){
    try{
        const business = await getBusiness(req.params);

        res.json({ business });
    } catch(error){
        next(error);
    }
}

async function createBusiness(req, res, next){
    try{
        const business = await insertBusiness(req.business);

        const businessAdded = { ...business, _id: business?.insertedId};
        res.status(201).json({
            business: businessAdded
        });
    } catch(error){
        next(error);
    }
}

async function updateBusiness(req, res, next){
    try{

    } catch(error){
        next(error);
    }
}

async function joinBusiness(req, res, next){
    try{

    } catch(error){
        next(error);
    }
}

async function leaveBusiness(req, res, next){
    try{

    } catch(error){
        next(error);
    }
}

businessRouter.post('/join/:businessid', requireAuth, requireBusinessId, joinBusiness);
businessRouter.post('/leave/:businessid', requireAuth, requireBusinessId, leaveBusiness);

businessRouter.post('/', requireAuth, requireBusinessName, requireBusinessName, extractBusinessFields, createBusiness);
businessRouter.get('/', requireAuth, listAllBusiness);
businessRouter.get('/:businessid', requireAuth, requireBusinessId, listBusiness);
businessRouter.put('/:businessid', requireAuth, requireBusinessId, requireBusinessName, requireUniqueName, updateBusiness);

export default businessRouter;