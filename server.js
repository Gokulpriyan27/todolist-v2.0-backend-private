const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')
const passport = require('passport');
const session = require('express-session');
const dbConnect = require("./database/Database")
const cors = require("cors");
dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
  }));



app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false
}));

dbConnect();

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes")
const passportRoutes = require("./Utils/Passport");
const { verifyToken } = require("./Utils/VerifyToken");

app.use("/api",verifyToken,todoRoutes);
app.use("/auth",authRoutes);
app.use("/",passportRoutes);


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server running in ${port}`)
});
