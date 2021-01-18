import Home from "./components/home";
import Navbar from "./components/navbar";
import CartContextProvider from "./contexts/CartContext";
import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";

import "./App.css";

function App() {
  const [materials, setMaterials] = useState();
  const [commodities, setCommodities] = useState();

  // useEffect(() => {
  //   Axios.get("http://localhost:3001/").then((response) => {
  //     setMaterials(response.data);
  //   });
  //   Axios.get("http://localhost:3001/commodities").then((response) => {
  //     setCommodities(response.data);
  //   });
  // }, []);

  const mounted = useRef();
  const wrapper = React.createRef();

  useEffect(() => {
    if (!mounted.current) {
      Axios.get(`http://localhost:3001/${0}`).then((response) => {
        setMaterials(response.data);
      });
      Axios.get("http://localhost:3001/commodities").then((response) => {
        setCommodities(response.data);
      });
      mounted.current = true;
    } else {
      Axios.get(`http://localhost:3001/${0}`).then((response) => {
        setMaterials(response.data);
      });
    }
  });

  return (
    <div className="App" ref={wrapper}>
      <CartContextProvider>
        <Navbar commodities={commodities} />
        <Home commodities={commodities} materials={materials} />
      </CartContextProvider>
    </div>
  );
}

export default App;
