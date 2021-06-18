import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'brown'
    }
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            resId: undefined,
            galleryModalIsOpen: false,
            menuItemsModalIsOpen: false,
            formModalIsOpen: false,
            menuItems: [],
            subTotal: 0,
            order: [],
            name: undefined,
            email: undefined,
            mobileNumber: undefined,
            address: undefined
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const resId = qs.restaurant;

        axios({
            method: 'GET',
            url: `http://localhost:6503/api/getResById/${resId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant, resId: resId })
            }).catch(err => console.log(err))

    }

    handleModal = (state, value) => {
        const { resId, menuItems } = this.state;
        this.setState({ [state]: value });
        if (state == "menuItemsModalIsOpen" && value == true) {
            axios({
                method: 'GET',
                url: `http://localhost:6503/api/getItemsbyrestaurant/${resId}`,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    this.setState({ menuItems: response.data.itemsList })
                })
                .catch(err => console.log(err))
        }
        if (state == 'formModalIsOpen' && value == true) {
            const order = menuItems.filter(item => item.qty != 0);
            this.setState({ order: order });
        }
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details);
        document.body.appendChild(form);
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:6503/api/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }


    payment = () => {
        const { subTotal, email } = this.state;
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            // Payment API Call
            this.getData({ amount: subTotal, email: email }).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
        else {
            alert('Email is not valid, Please check it');
        }
    }

    render() {
        const { restaurant, galleryModalIsOpen, menuItemsModalIsOpen, formModalIsOpen, menuItems, subTotal } = this.state;
        return (<div>
            <div>
                <img src={restaurant.image} alt="No Image, Sorry for the Inconvinience" width="100%" height="300px" />
                <button className="button" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
            </div>
            <div className="heading">{restaurant.name}</div>
            <button className="btn-order" onClick={() => this.handleModal('menuItemsModalIsOpen', true)}>Place Online Order</button>

            <div className="tabs">
                <div className="tab">
                    <input type="radio" id="tab-1" name="tab-group-1" checked />
                    <label for="tab-1">Overview</label>

                    <div className="content">
                        <div className="about">About this place</div>
                        <div className="head">Cuisine</div>
                        <div className="value">{restaurant && restaurant.cuisine ? restaurant.cuisine.map((item) => `${item.name}, `) : null}</div>
                        <div className="head">Average Cost</div>
                        <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                    </div>
                </div>

                <div className="tab">
                    <input type="radio" id="tab-2" name="tab-group-1" />
                    <label for="tab-2">Contact</label>

                    <div className="content">
                        <div className="head">Phone Number</div>
                        <div className="value">{restaurant.contact_number}</div>
                        <div className="head">{restaurant.name}</div>
                        <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={galleryModalIsOpen}
                style={customStyles}
            >
                <div>
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>
                    <Carousel showThumbs={false}>
                        {restaurant && restaurant.thumb ? restaurant.thumb.map((path) => {
                            return < div >
                                <img src={path} height="400px" width="400px" />
                            </div>
                        }) : null}
                    </Carousel>
                </div>
            </Modal>
            <Modal
                isOpen={menuItemsModalIsOpen}
                style={customStyles}
            >
                <div>
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>
                    <div >
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <h3 className="item-total">SubTotal : {subTotal}</h3>
                        <button className="btn btn-danger pay" onClick={() => { this.handleModal('formModalIsOpen', true); this.handleModal('menuItemsModalIsOpen', false) }}> Pay Now</button>
                        {menuItems.map((item, index) => {
                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <span className="card-body">
                                                <h5 className="item-name">{item.name}</h5>
                                                <h5 className="item-price">&#8377;{item.price}</h5>
                                                <p className="item-descp">{item.description}</p>
                                            </span>
                                        </div>
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                            {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={formModalIsOpen}
                style={customStyles}
            >
                <div>
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px' }} onClick={() => this.handleModal('formModalIsOpen', false)}></div>
                    <div className="resName">{restaurant.name}</div>
                    <div className="resName">
                        <span>Amount : </span>
                        <span>{subTotal}</span>
                    </div>
                    <div className="subhead">Name</div>
                    <input className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter your name" onChange={(event) => this.handleChange(event, 'name')}  />
                    <div className="subhead">Email</div>
                    <input className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter your email" onChange={(event) => this.handleChange(event, 'email')} />
                    <div className="subhead">Mobile Number</div>
                    <input className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter mobile number" onChange={(event) => this.handleChange(event, 'mobileNumber')} />
                    <div className="subhead">Address</div>
                    <textarea className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter your address" onChange={(event) => this.handleChange(event, 'address')} />
                    <button className="btn btn-danger" style={{ float: 'right', margin: '5px' }} onClick={this.payment}>PROCEED</button>
                </div>
            </Modal>
        </div >
        )
    }
}

export default Details;