import { Router } from "express";
import { requireBusinessId } from "./business.js";
import { isDuplicateHandler, isValidString } from "../services/utils.js";
import { insertProperty, deleteProperty, getBusinessProperties, getProperty, updateProperty } from "../services/properties.js";
import { insertRooms, deleteAllPropertyRooms, updateRooms } from "../services/rooms.js";
import { caninsertProperty, canDeleteProperty, canEditProperty, canViewProperty } from "../middleware/permissions.js";
import { requireAuth } from "../middleware/auth.js";

const propertiesRouter = Router();

const requirePropertyId = (req, res, next) => {
    const { propertyId } = req.params;
    
    if(!isValidString(propertyId))
        return res.status(404).json({
            message: 'property Id Required'
        });

    next();
}

const extractPropertyFields = (req, res, next) => {
    const { businessId, name, address, rooms } = req.body;

    if(!isValidString(businessId) || !isValidString(name) || !isValidString(address) || !rooms)
        return res.status(404).json({
            message: 'lacking property fields'
        });

    req.property = {
        businessId,
        name,
        address,
        createdAt: new Date(),
        updatedAt: null
    }

    req.rooms = rooms;

    next();
}

async function listBusinessProperties(req, res, next){
    try{
        const { businessId } = req.params;

        const properties = await getBusinessProperties(businessId);

        return res.status(200).json({
                properties
            });
    } catch(error){
        next(error);
    }
}

async function listProperty(req, res, next){
    try{
        const { propertyId } = req.params;

        const property = await getProperty(propertyId);

        return res.status(200).json({
            property
        });
    } catch(error){
        next(error);
    }
}

async function createProperty(req, res, next){
    const { _id } = await insertProperty(req.property);
    const addedProperty = { _id, ...req.property };

    const { insertedIds } = await insertRooms(req.rooms, _id);

    const rooms = Object.values(insertedIds).map((id, i) => ({ ...req.rooms[i], _id: id }));
    
    const retProperty = { rooms, ...addedProperty };

    res.status(200).json({
        property: retProperty
    });
}

async function editProperty(req, res, next){
    const { propertyId } = req.params;
    const { rooms, ...updates } = req.body;

    const [propertyUpdated, roomsUpdated] = await Promise.all([
        updateProperty({ updates, propertyId }),
        updateRooms(rooms)
    ]);

    if(propertyUpdated.modifiedCount === 0 || roomsUpdated.modifiedCount === 0)
        return res.status(404).json({
            message: 'nothing was updated'
        });

    res.status(201).json({
        property: req.body
    });
}

async function removeProperty(req, res, next){
    try{
        const { propertyId } = req.params;

        await Promise.all([
            deleteProperty(propertyId),
            deleteAllPropertyRooms(propertyId)
        ]);

        res.status(204).json({
            message: 'deleted property and rooms'
        });
    } catch(error){
        next(error);
    }
}

propertiesRouter.get('/business/:businessId', requireAuth, requireBusinessId, canViewProperty, listBusinessProperties);
propertiesRouter.post('/', requireAuth, requireBusinessId, caninsertProperty, extractPropertyFields, isDuplicateHandler(createProperty));
propertiesRouter.get('/:propertyId', requireAuth, requireBusinessId, canViewProperty, requirePropertyId, listProperty);
propertiesRouter.put('/:propertyId', requireAuth, requireBusinessId, canEditProperty, requirePropertyId, isDuplicateHandler(editProperty));
propertiesRouter.delete('/:propertyId', requireAuth, requireBusinessId, canDeleteProperty, requirePropertyId, removeProperty);

export default propertiesRouter;