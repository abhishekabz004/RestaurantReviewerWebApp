require("dotenv").config();
const express = require("express");
const db = require('./db');
const cors = require("cors");

const morgan = require("morgan");
const app = express();


//app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); //this middleware converts the data from body to json

// a middleware in express which handles the sent request 
// it should be on top of the targeted route handler or else the request wont hit here
// we can have as many middleware as possible
app.use((req, res, next) => {
	console.log("our middleware ran");
	next();  // to send the request further
	//if next is not given the package(request) would be dropped
});

//creating route for different funcationality
app.get("/api/v1/restaurants", async (req, res) => {
	console.log("get all restaurants");
	try{
		//res.send("these are the restaurants");
		// these are all express' method
		//const results = await db.query("SELECT * FROM restaurants;");
		const restaurantRatingsData = await db.query(
			"SELECT * FROM restaurants LEFT JOIN(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 2) as average_rating FROM reviews GROUP BY restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
			);
		console.log(restaurantRatingsData);
		res.status(200).json({  
			status : "sucess",
			results : restaurantRatingsData.rowCount,
			data : {
				restaurants : restaurantRatingsData.rows
			}
		})

	}
	catch(err){
		console.log(err)
	}
});

//Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
	try{
		console.log(req.params);
		//const results = await db.query(`SELECT * FROM restaurants WHERE id =  ${req.params.id}`); 
		// this kind of query would give raise to SQL injection. We have to use parameterised query
		const restaurant = await db.query(
			"SELECT * FROM restaurants LEFT JOIN(SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 2) as average_rating FROM reviews GROUP BY restaurant_id) reviews on restaurants.id = reviews.restaurant_id WHERE id =  $1;", 
			[req.params.id]
			); 

		const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id =  $1", [req.params.id]); 
		
		console.log(reviews);
		res.status(200).json({
			status : "success",
			data : {
				restaurant: restaurant.rows[0],
				reviews : reviews.rows
			}
		});

	}
	catch(err){
		console.log(err);
	}
});

//Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
	console.log(req.body);
	try{
		const results = await db.query(
			"INSERT INTO restaurants (name,location, price_range) values ($1, $2, $3) returning *;", 
			[req.body.name, req.body.location, req.body.price_range]
		);
		console.log(results);
		res.status(201).json({
			status : "success",
			data : {
				restaurant: results.rows[0]
			}
		});


	}
	catch (err){
		console.log(err)
	}
});

//Update a Restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
	console.log("update a restaurant");
	try{
		const results = await db.query(
			"UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *;",
			[req.body.name, req.body.location, req.body.price_range, req.params.id]
		);
		res.status(201).json({
			status : "success",
			data : {
				restaurant: results.rows[0]
			}
		});

	}
	catch (err){
		console.log(err);
	}
});

//Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req,res) => {
	console.log("delete a restaurant");
	try{
		console.log("delete a restaurant");
		const results = await db.query (
			"DELETE FROM restaurants WHERE id = $1",
			[req.params.id]
		);
		res.status(204).json({ //204 removes the body(json) being sent
			status : "success"
		});

	}
	catch(err){
		console.log(err);
	}

});

//Add a review
app.post("/api/v1/restaurants/:id/addReview/", async (req,res) => {
	console.log("add a new review");
	try{
		const newReview = await db.query(
			"INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) returning *;", 
			[req.params.id, req.body.name, req.body.review, req.body.rating]
		);
		console.log(newReview);
		res.status(201).json({
			status : "success",
			data : {
				review: newReview.rows[0],
			}
		});

	}catch (err){
		console.log(err);

	}
});

const port = process.env.PORT  || 3001		// set common environment variables
app.listen(port, () => {
	console.log(`Server is up and listening on port ${port}`);
});
