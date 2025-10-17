const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStatergy= require("passport-local");
const User = require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

const sessionOptions = {
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000 ,// 1 week
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demouser", async(req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "mystudent"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.json( registeredUser);
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
}
);

async function main(){
    await mongoose.connect(mongo_url);
}



 

// app.get('/testListing',async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price: 1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample listing was saved");
//     res.send("successful testing");
// });

    
app.get('/',(req,res)=>{
    res.send("hi, i am root");
}
);


// app.use((err,req,res,next)=>{
//     res.send("Something went wrong");
// }
// );

// app.all("*",(req, res, next)=>{
//     next(new ExpressError("Page not found", 404));
// });

app.use((err, req, res, next) => {
    let { statusCode=500 , message = "something went wrong " } = err;
    // res.render("error.ejs", { err });
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
  });
  

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});