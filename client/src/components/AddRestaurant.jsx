import React, {useState, useContext} from 'react'
import RestaurantFinder from '../apis/RestaurantFinder';
import { RestaurantContext } from '../context/RestaurantContext';


const AddRestaurant = () => {

    const {addRestaurant} = useContext(RestaurantContext);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("Price Range");

    const handleSubmit = async (e) => {
        e.preventDefault();
        //any event happens, the page gets reloaded and we'll loose our state
        // use this to prevent the automatic reload
        try{
            const response = await RestaurantFinder.post("/", {
                name,
                location,
                price_range : priceRange
            })
            console.log(response);
            addRestaurant(response.data.data.restaurant);

        } catch(err){

        }

    }

    return (
        <div className ="np-4">
            <form action="">
                <div className="form-row">
                    <div className="col">
                        <input type="text" value = {name} onChange = {e =>setName(e.target.value)} className ="form-control" placeholder ="Name"/>
                    </div>
                    <div className="col">
                        <input type="text" value = {location} onChange = {e =>setLocation(e.target.value)} className = "form-control" placeholder = "Location"/>
                    </div>
                    <div className="col">
                        <select className="custom-select my-1 mr-sm-2" 
                            value = {priceRange} onChange = {e =>setPriceRange(e.target.value)}>
                            <option disabled>Price Range</option>
                            <option value="1">$</option>
                            <option value="2">$$</option>
                            <option value="3">$$$</option>
                            <option value="4">$$$$</option>
                            <option value="5">$$$$$</option>
                        </select>
                    </div>
                    <button onClick= {handleSubmit} className="btn btn-primary">Add</button>
                </div>
            </form>
        </div>
    )
}

export default AddRestaurant
