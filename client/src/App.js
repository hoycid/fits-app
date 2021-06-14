import Home from "./components/home";
import Navbar from "./components/navbar";
import CartContextProvider from "./contexts/CartContext";
import Pagination from "./components/pagination";
import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";

import "./App.css";

function App() {
  const [materials, setMaterials] = useState([]);
  const [commodities, setCommodities] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [materialsPerPage] = useState(10);

  const mounted = useRef();
  const wrapper = React.createRef();

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
        Axios.get(`http://localhost:3001/${0}`).then((response) => {
          setMaterials(response.data);
      if (!mounted.current) {
        Axios.get("http://localhost:3001/commodities").then((response) => {
          setCommodities(response.data);
        }, []);
      }

      if (commodities) mounted.current = true;

      if (materials) setLoading(false);
    };
    fetchMaterials();
  });

  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterials = materials.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App" ref={wrapper}>
      <CartContextProvider>
          <Navbar commodities={commodities}/>
        <Home
          commodities={commodities}
          materials={currentMaterials}
          loading={loading}
        />
      </CartContextProvider>
      <Pagination
        materialsPerPage={materialsPerPage}
        totalMaterials={materials.length}
        paginate={paginate}
      />
    </div>
  );
}

export default App;
