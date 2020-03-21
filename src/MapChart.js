import React, {memo, useState} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

import * as Testing from "./TestingRates";
import * as Population from "./Population";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize, faWindowRestore, faUsers, faProcedures, faHeartbeat, faHeartBroken} from '@fortawesome/free-solid-svg-icons';

import Papa from "papaparse";
import Form from 'react-bootstrap/Form';
import ReactBootstrapSlider from "react-bootstrap-slider";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-10m.json";

const ONE_M = 1000000;

const deathsByRowId = {};
const recoveredAbsByRowId = {};
const deathsAbsByRowId = {};

const confirmed = [];
const recovered = [];
const deaths = [];
const unconfirmed = []; /* this will be local_confirmed_rate * avg_test_rate / local_test_rate */
const MAX_SIZE = 67799;

let totConf = 0;
let totRec = 0;
let totDead = 0;

let dayOffset = -1;

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else if (num > 1000) {
    return Math.round(num / 100) / 10 + "K";
  } else {
    return Math.round(num);
  }
};

class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setTooltipContent: props.setTooltipContent,
      setTotConf: props.setTotConf,
      setTotRec: props.setTotRec,
      setTotDead: props.setTotDead,
      chart: "pie",
      factor: 50,
      width: 2,
      logmode: true,
      momentum: "none",
      ppmmode: false,
      minimized: false,
      testmode: true
    }
  }

  componentDidMount() {
    let that = this;
    Papa.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv", {
      download: true,
      complete: function(results) {
        // confirmed
        that.confirmed = [];
        let skipRow = true;
        let minSize = 0;
        let maxSize = MAX_SIZE;
        let rowId = 0;
        let avgTested = 0;
        let avgPopulation = 0;
        let countTested = 0;
        let countPopulation = 0;
        for(let data of results.data) {
          if(skipRow) {
            skipRow = false;
            continue;
          }
          let size = "";
          let sizeMin1 = "";
          let sizeMin3 = "";
          let sizeMin7 = "";
          let i = data.length - 1;
          while(size==="" && i > 0) {
            size = data[i];
            sizeMin1 = data[i - 1];
            sizeMin3 = data[i - 3];
            sizeMin7 = data[i - 7];
            i = i - 1;
          }
          if(size==="") {
            size = 0;
          }
          if(sizeMin1==="") {
            sizeMin1 = 0;
          }
          if(sizeMin3==="") {
            sizeMin3 = 0;
          }
          if(sizeMin7==="") {
            sizeMin7 = 0;
          }
          size = Number(size);
          sizeMin1 = Number(sizeMin1);
          sizeMin3 = Number(sizeMin3);
          sizeMin7 = Number(sizeMin7);
          if(size > maxSize) {
            maxSize = size;
          }
          let marker = {
            markerOffset: 0,
            name: (data[0] ? data[0] + ", " + data[1] : data[1]) ? (data[0] ? data[0] + ", " + data[1] : data[1]) : "",
            coordinates: [data[3], data[2]],
            size: size,
            sizeMin1: sizeMin1,
            sizeMin3: sizeMin3,
            sizeMin7: sizeMin7,
            val: size,
            rowId: rowId,
            valMin1: size - sizeMin1,
            valMin3: size - sizeMin3,
            valMin7: size - sizeMin7
          };
          totConf += size;
          confirmed.push(marker);

          // compute total tested and total population
          if(Testing.RATES[marker.name] && Population.ABSOLUTE[marker.name]) {
            avgTested += Testing.RATES[marker.name];
            avgPopulation += Population.ABSOLUTE[marker.name];
            countTested++;
            countPopulation++;
          }
          rowId++;
        }
        avgTested /= countTested;
        avgPopulation /= countPopulation;
        that.state.setTotConf(totConf);
        for(let i = 0; i < confirmed.length; i++) {
          confirmed[i].size = (confirmed[i].size - minSize) / (maxSize - minSize);
          confirmed[i].momentumLast1 = confirmed[i].size - (confirmed[i].sizeMin1 - minSize) / (maxSize - minSize);
          confirmed[i].momentumLast3 = confirmed[i].size - (confirmed[i].sizeMin3 - minSize) / (maxSize - minSize);
          confirmed[i].momentumLast7 = confirmed[i].size - (confirmed[i].sizeMin7 - minSize) / (maxSize - minSize);
        }

        // unconfirmed
        let globalTestRate = avgTested / avgPopulation;
        that.unconfirmed = [];
        skipRow = true;
        rowId = 0;
        for(let data of results.data) {
          if(skipRow) {
            skipRow = false;
            continue;
          }
          let size = confirmed[rowId].size;
          let val = confirmed[rowId].val;
          if(Testing.RATES[confirmed[rowId].name] && Population.ABSOLUTE[confirmed[rowId].name]) {
            let localTestRate = Testing.RATES[confirmed[rowId].name] / Population.ABSOLUTE[confirmed[rowId].name];
            let inverseTestFactor = globalTestRate / localTestRate;
            size = size * inverseTestFactor;
            val = val * inverseTestFactor;
          } else {
            size = 0;
          }
          let marker = {
            markerOffset: 0,
            name: confirmed[rowId].name,
            coordinates: confirmed[rowId].coordinates,
            size: size,
            val: val,
            rowId: confirmed[rowId].rowId,
          };
          unconfirmed.push(marker);
          rowId++;
        }
        that.setState({});
      }
    });

    Papa.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv", {
      download: true,
      complete: function(results) {
        that.recovered = [];
        let skipRow = true;
        let minSize = 0;
        let maxSize = MAX_SIZE;
        let rowId = 0;
        for(let data of results.data) {
          if(skipRow) {
            skipRow = false;
            continue;
          }
          let size = "";
          let sizeMin1 = "";
          let sizeMin3 = "";
          let sizeMin7 = "";
          let i = data.length - 1;
          while(size==="" && i > 0) {
            size = data[i];
            sizeMin1 = data[i - 1];
            sizeMin3 = data[i - 3];
            sizeMin7 = data[i - 7];
            i = i - 1;
          }
          if(size==="") {
            size = 0;
          }
          if(sizeMin1==="") {
            sizeMin1 = 0;
          }
          if(sizeMin3==="") {
            sizeMin3 = 0;
          }
          if(sizeMin7==="") {
            sizeMin7 = 0;
          }
          size = Number(size);
          sizeMin1 = Number(sizeMin1);
          sizeMin3 = Number(sizeMin3);
          sizeMin7 = Number(sizeMin7);
          if(size > maxSize) {
            maxSize = size;
          }
          let marker = {
            markerOffset: 0,
            name: data[0] ? data[0] + ", " + data[1] : data[1],
            coordinates: [data[3], data[2]],
            size: size,
            sizeMin1: sizeMin1,
            sizeMin3: sizeMin3,
            sizeMin7: sizeMin7,
            val: size,
            rowId: rowId,
            valMin1: size - sizeMin1,
            valMin3: size - sizeMin3,
            valMin7: size - sizeMin7
          };
          totRec += size;
          recovered.push(marker);
          rowId++;
        }
        that.state.setTotRec(totRec);
        for(let i = 0; i < recovered.length; i++) {
          recoveredAbsByRowId[recovered[i].rowId] = recovered[i].size;
          recovered[i].size = (recovered[i].size - minSize) / (maxSize - minSize);
          recovered[i].momentumLast1 = recovered[i].size - (recovered[i].sizeMin1 - minSize) / (maxSize - minSize);
          recovered[i].momentumLast3 = recovered[i].size - (recovered[i].sizeMin3 - minSize) / (maxSize - minSize);
          recovered[i].momentumLast7 = recovered[i].size - (recovered[i].sizeMin7 - minSize) / (maxSize - minSize);
        }
        that.setState({});
      }
    });

    Papa.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv", {
      download: true,
      complete: function(results) {
        that.deaths = [];
        let skipRow = true;
        let minSize = 0;
        let maxSize = MAX_SIZE;
        let rowId = 0;
        for(let data of results.data) {
          if(skipRow) {
            skipRow = false;
            continue;
          }
          let size = "";
          let i = data.length - 1;
          while(size==="" && i > 0) {
            size = data[i];
            i = i - 1;
          }
          if(size==="") {
            size = 0;
          }
          size = Number(size);
          if(size > maxSize) {
            maxSize = size;
          }
          let marker = {
            markerOffset: 0,
            name: data[0] ? data[0] + ", " + data[1] : data[1],
            coordinates: [data[3], data[2]],
            size: size,
            val: size,
            rowId: rowId
          };
          totDead += size;
          deaths.push(marker);
          rowId++;
        }
        that.state.setTotDead(totDead);
        for(let i = 0; i < deaths.length; i++) {
          // console.log(deaths[i].size + ", " + minSize + ", " + maxSize);
          deathsAbsByRowId[deaths[i].rowId] = deaths[i].size;
          deaths[i].size = (deaths[i].size - minSize) / (maxSize - minSize);
          deathsByRowId[deaths[i].rowId] = deaths[i].size;
        }
        that.setState({});
      }
    });
  }

  render() {
    let that = this;
    return (
      <>
      <div className={"small controls" + (that.state.minimized ? " minimized" : "")}>
        {/*<Form.Check inline className="small hideInJh" checked={that.state.momentum==="none" } label="Live situation" type={"radio"} name={"a"} id={`inline-radio-4`} onClick={() => {that.setState({momentum: "none"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="last1" } label="Momentum last 1 day" type={"radio"} name={"b"} id={`inline-radio-5`} onClick={() => {that.setState({momentum: "last1", chart: "pie"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="last3" } label="Momentum last 3 days" type={"radio"} name={"b"} id={`inline-radio-6`} onClick={() => {that.setState({momentum: "last3", chart: "pie"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="last7" } label="Momentum last 7 days" type={"radio"} name={"b"} id={`inline-radio-7`} onClick={() => {that.setState({momentum: "last7", chart: "pie"});}} />*/}
        <a hidden={that.state.minimized} className={"btn-collapse"} onClick={() => {that.setState({minimized: true})}}>minimize <FontAwesomeIcon icon={faWindowMinimize}/></a>
        <a hidden={!that.state.minimized} className={"btn-collapse"} onClick={() => {that.setState({minimized: false})}}><FontAwesomeIcon icon={faWindowRestore}/></a>
        <div hidden={that.state.minimized}>
          <span className="small text-danger">Hover to see explanations.</span><br />
          <span className="small text-muted">Mode:</span>
          <Form.Control title={"Live mode: Show live data (updated daily). Change: Show increase/decrease in numbers since last 1, 3 or 7 days.  "} value={that.state.momentum} style={{lineHeight: "12px", padding: "0px", fontSize: "12px", height: "24px"}} size="sm" as="select" onChange={(e) => {that.setState({momentum: e.nativeEvent.target.value, chart: "pie", testmode: false});}}>
            <option value="none">Live</option>
            <option value="last1">Change since last 24 hours</option>
            <option value="last3">Change since last 3 days</option>
            <option value="last7">Change since last 7 days</option>
          </Form.Control>
          <Form.Check inline disabled={that.state.momentum !== "none"} className="small" checked={that.state.testmode} label={<span title={"Displays a projection of how many confirmed cases there could be if testing rate was as high as global average (shown on the map as blue halos)."}>Project lack of testing</span>} type={"checkbox"} name={"a"} id={`inline-checkbox-4`}
            onChange={() => {that.setState({testmode: !that.state.testmode});}} /><br />
          <span className="small text-muted mr-2">Normalization:</span><br />
          <Form.Check inline className="small" checked={that.state.logmode} label={<span title={"Scales the glyphs on the map logarithmically."}>Log</span>} type={"checkbox"} name={"a"} id={`inline-checkbox-2`}
            onChange={() => {that.setState({logmode: !that.state.logmode});}} />
          <Form.Check inline className="small" checked={that.state.ppmmode} label={<span title={"Scales the glyphs on the map according to the number of people in each country/region."}>Population</span>} type={"checkbox"} name={"a"} id={`inline-checkbox-3`}
            onChange={() => {that.setState({ppmmode: !that.state.ppmmode});}} /><br />
          <span className="small text-muted mr-2">Glyph style:</span><br/>
          <Form.Check inline title="Represent data as bubbles. Hover bubbles on map to see more details." className="small" checked={that.state.chart==="pie" } label="Bubbles" type={"radio"} name={"a"} id={`inline-radio-1`} onChange={() => {that.setState({chart: "pie"});}}/>
          <Form.Check inline title="Represent data as vertical bars. Hover bars on map to see more details." className="small hideInMomentum" checked={that.state.chart==="bar" } label="Bars" type={"radio"} name={"a"} id={`inline-radio-2`} onChange={() => {that.setState({chart: "bar"});}} disabled={that.state.momentum!=="none" ? true : false}/>
          <Form.Check inline title="Represent data as horizontal pill. Hover pill on map to see more details." className="small hideInMomentum" checked={that.state.chart==="pill" } label="Pills" type={"radio"} name={"a"} id={`inline-radio-3`} onChange={() => {that.setState({chart: "pill"});}} disabled={that.state.momentum!=="none" ? true : false}/><br />
          <span className="small text-muted">Scale glyphs:</span>
          <ReactBootstrapSlider title="Scale glyps" value={this.state.factor} change={e => {this.setState({ factor: e.target.value, width: e.target.value / 10 });}} step={1} max={100} min={1}></ReactBootstrapSlider><br />
          <span className="small text-danger">Hold &lt;CTRL&gt; + scroll to zoom map.</span><br />
          <span className="small text-danger">Hover glyphs on map to see details.</span>
        </div>
      </div>
      <div className="small timeline">
        Timeline view
        <span className="small ml-3">Check back soon for more details</span>
      </div>
      {
        that.state.momentum !== "none" &&
        <style dangerouslySetInnerHTML={{__html: `
          .hideInMomentum {
            display: none !important;
          }
          .showInMomentum {
            display: block !important;
          }
        `}} />
      }
      <ComposableMap
          projection={"geoMercator"}
          projectionConfig={{scale: 200}}
          height={window.innerWidth}
          width={window.innerHeight - 50}
          style={{width: "100%", height: "100%"}}
      >
        <ZoomableGroup maxZoom={1000}>
          <Geographies geography={geoUrl}>
            {
              ({geographies}) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const {NAME, POP_EST} = geo.properties;
                      if(NAME === "Antarctica") {
                        return;
                      }
                      let rowId = -1;
                      for(let c of confirmed) {
                        if(c.name === NAME) {
                          rowId = c.rowId;
                          break;
                        }
                      }
                      if(rowId < 0) {
                        this.state.setTooltipContent(`Could not retrieve data for ${NAME}.`);
                      } else {
                        this.state.setTooltipContent(
                            <div>
                              <b>{NAME}</b> &nbsp;
                              <span><FontAwesomeIcon icon={faUsers}/> {rounded(Population.ABSOLUTE[NAME])}</span><br />
                              <span><FontAwesomeIcon icon={faProcedures}/> {rounded(confirmed[rowId].val)} confirmed (>{rounded(unconfirmed[rowId].val)} at avg. test rate)</span><br/>
                              <span><FontAwesomeIcon icon={faHeartbeat}/> {rounded(recovered[rowId].val)} recovered</span>
                              &nbsp;<span><FontAwesomeIcon icon={faHeartBroken}/> {rounded(deaths[rowId].val)} deceased</span>
                            </div>
                        );
                      }
                    }}
                    onMouseLeave={() => {
                      this.state.setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: "#ddd" ,
                        outline: "none"
                      },
                      hover: {
                        fill: "#999",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#ddd",
                        outline: "none"
                      }
                    }}
                  />
                ))
            }
          </Geographies>
          {
            that.state.momentum!=="none" &&
              confirmed.map(({ rowId, name, coordinates, markerOffset, momentumLast1, momentumLast3, momentumLast7, valMin1, valMin3, valMin7 }) => {
                let pop = Population.ABSOLUTE[name];
                let size;
                let val;
                switch(that.state.momentum) {
                  case "last1":
                    size = momentumLast1 - recovered[rowId].momentumLast1;
                    val = valMin1 - recovered[rowId].valMin1;
                    break;
                  case "last3":
                    size = momentumLast3 - recovered[rowId].momentumLast3;
                    val = valMin3 - recovered[rowId].valMin3;
                    break;
                  case "last7":
                    size = momentumLast7 - recovered[rowId].momentumLast7;
                    val = valMin7 - recovered[rowId].valMin7;
                    break;
                  default:
                    alert("something went wrong");
                    console.log("something went wrong");
                    break;
                }
                let pos = size >= 0;
                size = Math.abs(size);
                size = this.scaleLog(size);
                size = this.scalePpm(size, pop);
                size = this.scaleLogAndPpm(size);
                return (<Marker coordinates={coordinates} key={"change_" + rowId}>
                  <circle r={isNaN(size)?0:Math.sqrt(size) * that.state.factor} fill={pos ? "#F008" : "#0F08"} />
                  <title>
                    {`
                      ${name} - ${Math.abs(val)} ${pos ? "INCREASE" : "DECREASE"} in active(= confirmed-recovered) cases (excl. deceased) (${Math.round(ONE_M*val/pop)} ppm)`
                    }
                  </title>
                  <text
                    textAnchor="middle"
                    y={markerOffset}
                    style={{ fontSize: name.endsWith(", US") ? "0.005em" : "2px", fontFamily: "Arial", fill: "#5D5A6D33", pointerEvents: "none" }}
                  >
                    {name}
                  </text>
                </Marker>
            )})
          }
          {
            that.state.momentum==="none" && that.state.testmode &&
            unconfirmed.map(({ rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#00F";
              let pop = Population.ABSOLUTE[name];
              let active = val - recoveredAbsByRowId[rowId] - deathsAbsByRowId[rowId];
              size = this.scale(size, pop);
		      let ppms = pop && !isNaN(val) ? '(' + Math.round(ONE_M * val / pop) + ' ppm)'  : '';
		      let ppms2 = pop && !isNaN(active) ? '(' + Math.round(ONE_M * active / pop) + ' ppm)'  : '';
		      let text = `${name} - could be >${rounded(val)} confirmed ${ppms}, >${rounded(active)} active ${ppms2} if local test rate was like global average test rate`;
              return this.marker(coordinates, rowId, color, text, size, val, name, markerOffset, "projected", "8");
            })
          }
          {
            that.state.momentum==="none" &&
            confirmed.map(({ rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#F00";
              let pop = Population.ABSOLUTE[name];
              let active = val - recoveredAbsByRowId[rowId] - deathsAbsByRowId[rowId];
              size = this.scale(size, pop);
		      let ppms = pop && !isNaN(val) ? '(' + Math.round(ONE_M * val / pop) + ' ppm)'  : '';
		      let ppms2 = pop && !isNaN(active) ? '(' + Math.round(ONE_M * active / pop) + ' ppm)'  : '';
		      let text = `${name} - ${rounded(val)} confirmed ${ppms}, ${rounded(active)} active ${ppms2}`;
              return this.marker(coordinates, rowId, color, text, size, val, name, markerOffset, "confirmed", "8");
            })
          }
          {
            confirmed.map(({ rowId, name, coordinates, markerOffset, size }) => {
              if (size > 0) {
                return (<Marker coordinates={coordinates} key={"label_" + rowId}>
                  <text
                      textAnchor="middle"
                      y={markerOffset}
                      style={{
                        fontSize: name.endsWith(", US") ? "1.5px" : "2px",
                        fontFamily: "Arial",
                        fill: "#5D5A6D33",
                        pointerEvents: "none"
                      }}
                  >
                    {name}
                  </text>
                </Marker>)
              }
              else {
                return ("");
              }
            })
          }
          {
            that.state.momentum==="none" && !that.state.jhmode &&
            recovered.map(({rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#0F0";
              let pop = Population.ABSOLUTE[name];
              if (that.state.chart === "pie" || that.state.chart === "pill") {
                size += deathsByRowId[rowId];
              }
              size = this.scale(size, pop);
              let ppms = pop && !isNaN(val) ? '(' + Math.round(ONE_M * val / pop) + ' ppm)' : '';
              let text = name + " - " + rounded(val) + " recovered " + ppms;
              return this.marker(coordinates, rowId, color, text, size, val, name, markerOffset, "recovered", "8");
            })
          }
          {
            that.state.momentum==="none" && !that.state.jhmode &&
            deaths.map(({rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#000";
              let pop = Population.ABSOLUTE[name];
              size = this.scale(size, pop);
              let ppms = pop && !isNaN(val) ? '(' + Math.round(ONE_M * val / pop) + ' ppm)'  : '';
              let text = name + " - " + rounded(val) + " deceased " + ppms;
              return this.marker(coordinates, rowId, color, text, size, val, name, markerOffset, "deceased", "a");
            })
          }
        </ZoomableGroup>
      </ComposableMap>
    </>
    );
  }

  marker = (coordinates, rowId, color, text, size, val, name, markerOffset, type, transparency) => {
    return (
        <Marker coordinates={coordinates} key={type + "_" + rowId}>
          /* pill */
          <rect
              fill={color + transparency}
              style={this.state.chart==="pill" ? {display: "block"} : {display: "none"}}
              x={isNaN(size)?0:- size * this.state.factor / 2}
              y={-this.state.width/2*3}
              height={this.state.width*3}
              width={isNaN(size)?0:size * this.state.factor}
          />

          /* bar */
          <rect
              fill={color + transparency}
              style={this.state.chart==="bar" ? {display: "block"} : {display: "none"}}
              x={this.state.width * 3 * 2 - this.state.width * 3 * 1.5}
              y={isNaN(size)?0:-size * this.state.factor}
              height={isNaN(size)?0:size * this.state.factor}
              width={this.state.width * 3}
          />

          /* bubble */
          <circle
              fill={color + transparency}
              style={this.state.chart==="pie" ? {display: "block"} : {display: "none"}}
              r={isNaN(size)?0:Math.sqrt(size) * this.state.factor}
              onMouseOver={() => {
                if(rowId < 0) {
                  this.state.setTooltipContent(`Could not retrieve data for ${name}.`);
                } else {
                  this.state.setTooltipContent(
                      <div>
                        <b>{name}</b> &nbsp;
                        <span><FontAwesomeIcon icon={faUsers}/> {rounded(Population.ABSOLUTE[name])}</span><br />
                        <span><FontAwesomeIcon icon={faProcedures}/> {rounded(confirmed[rowId].val)} confirmed (>{rounded(unconfirmed[rowId].val)} at avg. test rate)</span><br/>
                        <span><FontAwesomeIcon icon={faHeartbeat}/> {rounded(recovered[rowId].val)} recovered</span>
                        &nbsp;<span><FontAwesomeIcon icon={faHeartBroken}/> {rounded(deaths[rowId].val)} deceased</span>
                      </div>
                  );
                }
              }}
              onMouseOut={() => {
                this.state.setTooltipContent("");
              }}
          />

          <title>{text}</title>
        </Marker>
    )
  };

  scale = (value, population) => {
    value = this.scaleIfPillOrBar(value);
    value = this.scaleLog(value);
    value = this.scalePpm(value, population);
    value = this.scaleLogAndPpm(value);
    return value;
  };

  scaleIfPillOrBar = (value) => {
    if(this.state.chart==="pill" || this.state.chart==="bar") {
      return value * 10;
    }
    return value;
  };

  scaleLog = (value) => {
    if(!this.state.logmode) {
      return value;
    }
    if(value > 0) {
      return Math.log(value * 10000) / 100;
    }
    return 0;
  };

  scalePpm = (value, population) => {
    if(!this.state.ppmmode) {
      return value;
    }
    if(population) {
      if(value > 0) {
        return ONE_M * value / population * 10;
      }
    }
    return 0;
  };

  scaleLogAndPpm = (value) => {
    if(this.state.logmode && this.state.ppmmode) {
      return value / 10;
    }
    return value;
  };

}

export default memo(MapChart);
