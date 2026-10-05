export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            req.body = parsed.body ?? req.body;
            req.query = parsed.query ?? req.query;
            req.params = parsed.params ?? req.params;
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
