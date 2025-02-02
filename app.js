var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
	flash 		= require("connect-flash"),    
	passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
	path       	= require("path");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11";

mongoose.connect('mongodb+srv://Beth:Rusty@cluster0.9gqji.mongodb.net/<dbname>?retryWrites=true&w=majority', {
		useNewUrlParser: true, 
		useCreateIndex: true, 
		useUnifiedTopology: true
	}).then(() => {
		console.log("connected to Atlas!");
	}).catch(error => console.log(error.message));

// mongoose.connect('mongodb://localhost:27017/yelp_camp_11', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// LISTEN
app.listen(process.env.PORT, process.env.IP, function() { 
  console.log('Connected to YelpCamp!'); 
});