import React, {useState} from 'react';
import MapChart from "./MapChart";
import ReactTooltip from "react-tooltip";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [content, setContent] = useState("");
  return (

        [
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
              <FontAwesomeIcon icon={faUserMd} /> COVID19
            </Navbar.Brand>
          </Navbar>,

          <Container fluid className={"p-0"}>
            <Row noGutters={"true"}>
              <Col>
                <MapChart setTooltipContent={setContent} />
                <ReactTooltip>{content}</ReactTooltip>
              </Col>
            </Row>
          </Container>
        ]
  );
}

export default App;
