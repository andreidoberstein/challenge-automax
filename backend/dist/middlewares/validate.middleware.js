"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema, source) {
    return (req, _res, next) => {
        const data = req[source];
        const parsed = schema.parse(data);
        req.validated = req.validated ?? {};
        req.validated[source] = parsed;
        next();
    };
}
