const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customerRoutes = require('./router/auth_users').authenticated;
const generalRoutes = require('./router/general').general;

const app = express();

app.use(express.json());

app.use(
   "/customer",
   session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })
);

app.use("/customer/auth/*", (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

   jwt.verify(token, "access", (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token." });
      req.user = user;
      next();
   });
});

app.use("/customer", customerRoutes);
app.use("/", generalRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
