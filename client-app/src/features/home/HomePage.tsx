import React from "react";
import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";

const HomePage = () => {
  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>Home page</h1>
      <Link to="/activities">Go To Activities</Link>
    </Container>
  );
};

export default HomePage;
