// const jwt = require("jsonwebtoken")

// const verifyJwt = (req, res, next) => {

//     try {
//         const token = req.header("Authorization")

//         if (!token) {
//             return res.status(401).json({
//                 status: 401,
//                 message: "Unauthorized user"
//             })
//         }

//         const decode = jwt.verify(token, process.env.SECRET_KEY)

//         if (!decode) {
//             return res.status(401).json({
//                 status: 401,
//                 message: "Invalid token"
//             })
//         }

//         req.body.userId = decode.userId

//         next()
//     } catch (error) {
//         console.log("Error", error)
//     }
// }

// module.exports = verifyJwt;