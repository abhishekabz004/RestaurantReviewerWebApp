import React, {useEffect, useContext} from 'react'
import RestaurantFinder from '../apis/RestaurantFinder'
import {RestaurantContext } from '../context/RestaurantContext';
import {useHistory} from "react-router-dom";
import StarRating from './StarRating'

const RestaurantList = (props) => {
    const {restaurants, setRestaurants} = useContext(RestaurantContext);
    let history = useHistory();
    
    useEffect(() => {  // this is a hook effect. It doesn't like to return anything. but asyn function would return a promise
        const fetchData = async () => {
            try{
                const response = await RestaurantFinder.get("/"); //add this path to the baseURL in api
                console.log(response);
                setRestaurants(response.data.data.restaurants);
    
            }
            catch(err){
                console.log(err);
            }
        }

        fetchData();
    }, []);  //empty array is used to run this useEffect only when component mounts and not everytime the component re-renders

    const handleDelete = async (id, e) => {
        try{
            e.stopPropagation(); // for differentiating button click and row click
            const response = await RestaurantFinder.delete(`/${id}`);
            console.log(response);
            setRestaurants(restaurants.filter(restaurant => {
                return restaurant.id !== id;
            }));

        }catch (err){

        }

    }

    const handleUpdate = (id, e) => {
        e.stopPropagation();
        history.push(`/restaurants/${id}/update`)
    }

    const handleRestaurantSelect = (id) => {
        history.push(`/restaurants/${id}`);
    }

    const renderRating = (restaurant) => {
        if(!restaurant.count) {
            return (
                <span className="text-warning">0 reviews</span>
            )
        }
        else{
            return(
                <>
                <StarRating rating={restaurant.average_rating} />
                <span className="text-warning ml-1">({restaurant.count})</span>
                </>
            );

        }
    }

    return (
        <div className ="list-group">
            <table className="table table-hover table-dark">
                <thead>
                    <tr className="bg-primary">
                        <th scope="col">Restaurant</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price Range</th>
                        <th scope="col">Ratings</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants && restaurants.map(restaurant => {   //the && is to run this only if restaurant list exists
                        return(
                            <tr onClick={ () => handleRestaurantSelect(restaurant.id)} key= {restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{"$".repeat(restaurant.price_range)}</td>
                                <td>{renderRating(restaurant)}</td>
                                <td><button onClick = {(e) => handleUpdate(restaurant.id, e)} className="btn btn-warning">Update</button></td>
                                <td><button onClick={(e) => handleDelete(restaurant.id, e)} className="btn btn-danger">Delete</button></td>
                            </tr>
                        )
                    })}
                    
                    {/*
                    <tr>
                        <td>mcdonalds</td>
                        <td>new york</td>
                        <td>$$</td>
                        <td>Rating</td>
                        <td><button className="btn btn-warning">Update</button></td>
                        <td><button className="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                        <td>mcdonalds</td>
                        <td>new york</td>
                        <td>$$</td>
                        <td>Rating</td>
                        <td><button className="btn btn-warning">Update</button></td>
                        <td><button className="btn btn-danger">Delete</button></td>
                </tr>*/}
                </tbody>
            </table>

            
        </div>
    )
}

export default RestaurantList
