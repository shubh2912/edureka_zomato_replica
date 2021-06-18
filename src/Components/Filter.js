import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            location: undefined,
            mealtype: undefined,
            cuisine: [],
            hcost: undefined,
            lcost: undefined,
            sort: undefined,
            page: undefined,
            locations: []
        }
    }

    componentDidMount() {
        // Capturing values from query-string
        const qs = queryString.parse(this.props.location.search);  // mealtype=1&location=1
        const location = qs.location;
        const mealtype = qs.mealtype;

        // filter API Call

        const inputObj = {
            mealtype_id: mealtype,
            location_id: location
        };

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: inputObj
        })
            .then(response => this.setState({ restaurants: response.data.restaurant, location: location, mealtype: mealtype }))
            .catch()

        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/cityList',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => this.setState({ locations: response.data.city }))
            .catch()
    }

    apiCall = (inputObj) => {
        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: inputObj
        })
            .then(response => this.setState({ restaurants: response.data.restaurant, lcost: inputObj.lcost, hcost: inputObj.hcost, sort: inputObj.sort }))
            .catch()
    }

    handleSortChange = (sort) => {
        const { location, mealtype, lcost, hcost, cuisine } = this.state;
        const inputObj = {
            sort: sort,
            mealtype_id: mealtype,
            location_id: location,
            lcost: lcost,
            hcost: hcost,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };
        this.apiCall(inputObj);
    }

    handleCostChange = (lcost, hcost) => {
        const { location, mealtype, sort, cuisine } = this.state;
        const inputObj = {
            sort: sort,
            mealtype_id: mealtype,
            location_id: location,
            lcost: lcost,
            hcost: hcost,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };
        this.apiCall(inputObj);
    }

    handleLocationChange = (event) => {
        const location = event.target.value;
        const { mealtype, sort, hcost, lcost, cuisine } = this.state;

        const inputObj = {
            sort: sort,
            mealtype_id: mealtype,
            location_id: location,
            lcost: lcost,
            hcost: hcost,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };
        this.apiCall(inputObj);
    }

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }

    handleCuisineChange = (cuisineId) => {
        const { location, mealtype, sort, hcost, lcost, cuisine } = this.state;

        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        } else {
            const index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }

        const inputObj = {
            sort: sort,
            mealtype_id: mealtype,
            location_id: location,
            lcost: lcost,
            hcost: hcost,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };
        this.apiCall(inputObj);
    }

    render() {
        const { restaurants, locations } = this.state;

        return (<div>
            <div id="myId" className="heading">Breakfast Places in Mumbai</div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                        <div className="filter-heading">Filters / Sort</div>
                        <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                            data-target="#filter"></span>
                        <div id="filter" className="collapse show">
                            <div className="Select-Location">Select Location</div>
                            <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                                <option value="0">Select</option>
                                {locations.map((item) => {
                                    return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                })}
                            </select>
                            <div className="Cuisine">Cuisine</div>
                            <div>
                                <input type="checkbox" onChange={() => this.handleCuisineChange(1)} />
                                <span className="checkbox-items">North Indian</span>
                            </div>
                            <div>
                                <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                <span className="checkbox-items">South Indian</span>
                            </div>
                            <div>
                                <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                <span className="checkbox-items">Chineese</span>
                            </div>
                            <div>
                                <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                <span className="checkbox-items">Fast Food</span>
                            </div>
                            <div>
                                <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                <span className="checkbox-items">Street Food</span>
                            </div>
                            <div className="Cuisine">Cost For Two</div>
                            <div>
                                <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                <span className="checkbox-items">Less than &#8377; 500</span>
                            </div>
                            <div>
                                <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                            </div>
                            <div>
                                <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                            </div>
                            <div>
                                <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                            </div>
                            <div>
                                <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                                <span className="checkbox-items">&#8377; 2000 +</span>
                            </div>
                            <div className="Cuisine">Sort</div>
                            <div>
                                <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                                <span className="checkbox-items">Price low to high</span>
                            </div>
                            <div>
                                <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                                <span className="checkbox-items">Price high to low</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8 col-md-8 col-lg-8">
                        {restaurants && restaurants.length > 0 ? restaurants.map((item) => {
                            return <div className="Item" onClick={() => this.handleNavigate(item._id)}>
                                <div>
                                    <div className="small-item vertical">
                                        <img className="img" src="./Assets/breakfast.jpg" />
                                    </div>
                                    <div className="big-item">
                                        <div className="rest-name">{item.name}</div>
                                        <div className="rest-location">{item.locality}</div>
                                        <div className="rest-address">{item.city}</div>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <div className="margin-left">
                                        <div className="Bakery">CUISINES : {item.cuisine.map((cuis) => `${cuis.name}, `)}</div>
                                        <div className="Bakery">COST FOR TWO : &#8377; {item.min_price} </div>
                                    </div>
                                </div>
                            </div>
                        }) : <div className="no-records">No Records Found...</div>}

                        {restaurants && restaurants.length > 0 ? <div className="pagination">
                            <a href="#">&laquo;</a>
                            <a href="#">1</a>
                            <a href="#">2</a>
                            <a href="#">3</a>
                            <a href="#">4</a>
                            <a href="#">5</a>
                            <a href="#">6</a>
                            <a href="#">&raquo;</a>
                        </div> : null}
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Filter;