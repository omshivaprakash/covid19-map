(this["webpackJsonpcovid19-map"]=this["webpackJsonpcovid19-map"]||[]).push([[0],{34:function(e,t,a){e.exports=a(50)},39:function(e,t,a){},50:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(12),c=a.n(r),s=(a(39),a(40),a(31)),i=a(22),l=a(23),m=a(32),u=a(24),p=a(33),d=a(10),h=a(25),E=a.n(h),b=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(m.a)(this,Object(u.a)(t).call(this,e))).state={setTooltipContent:e.setTooltipContent},a}return Object(p.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){E.a.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv",{download:!0,complete:function(e){alert("Loaded information about "+e.data.length+" countries or regions.")}})}},{key:"render",value:function(){var e=this;return o.a.createElement(d.ComposableMap,{projection:"geoMercator",height:window.innerWidth,width:window.innerHeight-50,style:{width:"100%",height:"100%"}},o.a.createElement(d.ZoomableGroup,{zoom:1},o.a.createElement(d.Geographies,{geography:"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-10m.json"},(function(t){return t.geographies.map((function(t){return o.a.createElement(d.Geography,{key:t.rsmKey,geography:t,onMouseEnter:function(){var a,n=t.properties,o=n.NAME,r=n.POP_EST;e.state.setTooltipContent("".concat(o," \u2014 ").concat((a=r)>1e9?Math.round(a/1e8)/10+"Bn":a>1e6?Math.round(a/1e5)/10+"M":Math.round(a/100)/10+"K"))},onMouseLeave:function(){e.state.setTooltipContent("")},style:{default:{fill:"#D6D6DA",outline:"none"},hover:{fill:"#F53",outline:"none"},pressed:{fill:"#E42",outline:"none"}}})}))}))))}}]),t}(o.a.Component),g=Object(n.memo)(b),v=a(26),f=a(28),_=a(29),C=a(30),w=a(11),O=a(17),j=a(15),y=a(16);var D=function(){var e=Object(n.useState)(""),t=Object(s.a)(e,2),a=t[0],r=t[1];return[o.a.createElement(w.a,{bg:"light",fixed:"top",className:"p-0 pl-2",expand:"lg"},o.a.createElement(w.a.Brand,null,o.a.createElement(j.a,{icon:y.c}),o.a.createElement("span",{className:"small"}," COVID19 ")),o.a.createElement(w.a.Toggle,{"aria-controls":"basic-navbar-nav",className:"border-0 "}),o.a.createElement(w.a.Collapse,{id:"basic-navbar-nav"},o.a.createElement(O.a,{className:"mr-auto"},o.a.createElement(O.a.Link,{className:"small",href:"https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series"},o.a.createElement(j.a,{icon:y.b})," Data source"),o.a.createElement(O.a.Link,{className:"small",href:"https://github.com/daniel-karl/covid19-map"},o.a.createElement(j.a,{icon:y.a})," Source code")))),o.a.createElement(f.a,{fluid:!0,className:"w-100 h-100 p-0"},o.a.createElement(_.a,{noGutters:"true",className:"h-100"},o.a.createElement(C.a,{className:"h-100"},o.a.createElement(g,{setTooltipContent:r,style:{marginTop:"50px"}}),o.a.createElement(v.a,null,a))))]};c.a.render(o.a.createElement(D,null),document.getElementById("root"))}},[[34,1,2]]]);
//# sourceMappingURL=main.bd60c048.chunk.js.map