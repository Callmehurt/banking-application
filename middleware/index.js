const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.customerVerify = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_SECRET,
        (err, decoded) => {
            if(err || decoded.role != "customer"){
                return res.status(403).json({
                    message: 'Invalid token'
                })
            }
            req.customerId = decoded._id;
            next();
        }
    )
}