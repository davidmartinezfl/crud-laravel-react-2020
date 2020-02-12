import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const baseUrl = "http://192.168.0.3:8000/";

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        axios.get(baseUrl + 'api/products').then(response => {
            this.setState({ products: response.data })
        }).catch(error => {
            alert("Error " + error)
        })
    }

    renderList() {
        return this.state.products.map((data) => {
            return (
                <tr>
                    <td>{data.name}</td>
                    <td>{data.description}</td>
                    <td>{data.price}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Products</div>
                            <div className="card-body">
                                <table className="table table-bordered order-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody id="bodytable">
                                        {this.renderList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;

if (document.getElementById('product')) {
    ReactDOM.render(<Product />, document.getElementById('product'));
}
