import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const baseUrl = "";

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

            // to edit resource
            productId: 0,
            isEdit: false,

            // for the search engine
            productsAux: [],
            textSearch: ''
        }

        // OnChange functions: input forms
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        axios.get(baseUrl + 'api/products').then(response => {
            this.setState({
                products: response.data,
                productAux: response.data
            })
        }).catch(error => {
            alert("Error " + error)
        })
    }

    renderList() {
        return this.state.products.map((data) => {
            return (
                <tr key={data.id}>
                    <td>{data.name}</td>
                    <td>{data.description}</td>
                    <td>{data.price}</td>
                    <td>{data.quantity}</td>
                    <td>
                        <button className="btn btn-info" onClick={() => this.showModalEdit(data)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => this.showModalDelete(data)}>Delete</button>
                    </td>
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

    showModalCreate() {
        this.setState({
            productId: 0,
            formName: '',
            formDescription: '',
            formPrice: '',
            formQuantity: '',
            isEdit: false
        })
        $("#exampleModal").modal("show");
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

    showModalEdit(data) {
        this.setState({
            formName: data.name,
            formDescription: data.description,
            formPrice: data.price,
            formQuantity: data.quantity,
            productId: data.id,
            isEdit: true
        })
        $("#exampleModal").modal("show");
    }

    sendNetworkUpdate() {
        const formData = {
            name: this.state.formName,
            description: this.state.formDescription,
            price: this.state.formPrice,
            quantity: this.state.formQuantity,
        }

        axios.put(baseUrl + `api/products/${this.state.productId}`, formData)
            .then(response => {
                if (response.data.success == true) {
                    alert(response.data.message)
                    // cargar datos de nuevo
                    this.loadData()
                    $("#exampleModal").modal("hide");
                }
            })
            .catch(error => {
                alert("sendNetworkUpdate " + error)
                console.log(error)
            })
    }

    showModalDelete(data) {
        this.setState({ productId: data.id })
        $("#exampleModalDelete").modal("show");
    }

    sendNetworkDelete() {
        const formData = new FormData()
        formData.append('id', this.state.productId)

        axios.delete(baseUrl + `api/products/${this.state.productId}`, formData)
            .then(response => {
                if (response.data.success == true) {
                    alert(response.data.message)
                    // para cargar datos de nuevo
                    this.loadData()
                    $("#exampleModalDelete").modal("hide");
                }
            }).catch(error => {
                alert("Error " + error)
            })
    }

    handleChangeFilter(event) {
        var text = event.target.value // input search
        const data = this.state.productAux
        const newData = data.filter(function (item) {
            const itemDataName = item.name.toUpperCase()
            const itemDataDescripction = item.description.toUpperCase()
            const itemDataPrice = item.price.toUpperCase()
            const itemDataQuantity = item.quantity

            const itemData = itemDataName + " " + itemDataDescripction + " " + itemDataPrice + " " + itemDataQuantity
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })

        this.setState({
            products: newData,
            textSearch: text,
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
                                <input type="text" className="form-control" placeholder="Search" value={this.state.textSearch} onChange={this.handleChangeFilter} />
                                <br />
                                {/* Button trigger modal */}
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={() => this.showModalCreate()}>Register</button>
                                <table className="table table-bordered order-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="bodytable">
                                        {this.renderList()}
                                    </tbody>
                                </table>

                                {/* Modal Register & Edit */}
                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Product Form</h5>
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
                                                {
                                                    this.state.isEdit ?
                                                        <button type="button" className="btn btn-primary" onClick={() => this.sendNetworkUpdate()}>Edit</button>
                                                        :
                                                        <button type="button" className="btn btn-primary" onClick={() => this.sendNetworkProduct()}>Register</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Delete */}
                                <div className="modal fade" id="exampleModalDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Delete</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Are you sure you want to delete a product?</p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                <button type="button" className="btn btn-primary" onClick={() => this.sendNetworkDelete()}>Delete</button>
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
