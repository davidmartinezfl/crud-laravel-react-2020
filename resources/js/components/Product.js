import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const baseUrl = "http://192.168.0.3:8000/";

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],

            // Form Inputs
            formName: '',
            formDescription: '',
            formPrice: '',
            formQuantity: '',
        }

        // OnChange functions: input forms
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
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

    handleChangeName(event) {
        this.setState({ formName: event.target.value });
    }

    handleChangeDescription(event) {
        this.setState({ formDescription: event.target.value });
    }

    handleChangePrice(event) {
        this.setState({ formPrice: event.target.value });
    }

    handleChangeQuantity(event) {
        this.setState({ formQuantity: event.target.value });
    }

    sendNetworkProduct() {
        const formData = new FormData()
        formData.append('name', this.state.formName)
        formData.append('description', this.state.formDescription)
        formData.append('price', this.state.formPrice)
        formData.append('quantity', this.state.formQuantity)

        axios.post(baseUrl + 'api/products', formData).then(response => {
            if (response.data.success == true) {
                alert(response.data.message)
                // cargar datos de nuevo
                this.loadData()
                $("#exampleModal").modal("hide");
            }
        }).catch(error => {
            alert("Error " + error)
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
                                {/* Button trigger modal */}
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                                    Register
                                </button>
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

                                {/* Modal */}
                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Register Form</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <label htmlFor="name">Name*</label>
                                                    <input type="text" className="form-control" value={this.state.formName} onChange={this.handleChangeName} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="description">Description*</label>
                                                    <textarea className="form-control" rows="3" value={this.state.formDescription} onChange={this.handleChangeDescription}></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="price">Price*</label>
                                                    <input type="number" className="form-control" value={this.state.formPrice} onChange={this.handleChangePrice} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="quantity">Quantity*</label>
                                                    <input type="number" className="form-control" value={this.state.formQuantity} onChange={this.handleChangeQuantity} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" onClick={() => this.sendNetworkProduct()}>Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
