import React from 'react';
import '../Styles/quicksearch.css';
import { withRouter } from 'react-router-dom';

class QuickSearch extends React.Component {
    handleClick = (mealtypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealtypeId}`);
        }
    }

    render() {
        const { quicksearch } = this.props;
        return (
            <div>
                <div className="quicksearch">
                    <p className="quicksearchHeading">
                        Quick Searches
        </p>
                    <p className="quicksearchSubHeading">
                        Discover restaurants by type of meal
        </p>
                    <div className="container-fluid">

                        <div className="row">

                            {quicksearch.map((item) => {
                                return <div className="col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleClick(item.meal_type)}>
                                    <div className="tileContainer">
                                        <div className="tileComponent1">
                                            <img src={item.image} height="150" width="140" />
                                        </div>
                                        <div className="tileComponent2">
                                            <div className="componentHeading">
                                                {item.name}
                                            </div>
                                            <div className="componentSubHeading">
                                                {item.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearch);