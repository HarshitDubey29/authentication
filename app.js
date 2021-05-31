var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


//mongoose.connect("mongodb://localhost:27017/authentication", {useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect(
  "mongodb+srv://harshitdubey:Harshit2000@setupcampcluster.gcnk6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);



var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret:"here is sign up/login page",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================
//ROUTES
//=================

app.get("/",function(req,res){
	res.render("home");
});

app.get("/main",function(req,res){
	res.render("main");
});

//Auth routes
//Show sign up form
app.get("/register", function(req,res){
	res.render("register");
});

app.post("/register", function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/main");
		})
	})
});

//login routes
app.get("/login", function(req,res){
	res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local", {
	successRedirect:"/main",
	failureRedirect:"/login"
}),function(req,res){
	
})

app.listen(process.env.PORT, function(){
	console.log('server listening on port 3000')
});