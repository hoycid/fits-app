import React, { Component, createContext } from "react";
export const CartContext = createContext();

class CartContextProvider extends Component {
  state = {
    cart: [],
  };

  addToCart = (material) => {
    this.setState({ cart: [...this.state.cart, material] });
  };

  // editQuantity = (id, newQuantity) => {
  //   const cart = this.state.cart;
  //   const index = cart.ages.findIndex((material) => material.id === id)
  //   cart[index].quantity = newQuantity;
  //   this.setState({cart: [...cart]})
  // }

  removeFromCart = (id) => {
    const updatedCart = this.state.cart.filter(
      (material) => material.id !== id
    );
    this.setState({ cart: [...updatedCart] });
  };

  clearCart = () => {
    this.setState({ cart: [] });
  };

  render() {
    return (
      <CartContext.Provider
        value={{
          ...this.state,
          addToCart: this.addToCart,
          editQuantity: this.editQuantity,
          removeFromCart: this.removeFromCart,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export default CartContextProvider;
