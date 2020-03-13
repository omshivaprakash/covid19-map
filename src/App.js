import React, {useState} from 'react';
import MapChart from "./MapChart";
import ReactTooltip from "react-tooltip";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [content, setContent] = useState("");
  return (

        [
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
                <FontAwesomeIcon icon={faUserMd} /> <span className="small">COVID19</span>
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
