import { getBusinessMember } from "../services/business.js";
import { getRole } from "../services/roles.js";

//update when implementing properties
async function checkPermission(permItem, userId, businessId){
    const member = await getBusinessMember({ userId, businessId });
    const role = await getRole(member.roleId); //cache role perms in future

    return role.permissions.includes(permItem);
}

async function permissionsWrapper(permItem, req, res, next){
    try{
        const { userId } = req.authUser;
        let { businessId } = req.params;
        businessId ??= req.body?.businessId;

        if(!businessId)
            return res.status(400).json({
                message: 'business id required'
            });

        const hasPermissions = checkPermission(permItem, userId, businessId);
        
        if(!hasPermissions)
            return res.status(404).json({
                message: 'you dont have permissions to do such thing bozo'
            });
        next();
    } catch(error){
        next(error);
    }
}

export const canViewBusiness = async (req, res, next) => permissionsWrapper('view_business', req, res, next);
export const canEditBusiness = async (req, res, next) => permissionsWrapper('edit_business', req, res, next);
export const canDeleteBusiness = async (req, res, next) => permissionsWrapper('delete_business', req, res, next);

export const canManageMembers = async (req, res, next) => permissionsWrapper('manage_members', req, res, next);
export const canInviteMembers = async (req, res, next) => permissionsWrapper('invite_members', req, res, next);

export const canViewProperty = async (req, res, next) => permissionsWrapper('view_properties', req, res, next);
export const canEditProperty = async (req, res, next) => permissionsWrapper('edit_properties', req, res, next);
export const canAddProperty = async (req, res, next) => permissionsWrapper('add_properties', req, res, next);
export const canDeleteProperty = async (req, res, next) => permissionsWrapper('delete_properties', req, res, next);