const auth = require("../Model/userInformation"); // Import User Model
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication token

require('dotenv').config()


// function authenticationToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Fix split issue

//     if (!token) {
//         return res.status(401).json({ message: "Authentication Failed" }); // Add return
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid Token" }); // Use 403 for invalid token
//         }

//         console.log(user , 'user')
//     });
// }


const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required",
            });
        }

        console.log(firstName, lastName, email, password, 'password password password')

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email format",
            });
        }

        const existingUser = await auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "Email is already registered",
            });
        }

        const saltRounds = 10; // Defines the complexity of the hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new auth({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();




        return res.status(200).json({
            status: 200,
            message: "User registered successfully",
            // user: newUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: "Email and password are required",
            });
        }

        const user = await auth.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            user.email, process.env.JWT_SECRET
        );


        // authenticationToken(user.email , process.env.JWT_SECRET)

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            token,

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};


const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return reject({ status: 403, message: "Invalid Token" });
            }
            resolve(user);
        });
    });
};

const tokenVerification = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication Failed" });
        }

        const user = await verifyToken(authHeader, process.env.JWT_SECRET);
        res.status(200).json({ message: "Token is valid", user });

    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};



module.exports = { signUp, signIn, tokenVerification }