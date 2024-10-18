const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

//Middleware for user

app.use("/customer/auth/*", function auth(req,res,next){
    //checck if user is authenticated
    if(req.session.authorization){
        let token = req.session.authorization['accessToken'] // Access Token

        //Verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Set authenticated user data on the request object
                next() //proceed to the next midlleware
            } else { 
                return res.status(403).json({message: "User not authenticated"}) // Return error if the token verification fails
            }
        })
    } else {
        return res.status(403).json({message: "User not authenticated"})
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
