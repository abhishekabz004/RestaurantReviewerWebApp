import React, {useState, createContext} from "react";

export const RestaurantContext = createContext();

export const RestaurantContextProvider = props => {
    const [restaurants, setRestaurants] = useState([]);
    const addRestaurant = (restaurant) => {
        setRestaurants([...restaurants,restaurant])
    };
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    return(
        <RestaurantContext.Provider value = {
            {restaurants, setRestaurants, 
            addRestaurant, 
            selectedRestaurant, setSelectedRestaurant, 
            }}>
            {props.children}
        </RestaurantContext.Provider>
    )
}