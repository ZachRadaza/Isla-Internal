export function isValidString(field){
    return !(!field || typeof field !== 'string');
}

export function isDuplicateHandler(func){
    return async (req, res, next) => {
        try{
            await func(req, res, next);
        } catch(error){
            if(error.code === 11000)
                return res.status(409).json({
                    message: "already exists"
                });

            next(error);
        }
    };
}