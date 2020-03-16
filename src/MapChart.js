import React, { memo} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

import Papa from "papaparse";
import Form from 'react-bootstrap/Form';
import ReactBootstrapSlider from "react-bootstrap-slider";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-10m.json";

const deathsByRowId = {};
const recoveredAbsByRowId = {};
const deathsAbsByRowId = {};

const confirmed = [];
const recovered = [];
const deaths = [];
const MAX_SIZE = 67786;

let totConf = 0;
let totRec = 0;
let totDead = 0;

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
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
      factor: 20,
      width: 2,
      jhmode: false,
      momentum: "none"
    }
  }

  componentDidMount() {
    let that = this;
    Papa.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv", {
      download: true,
      complete: function(results) {
        that.confirmed = [];
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
          rowId++;
        }
        that.state.setTotConf(totConf);
        console.log(maxSize);
        for(let i = 0; i < confirmed.length; i++) {
          confirmed[i].size = (confirmed[i].size - minSize) / (maxSize - minSize);
          confirmed[i].momentumLast1 = confirmed[i].size - (confirmed[i].sizeMin1 - minSize) / (maxSize - minSize);
          confirmed[i].momentumLast3 = confirmed[i].size - (confirmed[i].sizeMin3 - minSize) / (maxSize - minSize);
          confirmed[i].momentumLast7 = confirmed[i].size - (confirmed[i].sizeMin7 - minSize) / (maxSize - minSize);
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
          // console.log(recovered[i].size + ", " + minSize + ", " + maxSize);
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
      <Form>
        <div className="ml-3 small controls">
          <Form.Check inline className="small" checked={that.state.chart==="pie" } label="Circles" type={"radio"} name={"a"} id={`inline-radio-1`} onClick={() => {that.setState({chart: "pie"});}}/>
          <Form.Check inline className="small hideInJh" checked={that.state.chart==="pill" } label="Progress" type={"radio"} name={"a"} id={`inline-radio-3`} onClick={() => {that.setState({chart: "pill"});}} disabled={that.state.momentum!=="none" ? true : false}/>
          <Form.Check inline className="small hideInJh" checked={that.state.chart==="bar" } label="Bars" type={"radio"} name={"a"} id={`inline-radio-2`} onClick={() => {that.setState({chart: "bar"});}} disabled={that.state.momentum!=="none" ? true : false}/>
        </div>
      </Form>
      <div className="small controls2">
        <ReactBootstrapSlider value={this.state.factor} change={e => {this.setState({ factor: e.target.value, width: e.target.value / 10 });}} step={1} max={100} min={1} />
        <Form.Check inline className="small" checked={that.state.jhmode} label={<span style={{color: "white", background: "black", padding: "0 3px"}}>Johns Hopkins Mode 🤔🤷</span>}type={"checkbox"} name={"a"} id={`inline-checkbox-2`}
                    onClick={() => {that.setState({jhmode: !that.state.jhmode, chart: "pie", factor: 20, momentum: "none"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="none" } label="Live situation" type={"radio"} name={"a"} id={`inline-radio-4`} onClick={() => {that.setState({momentum: "none"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="last1" } label="Momentum last 1 day" type={"radio"} name={"b"} id={`inline-radio-5`} onClick={() => {that.setState({momentum: "last1", chart: "pie"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="last3" } label="Momentum last 3 days" type={"radio"} name={"b"} id={`inline-radio-6`} onClick={() => {that.setState({momentum: "last3", chart: "pie"});}} />
        <Form.Check inline className="small hideInJh" checked={that.state.momentum==="last7" } label="Momentum last 7 days" type={"radio"} name={"b"} id={`inline-radio-7`} onClick={() => {that.setState({momentum: "last7", chart: "pie"});}} />
      </div>
      {
        that.state.jhmode &&
        <style dangerouslySetInnerHTML={{__html: `
          .container-fluid { background: #000914 }
          .hideInJh {
            display: none !important;
          }
          .lightInJh {
            color: #eee;
          }
          * {
            border-radius: 0 !important;
          }
          .info, .controls, .controls2 {
            border: 1px solid #444;
            background: #222;
            color: white;
          }
        `}} />
      }
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
                      this.state.setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                    }}
                    onMouseLeave={() => {
                      this.state.setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: that.state.jhmode ? "#333" : "#ddd" ,
                        outline: "none"
                      },
                      hover: {
                        fill: that.state.jhmode ? "#666" : "#999",
                        outline: "none"
                      },
                      pressed: {
                        fill: that.state.jhmode ? "#333" : "#ddd",
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
                let size;
                let val;
                if(name.indexOf("Hubei") !== -1) {
                  console.log("hubei");
                }
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
                };
                let pos = size >= 0;
                size = Math.abs(size);
                return (<Marker coordinates={coordinates}>
                  <circle r={Math.sqrt(size) * that.state.factor} fill={pos ? "#F008" : "#0F08"} />
                  <title>{`${name} - ${Math.abs(val)} ${pos ? "INCREASE" : "DECREASE"} in active(= confirmed-recovered) cases (excl. deceased)`}</title>
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
            that.state.momentum==="none" &&
            confirmed.map(({ rowId, name, coordinates, markerOffset, size, val }) => {
              let active = val - recoveredAbsByRowId[rowId] - deathsAbsByRowId [rowId];
              if(that.state.jhmode) {
                size = Math.log(size * 100000) / 25;
              }
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              return (<Marker coordinates={coordinates}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: "#F00"}} : {display: "none", hover: {fill: "#F00"}}} x={- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={size * that.state.factor} fill="#F008" />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: "#F00"}} : {display: "none", hover: {fill: "#F00"}}} x={that.state.width * 3 * 0 - that.state.width * 3 * 1.5} y={-size * that.state.factor} width={that.state.width * 3} height={size * that.state.factor} fill="#F008" />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: "#F00"}} : {display: "none", hover: {fill: "#F00"}}} r={Math.sqrt(size) * that.state.factor} fill="#F008" />
                <title>{`${name} - ${val} confirmed, ${active} active`}</title>
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
            that.state.momentum==="none" && !that.state.jhmode &&
            recovered.map(({rowId, name, coordinates, markerOffset, size, val }) => {
              if(that.state.jhmode) {
                size = Math.log(size * 100000) / 25;
              }
              if(that.state.chart==="pie" || that.state.chart==="pill") {
                size += deathsByRowId[rowId];
              }
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              return (<Marker coordinates={coordinates}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: "#0F0"}} : {display: "none", hover: {fill: "#0F0"}}} x={- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={size * that.state.factor} fill="#0F08" />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: "#0F0"}} : {display: "none", hover: {fill: "#0F0"}}} x={that.state.width * 3 * 1 - that.state.width * 3 * 1.5} y={-size * that.state.factor} width={that.state.width * 3} height={size * that.state.factor} fill="#0F08" />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: "#0F0"}} : {display: "none", hover: {fill: "#0F0"}}} r={Math.sqrt(size) * that.state.factor} fill="#0F08" />
                <title>{name + " - " + val + " recovered"}</title>
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{ fontSize: "1px", fontFamily: "system-ui", fill: "#5D5A6D", pointerEvents: "none" }}
                >
                  {/*name*/}
                </text>
              </Marker>
            )})
          }
          {
            that.state.momentum==="none" && !that.state.jhmode &&
            deaths.map(({name, coordinates, markerOffset, size, val }) => {
              if(that.state.jhmode) {
                size = Math.log(size * 100000) / 25;
              }
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              return (<Marker coordinates={coordinates}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: "#000"}} : {display: "none", hover: {fill: "#000"}}} x={- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={size * that.state.factor} fill="#000" />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: "#000"}} : {display: "none", hover: {fill: "#000"}}} x={that.state.width * 3 * 2 - that.state.width * 3 * 1.5} y={-size * that.state.factor} width={that.state.width * 3} height={size * that.state.factor} fill="#000" />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: "#000"}} : {display: "none", hover: {fill: "#2128"}}} r={Math.sqrt(size) * that.state.factor} fill="#2128" />
                <title>{name + " - " + val + " deceased"}</title>
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{ fontSize: "1px", fontFamily: "system-ui", fill: "#5D5A6D33", pointerEvents: "none" }}
                >
                  {/*name*/}
                </text>
              </Marker>
            )})
          }
        </ZoomableGroup>
      </ComposableMap>
    </>
    );
  }
}

export default memo(MapChart);
