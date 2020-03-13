import React, { memo} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const markers = [
  { markerOffset: -15, name: "Buenos Aires", coordinates: [-58.3816, -34.6037] },
  { markerOffset: -15, name: "La Paz", coordinates: [-68.1193, -16.4897] },
  { markerOffset: 25, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
  { markerOffset: 25, name: "Santiago", coordinates: [-70.6693, -33.4489] },
  { markerOffset: 25, name: "Bogota", coordinates: [-74.0721, 4.711] },
  { markerOffset: 25, name: "Quito", coordinates: [-78.4678, -0.1807] },
  { markerOffset: -15, name: "Georgetown", coordinates: [-58.1551, 6.8013] },
  { markerOffset: -15, name: "Asuncion", coordinates: [-57.5759, -25.2637] },
  { markerOffset: 25, name: "Paramaribo", coordinates: [-55.2038, 5.852] },
  { markerOffset: 25, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
  { markerOffset: -15, name: "Caracas", coordinates: [-66.9036, 10.4806] },
  { markerOffset: -15, name: "Lima", coordinates: [-77.0428, -12.0464] }
];

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = ({setTooltipContent}) => {
  return (
    <ComposableMap projection={"geoMercator"}>
        <ZoomableGroup zoom={1}>
      <Geographies geography={geoUrl}>
        {
          ({geographies}) =>
              geographies.map(geo => (
                  <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        const {NAME, POP_EST} = geo.properties;
                        setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none"
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                  />
              ))
        }
      </Geographies>
        </ZoomableGroup>
      {
        markers.map(({name, coordinates, markerOffset}) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2}/>
              <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{fontFamily: "system-ui", fill: "#5D5A6D"}}
              >
                {name}
              </text>
            </Marker>
        ))
      }
    </ComposableMap>
  );
};

export default memo(MapChart);
