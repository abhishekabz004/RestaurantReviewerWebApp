import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
//import { RestaurantContext } from '../context/RestaurantContext';
import RestaurantFinder from '../apis/RestaurantFinder';

const EditRestaurant = (props) => {
    const {id} = useParams();
    console.log(id);
    const [name, setName] = useState("asdf");
    const [location, setLocation] = useState("dsf");
    const [priceRange, setPriceRange] = useState("3");
    //const {restaurants} = useContext(RestaurantContext);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async() => {
            const response = await RestaurantFinder.get(`/${id}`);
            console.log(response.data.data.restaurant);
            setName(response.data.data.restaurant.name);
            setLocation(response.data.data.restaurant.location);
            setPriceRange(response.data.data.restaurant.price_range);
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const updatedRestaurant = await RestaurantFinder.put(`/${id}`, {
            name,
            location,
            price_range : priceRange
        });
        console.log(updatedRestaurant);
        history.push("/");



    };

    return (
        <div>
            {/*<h1>{restaurants[0].name}</h1> */}{/* this  */}
            <form action="">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        value = {name} 
                        onChange = {(e) => setName(e.target.value)} 
                        id="name" 
                        type="text" className="form-control"/>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input value= {location} onChange = {(e) => setLocation(e.target.value)} id="location" type="text" className="form-control"/>
                </div>
                <div className="form-group">
                    <label htmlFor="price_range">Price Range</label>
                    <input value = {priceRange} onChange = {(e) => setPriceRange(e.target.value)} id="price_range" type="number" className="form-control"/>
                </div>
                <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
            </form>
            
        </div>
    )
}

export default EditRestaurant
