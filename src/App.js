import React, {useState} from 'react';
import MapChart from "./MapChart";
import ReactTooltip from "react-tooltip";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCode } from '@fortawesome/free-solid-svg-icons';
import { faDotCircle} from '@fortawesome/free-regular-svg-icons';

const date = new Date();

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
  const [content, setContent] = useState("");
  const [hidden, setHidden] = useState(false);
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
            <span className={"small text-dark mr-3"}>{rounded(totDead)}</span>
          </span>
      </Navbar>,
      <Container fluid className={"w-100 h-100 p-0"}>
        <Row noGutters={"true"} className={"h-100"}>
          <Col className={"h-100"}>
            <MapChart
                setTooltipContent={setContent}
                style={{marginTop: "50px"}}
                setTotConf={setTotConf}
                setTotRec={setTotRec}
                setTotDead={setTotDead}
            />
            <ReactTooltip>{content}</ReactTooltip>
          </Col>
        </Row>
      </Container>,
      <div className="info small text-muted" style={hidden ? {display: "none"} : {display:"block"}} onClick={() => {setHidden(true)}}>
        <span class="text-danger">Red: confirmed</span><br />
        <span class="text-success">Green: recovered</span><br />
        <span class="text-dark">Black: deceased</span><br />
        <sub>
          Using live data from <br /><a target="_blank" href={"https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series"}><FontAwesomeIcon icon={faDatabase} /> John Hopkins repository</a><br/>Last synchronized on {date.toLocaleDateString()} at {date.toLocaleTimeString()}<br/>
            <a target="_blank" href={"https://github.com/daniel-karl/covid19-map"}><FontAwesomeIcon icon={faCode} /> Who made this?</a>
        </sub><br />
        <span className="small text-danger">Hold &lt;CTRL&gt; key to zoom</span>
      </div>
    ]
  );
}

export default App;
