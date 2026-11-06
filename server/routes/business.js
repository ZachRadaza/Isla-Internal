import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { insertBusiness, checkExistingBusinessByName, getAllBusiness, getBusiness, updateBusiness, addUserToBusiness, removeUserFromBusiness, checkExistingMember, checkExistingBusinessById } from "../services/business.js";
import { isValidString } from "../services/utils.js";

const businessRouter = Router();

const requireBusinessId = async (req, res, next) => {
    const { businessId } = req.params;

    if(!isValidString(businessId))
        return res.status(404).json({
            message: 'business id required'
        });


    const exists = await checkExistingBusinessById(businessId);
    if(!exists)
        return res.status(404).json({
            message: 'business does not exist'
        });

    next();
};

const requireBusinessName = (req, res, next) => {
    const { name } = req.body;

    if(!isValidString(name))
        return res.status(404).json({
            message: 'Business name required'
        });

    next();
}

const requireUniqueName = async (req, res, next) => {
    const { name } = req.body;
    
    const exists = await checkExistingBusinessByName(name);

    if(exists)
        return res.status(404).json({
            message: 'Business name taken'
        });

    next();
}

const requireNonExistingMember = async (req, res, next) => {
    const { businessId } = req.params;
    const { userId } = req.authUser;

    const exists = await checkExistingMember({ businessId, userId });

    if(exists)
        return res.status(400).json({
            message: 'User is already a member'
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
        const { businessId } = req.params;
        const business = await getBusiness(businessId);

        res.json({ business });
    } catch(error){
        next(error);
    }
}

async function createBusiness(req, res, next){
    try{
        const business = await insertBusiness(req.business);
        const businessAdded = { ...business, _id: business?.insertedId};

        const businessMember = await addUserToBusiness({ 
            userId: businessAdded.createdById, 
            businessId: businessAdded._id,
            role: "Owner",
            createdAt: new Date(),
            updatedAt: null
        });

        res.status(201).json({
            business: businessAdded,
            businessMember
        });
    } catch(error){
        next(error);
    }
}

async function editBusiness(req, res, next){
    try{
        const { name } = req.body;
        const { businessId } = req.params;

        const business = await updateBusiness({ name, businessId });

        res.status(201).json({
            business
        });
    } catch(error){
        next(error);
    }
}

async function joinBusiness(req, res, next){
    try{
        const { businessId } = req.params;
        const { userId } = req.authUser;

        const businessMember = await addUserToBusiness({
            userId,
            businessId,
            role: "member",
            createdAt: new Date(),
            updatedAt: null
        });

        res.status(201).json({
            businessMember
        });
    } catch(error){
        next(error);
    }
}

async function leaveBusiness(req, res, next){
    try{
        const { businessId } = req.params;
        const { userId } = req.authUser;

        await removeUserFromBusiness({ businessId, userId });

        res.status(204).json({
            message: 'succesfully removed user from business'
        });
    } catch(error){
        next(error);
    }
}

businessRouter.post('/join/:businessId', requireAuth, requireBusinessId, requireNonExistingMember, joinBusiness);
businessRouter.post('/leave/:businessId', requireAuth, requireBusinessId, leaveBusiness);

businessRouter.post('/', requireAuth, requireBusinessName, requireUniqueName, extractBusinessFields, createBusiness);
businessRouter.get('/', requireAuth, listAllBusiness);
businessRouter.get('/:businessId', requireAuth, requireBusinessId, listBusiness);
businessRouter.put('/:businessId', requireAuth, requireBusinessId, requireBusinessName, requireUniqueName, editBusiness);

export default businessRouter;