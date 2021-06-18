import React from 'react';
import '../Styles/wallpaper.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            suggestions: [],
            searchText: undefined
        }
    }

    handlelocationChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:6503/api/getRestaurantsbycity/${locationId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => this.setState({ restaurants: response.data.restaurantList }))
            .catch()
    }

    handleSearch = (event) => {
        const { restaurants } = this.state;
        const searchText = event.target.value;

        let filteredRestaurants;

        if (searchText == "") {
            filteredRestaurants = [];
        }
        else {
            filteredRestaurants = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({ suggestions: filteredRestaurants, searchText: searchText });
    }

    handleItemClick = (item) => {
        this.props.history.push(`/details?restaurant=${item._id}`)
    }

    renderSuggestions = () => {
        let { suggestions, searchText } = this.state;

        if (suggestions.length === 0 && searchText) {
            return (
                <ul >
                    <li>No Match Found</li>
                </ul>
            )
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.handleItemClick(item)}>{`${item.name}, ${item.city}`}</li>))
                }
            </ul>
        );
    }

    render() {
        const { ddlocations } = this.props;

        return (
            <div>
                <img src="./Assets/homepageimg.png" width="100%" height="450" />
                <div>
                    <div className="logo">
                        <p>e!</p>
                    </div>
                    <div className="headings">
                        Find the best restaurants, cafes, bars
        </div>
                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={this.handlelocationChange}>
                            <option value="0">Select</option>
                            {ddlocations.map((item) => {
                                return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                        <div id="notebooks">
                            <input id="query" type="text" onChange={this.handleSearch} placeholder="Enter Restaurant Name" />
                            {this.renderSuggestions()}
                        </div>
                        <span className="glyphicon glyphicon-search search"></span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Wallpaper);