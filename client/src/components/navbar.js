import React, { Component } from "react";
import {
  Button,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Modal,
  Badge,
  Table,
  Col,
} from "react-bootstrap";
import NavbarBtStrp from "react-bootstrap/Navbar";
import Axios from "axios";

import { CartContext } from "../contexts/CartContext";

import "../App.css";

class Navbar extends Component {
  static contextType = CartContext;
  state = {
    showCart: false,
    showNew: false,
    showEditQuantity: false,
    newQuantity: 1,
    editQuantityId: "",
    newMaterial: {
      title: "",
      type: "",
      quantity: "1",
      commodity: "",
      producer: "",
      year: "",
      shelf: "",
    },
  };

  render() {
    const { cart, removeFromCart, clearCart } = this.context;
    return (
      <div>
        <NavbarBtStrp className="custom-navbar" variant="dark">
          <NavbarBtStrp.Brand href="#home">FITS Center</NavbarBtStrp.Brand>
          <Nav className="mr-auto">
            <Nav.Link onClick={() => this.setState({ showNew: true })}>
              New (+)
            </Nav.Link>
            <NavDropdown title="Reports" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Inventory</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Recipient</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Logs</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="justify-content-end">
            <Nav.Link>
              <Button
                disabled={cart.length > 0 ? false : true}
                id="custom-button"
                onClick={() => this.setState({ showCart: true })}
              >
                Cart{" "}
                <Badge pill variant="light">
                  {cart.length}
                </Badge>
              </Button>
            </Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-light">Search</Button>
          </Form>
        </NavbarBtStrp>

        {
          // Cart modal
        }
        <Modal
          show={this.state.showCart}
          onHide={() => this.setState({ showCart: false })}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Cart
            </Modal.Title>
            <Badge pill variant="success">
                {cart.length}
              </Badge>
          </Modal.Header>
          <Modal.Body>
            <Table size="sm" bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Commodity</th>
                  <th>Producer</th>
                  <th>Year</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0
                  ? cart.map((material, index) => {
                      return (
                        <tr key={index}>
                          <td>{material.title}</td>
                          <td>{material.type}</td>
                          <td>{material.commodity}</td>
                          <td>{material.producer}</td>
                          <td>{material.year}</td>
                          <td>x {material.quantity}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              onClick={() => {
                                removeFromCart(material.id);
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={cart.length > 0 ? false : true}
              variant="outline-dark"
              onClick={() => {
                clearCart();
              }}
            >
              Clear cart
            </Button>
            <Button
              disabled={cart.length > 0 ? false : true}
              variant="success"
              onClick={() => this.setState({ showCart: false })}
            >
              Checkout
            </Button>
          </Modal.Footer>
        </Modal>

        {
          // New Material Modal
        }
        <Modal
          show={this.state.showNew}
          onHide={() => this.setState({ showNew: false })}
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>New </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={this.state.newMaterial.title}
                    placeholder="Enter title..."
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        newMaterial: {
                          ...this.state.newMaterial,
                          title: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={this.state.newMaterial.type}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        newMaterial: {
                          ...this.state.newMaterial,
                          type: e.target.value,
                        },
                      });
                    }}
                  >
                    <option>Select type...</option>
                    <option>Booklet</option>
                    <option>Brochure</option>
                    <option>Leaflet</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} xs={2}>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    value={this.state.newMaterial.quantity}
                    placeholder="1"
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        newMaterial: {
                          ...this.state.newMaterial,
                          quantity: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Commodity</Form.Label>
                  <Form.Control
                    as="select"
                    value={this.state.newMaterial.commodity}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        newMaterial: {
                          ...this.state.newMaterial,
                          commodity: e.target.value,
                        },
                      });
                    }}
                  >
                    {this.props.commodities ? (
                      this.props.commodities.map((commodity, index) => {
                        return <option key={index}>{commodity.name}</option>;
                      })
                    ) : (
                      <option>Select commodity...</option>
                    )}
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Producer</Form.Label>
                  <Form.Control
                    placeholder="Enter producer..."
                    value={this.state.newMaterial.producer}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        newMaterial: {
                          ...this.state.newMaterial,
                          producer: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={3}>
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    placeholder="Enter year..."
                    value={this.state.newMaterial.year}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        newMaterial: {
                          ...this.state.newMaterial,
                          year: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-dark"
              onClick={() => {
                this.setState({
                  ...this.state,
                  newMaterial: {
                    title: "",
                    type: "",
                    quantity: "1",
                    commodity: "",
                    producer: "",
                    year: "",
                    shelf: "",
                  },
                });
              }}
            >
              Clear all
            </Button>
            <Button
              variant="success"
              onClick={() => {
                this.setState({
                  ...this.state,
                  showNew: false,
                  newMaterial: {
                    title: "",
                    type: "",
                    quantity: "1",
                    commodity: "",
                    producer: "",
                    year: "",
                    shelf: "",
                  },
                });
                Axios.post("http://localhost:3001", this.state.newMaterial);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Navbar;
