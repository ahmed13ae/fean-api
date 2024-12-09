const xss = require('xss');

const sanitizeInputs = (req, res, next) => {
    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            req.body[key] = xss(req.body[key]);
        }
    }
    for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
            req.query[key] = xss(req.query[key]);
        }
    }
    next();
};

module.exports = sanitizeInputs;
