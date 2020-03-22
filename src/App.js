import React, {useState} from 'react';
import MapChart from "./MapChart";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle} from '@fortawesome/free-regular-svg-icons';

const rounded = (num) => {
    if (num > 1000000000) {
        return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return Math.round(num / 100000) / 10 + "M";
    } else {
        return Math.round(num / 100) / 10 + "K";
    }
};

function App() {
  const [totConf, setTotConf] = useState(0);
  const [totRec, setTotRec] = useState(0);
  const [totDead, setTotDead] = useState(0);

  return (
    [
      <Navbar bg="light" fixed="top" className={"p-0 pl-2"} expand={"xs"}>
        <Navbar.Brand>
            <span className="small">C<FontAwesomeIcon icon={faDotCircle} />VID19 </span>
        </Navbar.Brand>
          <span>
            <span className={"small text-muted mr-3"}>Total:</span>
            <span className={"small text-danger mr-3"}>{rounded(totConf)}</span>
            <span className={"small text-success mr-3"}>{rounded(totRec)}</span>
            <span className={"small mr-3"}>{rounded(totDead)}</span>
          </span>
      </Navbar>,
      <Container fluid className={"w-100 h-100 p-0"}>
        <Row noGutters={"true"} className={"h-100"}>
          <Col className={"h-100"}>
            <MapChart
                key={"mapChart"}
                style={{marginTop: "50px"}}
                setTotConf={setTotConf}
                setTotRec={setTotRec}
                setTotDead={setTotDead}
            />
          </Col>
        </Row>
      </Container>
    ]
  );
}

export default App;
