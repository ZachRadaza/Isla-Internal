import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { insertBusiness, getAllBusiness, getBusiness, updateBusiness, addUserToBusiness, removeUserFromBusiness, getUsersBusiness, getBusinessMember, getQABusinessId } from "../services/business.js";
import { isDuplicateHandler, isValidString } from "../services/utils.js";
import { getDefaultRoleId, getOwnerRoleId } from "../services/roles.js";
import { canEditBusiness, canViewBusiness, checkPermission } from "../middleware/permissions.js";
import { requireUserId } from "./users.js";

const businessRouter = Router();

export const requireBusinessId = (req, res, next) => {
    let businessId = req.params?.businessId;
    businessId ??= req.body?.businessId;

    if(!isValidString(businessId))
        return res.status(404).json({
            message: 'business id required'
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

async function listQABusinessId(req, res, next){
    try{
        const { userId } = req.authUser;

        const business = await getQABusinessId();
        const canView = checkPermission('view_business', userId, business._id);

        if(!canView)
            return res.status(404).json({
                message: 'you dont have permissions to do such thing bozo'
            });

        res.status(200).json({
            businessId: business._id
        });
    } catch(error){
        next(error);
    }
}

async function createBusiness(req, res, next){
    const business = await insertBusiness(req.business);
    const businessAdded = { ...req.business, _id: business?.insertedId};
    const ownerRoleId = await getOwnerRoleId();

    const businessMember = await addUserToBusiness({ 
        userId: businessAdded.createdById, 
        businessId: businessAdded._id,
        roleId: ownerRoleId,
        createdAt: new Date(),
        updatedAt: null
    });

    res.status(201).json({
        business: businessAdded,
        businessMember
    });
}

async function editBusiness(req, res, next){
    const { name } = req.body;
    const { businessId } = req.params;

    const business = await updateBusiness({ name , businessId });

    res.status(201).json({
        business
    });
}

async function joinBusiness(req, res, next){
    const { businessId } = req.params;
    const { userId } = req.authUser;
    const defaultRole = await getDefaultRoleId();

    const businessMember = await addUserToBusiness({
        userId,
        businessId,
        roleId: defaultRole,
        createdAt: new Date(),
        updatedAt: null
    });

    res.status(201).json({
        businessMember
    });
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

async function listAllUsersBusiness(req, res, next){
    try{
        const { userId } = req.params;

        const business = await getUsersBusiness(userId);

        res.status(200).json({
            business
        });
    } catch(error){
        next(error);
    }
}

async function listBusinessMember(req, res, next){
    try{
        const { userId } = req.authUser;
        const { businessId } = req.params;

        const businessMember = await getBusinessMember({ businessId, userId }); 

        res.status(200).json({
            businessMember
        });
    } catch(error){
        next(error);
    }
}

businessRouter.get('/memberof/:userId', requireAuth, requireUserId, listAllUsersBusiness);
businessRouter.get('/memberinfo/:businessId', requireAuth, requireBusinessId, listBusinessMember);

businessRouter.post('/join/:businessId', requireAuth, requireBusinessId, isDuplicateHandler(joinBusiness));
businessRouter.post('/leave/:businessId', requireAuth, requireBusinessId, leaveBusiness);

businessRouter.get('/qabusiness/', requireAuth, listQABusinessId);

businessRouter.post('/', requireAuth, requireBusinessName, extractBusinessFields, isDuplicateHandler(createBusiness));
//businessRouter.get('/', requireAuth, listAllBusiness);
businessRouter.get('/:businessId', requireAuth, requireBusinessId,  canViewBusiness, listBusiness);
businessRouter.put('/:businessId', requireAuth, requireBusinessId, canEditBusiness, requireBusinessName, isDuplicateHandler(editBusiness));

export default businessRouter;