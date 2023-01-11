var express = require("express");
let jwt=require("jsonwebtoken");
let passport=require("passport");
let JwtStrategy=require("passport-jwt").Strategy
let ExtarctJWT=require("passport-jwt").ExtractJwt
// let cookieParser=require("cookie-parser");
let {employes}=require("./data1");



var app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
//   res.header("Access-Control-Expose-Headers","Authorization")
// res.header("Access-Control-Expose-Headers","X-Auth-Token")
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
const port = process.env.PORT || 2411;
app.use(passport.initialize());
const params={
    jwtFromRequest:ExtarctJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:"jwtsecret2345578545225",
}

const jwtExpirySecond=30;

let strategyALL=new JwtStrategy(params,function(token,done){
    console.log("In JWTStrategy--All",token);
    let user=employes.find((u)=>u.empCode===token.empCode);

    console.log("user",user);
    if(!user){
      return done(null,false, {message:"Incorrect username and password"});
    }
    else{
      return done(null,user);
    }
  });

  passport.use("roleAll",strategyALL);



  app.post("/login",function(req,res){
    let {empCode,username}=req.body;
    console.log(empCode,username);
    let user=employes.find((u)=>u.empCode===+empCode && u.name===username);
    console.log(user);
    if(user){
      
      let payload={empCode:user.empCode}
      let token=jwt.sign(payload,params.secretOrKey,{
        algorithm:"HS256",
        expiresIn:jwtExpirySecond,
      })

    //   res.cookie(myCookie,payload)
    //   res.send({token:"bearer  "+token});
    // res.setHeader("Authorization",token)
    // res.setHeader("X-Auth-Token",token)
    res.send(token);
    console.log(token);
    }
    else 
    res.sendStatus(401);
  })

  app.get("/mydetails",passport.authenticate("roleAll",{session:false}),function(req,res){
    console.log("IN GET /mydetails",req.user);
    // let orders1=employes.filter(ord=>ord.empCode===req.user.empCode);
    res.send(req.user)
  })

  app.get("/company",function(req,res){
  console.log("IN get /My company");
res.send(" Welcome to the Employee Portal of XYZ Company")
})

app.get("/myJuniour",passport.authenticate("roleAll",{session:false}),function(req,res){
    console.log("IN GET /myJuniour",req.user);
    // let orders1=employes.filter(ord=>ord.empCode===req.user.empCode);
    // res.send(orders1)
    if(req.user.designation==="VP"){
        let orders1=employes.filter(ord=>ord.designation!=="VP" );
        console.log(orders1);
        res.send(orders1) 
    }
    else if(req.user.designation==="Manager"){
        let orders1=employes.filter(ord=> ord.designation!=="VP" && ord.designation!=="Manager");
        console.log(orders1);
        res.send(orders1) 
    }
    else if(req.user.designation==="Trainee"){
        let orders1=employes.filter(ord=> ord.designation!=="VP" && ord.designation!=="Manager" &&ord.designation!=="Trainee");
        console.log(orders1);
        res.send(orders1) 
    }

  })


  app.listen(port, () => console.log(`Node APP Listening on ${port}!`));