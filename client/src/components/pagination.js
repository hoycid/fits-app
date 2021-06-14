import React from "react";
import { Container } from "react-bootstrap";

const Pagination = ({ materialsPerPage, totalMaterials, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMaterials / materialsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container>
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a
                onClick={() => paginate(number)}
                href="!#"
                className="page-link"
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
};

export default Pagination;
