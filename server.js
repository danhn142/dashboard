var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, "./clients")));

app.set('views', path.join(__dirname, './clients/views'));

app.set('view engine', 'ejs');

// Setting up Mongoose
mongoose.connect('mongodb://localhost/basic_mongoose');
var AnimalSchema = new mongoose.Schema({
	name: String
})

mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model('Animal');


// Routes

app.get("/", function(req, res) {
	Animal.find({} , function(err, animals) {
		if(err) throw err;
		console.log(animals)

		res.render("index", {"data": animals});
	})
	

})

app.post("/animals", function (req, res) {
	console.log("POST DATA", req.body);
	var animal = new Animal({name: req.body.name});
	animal.save(function(err) {
		if(err) {
			console.log("something is wrong");
		} else {
			console.log("Added Animal");
			res.redirect("/");
		}
	})
})

app.get('/animals/:id', function (req,res) {
	Animal.findOne({_id: req.params.id}, function (err, animals) {
		if(err) {
			console.log("animals/:id error", err);
			res.send({message: "there was an error"});
		} else {

			console.log(animals);
			res.render("show", {animal: animals})
		}		
	})
})

app.get('/animals/:id/edit', function (req,res) {
	Animal.findOne({_id: req.params.id}, function (err, animals) {
		if(err) {
			console.log("animals/:id/edit error", err);
			res.send({message: "there was an error"});
		} else {
			console.log(animals);
			res.render("edit", {animal: animals});
		}
	})
})

app.post('/animals/:id', function (req,res) {
	Animal.findByIdAndUpdate({_id: req.params.id}, {name: req.body.name}, function(err, animals) {
		if(err) throw err;
		console.log(animals);
		res.redirect("/")
	})
})

app.post('/animals/:id/destroy', function (req,res) {
	Animal.findByIdAndRemove({_id: req.params.id}, function(err) {
		if(err) throw err;
		res.redirect("/");
	})
})




app.listen(8000, function() {
    console.log("listening on port 8000");
})












