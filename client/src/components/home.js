import React, { Component } from "react";
import {
  Table,
  Container,
  ButtonGroup,
  Dropdown,
  Spinner,
  Modal,
  Form,
  Button,
  Col,
} from "react-bootstrap";
import moment from 'moment';
import Axios from "axios";

import { CartContext } from "../contexts/CartContext";
import { FiShoppingCart, FiSettings } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

class Home extends Component {
  static contextType = CartContext;
  state = {
    materials: [],
    currentMaterial: "",
    showEdit: false,
    editMaterial: {
      title: "",
      type: "",
      quantity: "",
      commodity: "",
      producer: "",
      year: "",
      shelf: "",
    },
  };

  componentDidMount() {
    const date = moment().format()
    this.setState({...this.state, currentDate: date});
  }

  render() {
    const { cart, addToCart } = this.context;
    return (
      <Container>
        {this.props.materials ? (
          <Table
            variant="light"
            size="md"
            responsive="lg"
            striped
            bordered
            hover
          >
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Quantity</th>
                <th>Commodity</th>
                <th>Type</th>
                <th>Producer</th>
                <th>Year</th>
                <th>Shelf</th>
                <th></th>
              </tr>
            </thead>
            {this.props.materials
              ? this.props.materials.map((material, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{material.title ? material.title : "Untitled"}</td>
                        <td>{material.quantity ? material.quantity : 0}</td>
                        <td>
                          {material.commodity ? material.commodity : "Unknown"}
                        </td>
                        <td>{material.type ? material.type : "Others"}</td>
                        <td>
                          {material.producer ? material.producer : "Unknown"}
                        </td>
                        <td>{material.year ? material.year : "Unknown"}</td>
                        <td>N/A</td>
                        <td>
                          <ButtonGroup>
                            <Button
                              disabled={material.quantity > 0 ? false : true}
                              id="custom-button-cart"
                              onMouseEnter={() => {
                                this.setState({ currentMaterial: material.id });
                              }}
                              onClick={() => {
                                const materialToAdd = this.props.materials.find(
                                  (material) =>
                                    material.id === this.state.currentMaterial
                                );
                                const existing = cart.find((material) => material.id === materialToAdd.id)
                                if (!existing) addToCart(materialToAdd);
                              }}
                            >
                              <FiShoppingCart />
                            </Button>
                            <Dropdown>
                              <Dropdown.Toggle split>
                                <FiSettings />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onMouseEnter={() => {
                                    this.setState({
                                      currentMaterial: material.id,
                                    });
                                  }}
                                  onClick={() => {
                                    this.setState({ showEdit: true });
                                    Axios.get(
                                      `http://localhost:3001/edit/${this.state.currentMaterial}`
                                    ).then((response) => {
                                      this.setState({
                                        editMaterial: response.data,
                                      });
                                    });
                                  }}
                                >
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onMouseEnter={() => {
                                    this.setState({
                                      currentMaterial: material.id,
                                    });
                                  }}
                                  onClick={() => {
                                    Axios.delete(
                                      `http://localhost:3001/${this.state.currentMaterial}`
                                    ).then((response) => {
                                      if (response.status === 200) {
                                        Axios.post("http://localhost:3001/log", {action: "delete", title: material.title, quantity: material.quantity, date: this.state.currentDate})
                                        .then((response) => {
                                          if (response.status === 200) console.log("Change has been logged succesfully")
                                        }, (error) => {
                                          if (error) console.log(`Unable to log changes. Error = ${error}`)
                                        });
                                      }
                                    }, (error) => {
                                      if (error) console.log(error)
                                    });
                                  }}
                                >
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </ButtonGroup>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              : "Loading data..."}
          </Table>
        ) : (
          <Container fluid>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Container>
        )}

        {
          // Edit modal
        }

        <Modal
          show={this.state.showEdit}
          onHide={() => this.setState({ showEdit: false })}
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={
                      this.state.editMaterial.title
                        ? this.state.editMaterial.title
                        : ""
                    }
                    placeholder="Enter title..."
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        editMaterial: {
                          ...this.state.editMaterial,
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
                    value={
                      this.state.editMaterial.type
                        ? this.state.editMaterial.type
                        : ""
                    }
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        editMaterial: {
                          ...this.state.editMaterial,
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
                    value={
                      this.state.editMaterial.quantity
                        ? this.state.editMaterial.quantity
                        : ""
                    }
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        editMaterial: {
                          ...this.state.editMaterial,
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
                    value={
                      this.state.editMaterial.commodity
                        ? this.state.editMaterial.commodity
                        : ""
                    }
                    onClick={() => this.setState({ clicked: true })}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        editMaterial: {
                          ...this.state.editMaterial,
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
                    value={
                      this.state.editMaterial.producer
                        ? this.state.editMaterial.producer
                        : ""
                    }
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        editMaterial: {
                          ...this.state.editMaterial,
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
                    value={
                      this.state.editMaterial.year
                        ? this.state.editMaterial.year
                        : ""
                    }
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        editMaterial: {
                          ...this.state.editMaterial,
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
                  editMaterial: {
                    title: "",
                    type: "",
                    quantity: "",
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
                Axios.put(
                  `http://localhost:3001/${this.state.currentMaterial}`,
                  this.state.editMaterial
                ).then((response) => {
                  if (response.status === 200) {
                    Axios.post("http://localhost:3001/log", {action: "edit", title: this.state.editMaterial.title, quantity: this.state.editMaterial.quantity})
                  .then((response) => {
                    this.setState({
                      ...this.state,
                      showEdit: false,
                    });
                    if (response.status === 200) console.log("Change has been logged successfully")
                  }, (error) => {
                    if (error) console.log(`Unable to log changes. Error: ${error}`)
                  });
                  }
                })
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default Home;
