# COVID19 Map

## About

Hi, I'm Daniel Karl 👋

I wanted to see whether I can reproduce the Johns Hopkins map visualization of COVID19. Therefore I set out to build my own version using the very same live data source that they kindly provide in their GitHub repo.

Thanks to the already available data set the process of ramping up a visualization tool in React went fairly smooth. So, after the timespan of a weekend it already has the following features:

- offers alternative glyphs (circles can be hard to compare in the human eye)
- can show the momentum of the spread in glyphs directly, i.e. change over the last 1, 3 or 7 days
- can additionally normalize by population (kindly contributed by Michael Baentsch)
- is open source, therefore allows other researchers to contribute on GitHub

Please check it out, and hopefully it helps to drive more research and to provide a better understanding of the situation we are currently facing. 
If you want to contribute a feature I will roll out your pull request timely and add your name here.

## Users
Open https://daniel-karl.github.io/covid19-map/

## Developers
### Install and run
```
npm install         # first time only
npm start
```

### Deploy to GitHub pages
```
npm run deploy      # Please do not forget to include link to license and mention the original author(s) as given below
```

# Contributors
- Daniel Karl
- Michael Baentsch

### Attributions
- [React Simple Maps (MIT license)](https://github.com/zcreativelabs/react-simple-maps/blob/master/LICENSE)
- [Johns Hopkins COVID-19 data set](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series)
- Testing rates
  - [Countries](https://en.wikipedia.org/wiki/COVID-19_testing)
  - [US States](https://docs.google.com/spreadsheets/u/2/d/e/2PACX-1vRwAqp96T9sYYq2-i7Tj0pvTf6XVHjDSMIKBdZHXiCGGdNC0ypEU9NbngS8mxea55JuCFuua1MUeOj5/pubhtml)
- Population data:
  - [US States](https://www.census.gov/newsroom/press-kits/2019/national-state-estimates.html)
  - [Countries](https://population.un.org/wpp/Download/Files/1_Indicators%20(Standard)/CSV_FILES/WPP2019_TotalPopulationBySex.csv)
  - [China](https://www.worldatlas.com/articles/chinese-provinces-by-population.html)
  - [Australia](https://en.wikipedia.org/wiki/States_and_territories_of_Australia)
  - [Diamond Princess](https://www.nytimes.com/2020/03/08/world/asia/coronavirus-cruise-ship.html)

