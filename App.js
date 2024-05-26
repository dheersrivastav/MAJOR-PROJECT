if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}



console.log(process.env.SECRET)



const express = require("express");
const app = express();
// const initData = require("./init/data.js");
const mongoose = require("mongoose"); 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require('ejs-mate')//creating layout   boiler plate
const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session')
const MongoStore=require('connect-mongo')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy= require('passport-local')
const User=require('./models/user.js')

const listingRouter=require('./routes/listing.js')
const reviewRouter=require('./routes/review.js')
const userRouter=require('./routes/user.js');
const { options } = require('joi');

const MONGO_URL =process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')))

const store=MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,

})

store.on("error",()=>{
        console.log("error in mongo session store",err)
})

const sessionOptions={
  store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
    expires:Date.now()+ 7*24*60 *60*1000,
    maxAge:7*24*60 *60*1000,
    httpOnly:true,
   },
}


// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions))
app.use(flash())

 app.use(passport.initialize());
 app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next();
})


// app.get('/demouser',async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   })
// let registerUser= await User.register(fakeUser,"helloworld")
// res.send(registerUser)
// })


app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use("/",userRouter)





// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.all('*',(req,res,next)=>{ //route not matching to all then run
  next(new ExpressError(404,"page Not Found:"))
})  //main reason is that it handle error without stop server   

app.use((err,req,res,next)=>{ //middlwares 
  let{statusCode=500,message="Something went wrong"}=err;
  // res.render('error.ejs',)
 res.status(statusCode).render('error.ejs',)
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});



