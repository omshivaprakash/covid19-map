# COVID19 Map

## About

Hi, I'm Daniel Karl 👋

I wanted to know whether Johns Hopkins' map of COVID19 is accurate. 
Therefore I set out to build my own map using the very same live data source,
however, with

- linear normalization of data,
- mapping the numbers to marker area rather than radius (to avoid data is perceived quadratically skewed), and
- no increase/decrease of marker size when zooming in/out.

When mapping the data carefully "as is" it appears to be quite different from the view offered by the Johns Hopkins map visualization. Johns Hopkins should disclose what exactly they show in their approach. It could be a logarithmically scaled version of the data, which I believe is not very easy to interpret for the untrained observer.

I additionally show the momentum of the last 1, 3 or 7 days to display which countries are successfully recovering more compared to accumulating more confirmed infections.

Please, feel free to contribute to this open source code to make this visualization more feature-rich.
 

## Users
Open https://daniel-karl.github.io/covid19-map/

## Developers
### Install and run
```
npm install         # first time only
npm start
```
