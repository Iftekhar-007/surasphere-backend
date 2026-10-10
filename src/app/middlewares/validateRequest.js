export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            if (parsed.body !== undefined) {
                req.body = parsed.body;
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
