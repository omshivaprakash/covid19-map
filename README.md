# COVID19 Map

## About

Hi, I'm Daniel Karl 👋

I wanted to know whether Johns Hopkins' map of COVID19 is accurate. 
Therefore I set out to build my own map using the very same live data source,
however, with

- linear normalization of data,
- mapping the numbers to marker area rather than radius (to avoid data is perceived quadratically skewed), and
- no increase/decrease of marker size when zooming in/out.

When comparing this to the John Hopkins map visualization the data
appears quite a bit less threatening.

Please, feel free to contribute to this open source code to make this visualization more feature-rich.
 

## Users
Open https://daniel-karl.github.io/covid19-map/

## Developers
### Install and run
```
npm install         # first time only
npm start
```
