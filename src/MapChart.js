import React, { memo} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

import Papa from "papaparse";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-10m.json";

const markers = [];

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
      setTooltipContent: props.setTooltipContent
    }
  }

  componentDidMount() {
    let that = this;
    Papa.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv", {
      download: true,
      complete: function(results) {
        that.markers = [];
        let skipRow = true;
        let minSize = 0;
        let maxSize = 0;
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
            size: size
          };
          markers.push(marker)
        }

        for(let i = 0; i < markers.length; i++) {
          // console.log(markers[i].size + ", " + minSize + ", " + maxSize);
          markers[i].size = Math.sqrt(markers[i].size - minSize) / Math.sqrt(maxSize - minSize);
        }
        that.setState({});
      }
    });
  }

  render() {
    return (
      <>
      <ComposableMap
          projection={"geoMercator"}
          height={window.innerWidth}
          width={window.innerHeight - 50}
          style={{width: "100%", height: "100%"}}
      >
        <ZoomableGroup zoom={1} maxZoom={1000}>
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
                        fill: "#ddd",
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
            markers.map(({ name, coordinates, markerOffset, size }) => (
              <Marker coordinates={coordinates}>
                <circle r={size * 10} fill="#F008" style={{hover: {fill: "#F00"}}} />
                <title>{name}</title>
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{ fontSize: "2px", fontFamily: "system-ui", fill: "#5D5A6D" }}
                >
                  {/*name*/}
                </text>
              </Marker>
            ))
          }
        </ZoomableGroup>
      </ComposableMap>
    </>
    );
  }
}

export default memo(MapChart);
