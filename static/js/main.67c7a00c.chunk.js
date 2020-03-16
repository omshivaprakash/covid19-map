(this["webpackJsonpcovid19-map"]=this["webpackJsonpcovid19-map"]||[]).push([[0],{32:function(e,t,a){e.exports=a(51)},37:function(e,t,a){},51:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(9),s=a.n(r),o=(a(37),a(38),a(39),a(8)),i=a(21),c=a(22),m=a(30),d=a(23),h=a(31),u=a(7),f=a(12),p=a.n(f),v=a(6),y=a(24),b=a.n(y),E={},k={},g={},w=[],C=[],S=[],M=0,x=0,_=0,N=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(m.a)(this,Object(d.a)(t).call(this,e))).state={setTooltipContent:e.setTooltipContent,setTotConf:e.setTotConf,setTotRec:e.setTotRec,setTotDead:e.setTotDead,chart:"pie",factor:20,width:2,jhmode:!1,momentum:"none"},a}return Object(h.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;p.a.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv",{download:!0,complete:function(t){e.confirmed=[];var a=!0,n=67786,l=0,r=!0,s=!1,o=void 0;try{for(var i,c=t.data[Symbol.iterator]();!(r=(i=c.next()).done);r=!0){var m=i.value;if(a)a=!1;else{for(var d="",h="",u="",f="",p=m.length-1;""===d&&p>0;)d=m[p],h=m[p-1],u=m[p-3],f=m[p-7],p-=1;""===d&&(d=0),""===h&&(h=0),""===u&&(u=0),""===f&&(f=0),d=Number(d),h=Number(h),u=Number(u),f=Number(f),d>n&&(n=d);var v={markerOffset:0,name:(m[0]?m[0]+", "+m[1]:m[1])?m[0]?m[0]+", "+m[1]:m[1]:"",coordinates:[m[3],m[2]],size:d,sizeMin1:h,sizeMin3:u,sizeMin7:f,val:d,rowId:l,valMin1:d-h,valMin3:d-u,valMin7:d-f};M+=d,w.push(v),l++}}}catch(b){s=!0,o=b}finally{try{r||null==c.return||c.return()}finally{if(s)throw o}}e.state.setTotConf(M),console.log(n);for(var y=0;y<w.length;y++)w[y].size=(w[y].size-0)/(n-0),w[y].momentumLast1=w[y].size-(w[y].sizeMin1-0)/(n-0),w[y].momentumLast3=w[y].size-(w[y].sizeMin3-0)/(n-0),w[y].momentumLast7=w[y].size-(w[y].sizeMin7-0)/(n-0);e.setState({})}}),p.a.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv",{download:!0,complete:function(t){e.recovered=[];var a=!0,n=67786,l=0,r=!0,s=!1,o=void 0;try{for(var i,c=t.data[Symbol.iterator]();!(r=(i=c.next()).done);r=!0){var m=i.value;if(a)a=!1;else{for(var d="",h=m.length-1;""===d&&h>0;)d=m[h],h-=1;""===d&&(d=0),(d=Number(d))>n&&(n=d);var u={markerOffset:0,name:m[0]?m[0]+", "+m[1]:m[1],coordinates:[m[3],m[2]],size:d,val:d,rowId:l};x+=d,C.push(u),l++}}}catch(p){s=!0,o=p}finally{try{r||null==c.return||c.return()}finally{if(s)throw o}}e.state.setTotRec(x);for(var f=0;f<C.length;f++)k[C[f].rowId]=C[f].size,C[f].size=(C[f].size-0)/(n-0);e.setState({})}}),p.a.parse("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv",{download:!0,complete:function(t){e.deaths=[];var a=!0,n=67786,l=0,r=!0,s=!1,o=void 0;try{for(var i,c=t.data[Symbol.iterator]();!(r=(i=c.next()).done);r=!0){var m=i.value;if(a)a=!1;else{for(var d="",h=m.length-1;""===d&&h>0;)d=m[h],h-=1;""===d&&(d=0),(d=Number(d))>n&&(n=d);var u={markerOffset:0,name:m[0]?m[0]+", "+m[1]:m[1],coordinates:[m[3],m[2]],size:d,val:d,rowId:l};_+=d,S.push(u),l++}}}catch(p){s=!0,o=p}finally{try{r||null==c.return||c.return()}finally{if(s)throw o}}e.state.setTotDead(_);for(var f=0;f<S.length;f++)g[S[f].rowId]=S[f].size,S[f].size=(S[f].size-0)/(n-0),E[S[f].rowId]=S[f].size;e.setState({})}})}},{key:"render",value:function(){var e=this,t=this;return l.a.createElement(l.a.Fragment,null,l.a.createElement(v.a,null,l.a.createElement("div",{className:"ml-3 small controls"},l.a.createElement(v.a.Check,{inline:!0,className:"small",checked:"pie"===t.state.chart,label:"Circles",type:"radio",name:"a",id:"inline-radio-1",onClick:function(){t.setState({chart:"pie"})}}),l.a.createElement(v.a.Check,{inline:!0,className:"small hideInJh",checked:"pill"===t.state.chart,label:"Progress",type:"radio",name:"a",id:"inline-radio-3",onClick:function(){t.setState({chart:"pill"})},disabled:"none"!==t.state.momentum}),l.a.createElement(v.a.Check,{inline:!0,className:"small hideInJh",checked:"bar"===t.state.chart,label:"Bars",type:"radio",name:"a",id:"inline-radio-2",onClick:function(){t.setState({chart:"bar"})},disabled:"none"!==t.state.momentum}))),l.a.createElement("div",{className:"small controls2"},l.a.createElement(b.a,{value:this.state.factor,change:function(t){e.setState({factor:t.target.value,width:t.target.value/10})},step:1,max:100,min:1}),l.a.createElement(v.a.Check,{inline:!0,className:"small",checked:t.state.jhmode,label:l.a.createElement("span",{style:{color:"white",background:"black",padding:"0 3px"}},"Johns Hopkins Mode \ud83e\udd14\ud83e\udd37"),type:"checkbox",name:"a",id:"inline-checkbox-2",onClick:function(){t.setState({jhmode:!t.state.jhmode,chart:"pie",factor:20,momentum:"none"})}}),l.a.createElement(v.a.Check,{inline:!0,className:"small hideInJh",checked:"none"===t.state.momentum,label:"Current situation",type:"radio",name:"a",id:"inline-radio-4",onClick:function(){t.setState({momentum:"none"})}}),l.a.createElement(v.a.Check,{inline:!0,className:"small hideInJh",checked:"last1"===t.state.momentum,label:"Confirmed increase last 1 day",type:"radio",name:"b",id:"inline-radio-5",onClick:function(){t.setState({momentum:"last1",chart:"pie"})}}),l.a.createElement(v.a.Check,{inline:!0,className:"small hideInJh",checked:"last3"===t.state.momentum,label:"Confirmed increase last 3 days",type:"radio",name:"b",id:"inline-radio-6",onClick:function(){t.setState({momentum:"last3",chart:"pie"})}}),l.a.createElement(v.a.Check,{inline:!0,className:"small hideInJh",checked:"last7"===t.state.momentum,label:"Confirmed increase last 7 days",type:"radio",name:"b",id:"inline-radio-7",onClick:function(){t.setState({momentum:"last7",chart:"pie"})}})),t.state.jhmode&&l.a.createElement("style",{dangerouslySetInnerHTML:{__html:"\n          .container-fluid { background: #000914 }\n          .hideInJh {\n            display: none !important;\n          }\n          .lightInJh {\n            color: #eee;\n          }\n          * {\n            border-radius: 0 !important;\n          }\n          .info, .controls, .controls2 {\n            border: 1px solid #444;\n            background: #222;\n            color: white;\n          }\n        "}}),l.a.createElement(u.ComposableMap,{projection:"geoMercator",projectionConfig:{scale:200},height:window.innerWidth,width:window.innerHeight-50,style:{width:"100%",height:"100%"}},l.a.createElement(u.ZoomableGroup,{maxZoom:1e3},l.a.createElement(u.Geographies,{geography:"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-10m.json"},(function(a){return a.geographies.map((function(a){return l.a.createElement(u.Geography,{key:a.rsmKey,geography:a,onMouseEnter:function(){var t,n=a.properties,l=n.NAME,r=n.POP_EST;"Antarctica"!==l&&e.state.setTooltipContent("".concat(l," \u2014 ").concat((t=r)>1e9?Math.round(t/1e8)/10+"Bn":t>1e6?Math.round(t/1e5)/10+"M":Math.round(t/100)/10+"K"))},onMouseLeave:function(){e.state.setTooltipContent("")},style:{default:{fill:t.state.jhmode?"#333":"#ddd",outline:"none"},hover:{fill:t.state.jhmode?"#666":"#999",outline:"none"},pressed:{fill:t.state.jhmode?"#333":"#ddd",outline:"none"}}})}))})),"none"!==t.state.momentum&&w.map((function(e){e.rowId;var a,n,r=e.name,s=e.coordinates,o=e.markerOffset,i=e.momentumLast1,c=e.momentumLast3,m=e.momentumLast7,d=e.valMin1,h=e.valMin3,f=e.valMin7;switch(t.state.momentum){case"last1":a=i,n=d;break;case"last3":a=c,n=h;break;case"last7":a=m,n=f}var p=Math.abs(a)>=0;return a=Math.abs(a),l.a.createElement(u.Marker,{coordinates:s},l.a.createElement("circle",{r:Math.sqrt(a)*t.state.factor,fill:p?"#F008":"#0F08"}),l.a.createElement("title",null,"".concat(r," - ").concat(n," ").concat(p?"increase":"decrease"," in confirmed cases")),l.a.createElement("text",{textAnchor:"middle",y:o,style:{fontSize:r.endsWith(", US")?"0.005em":"2px",fontFamily:"Arial",fill:"#5D5A6D33",pointerEvents:"none"}},r))})),"none"===t.state.momentum&&w.map((function(e){var a=e.rowId,n=e.name,r=e.coordinates,s=e.markerOffset,o=e.size,i=e.val,c=i-k[a]-g[a];return t.state.jhmode&&(o=Math.log(1e5*o)/25),"pill"!==t.state.chart&&"bar"!==t.state.chart||(o*=10),l.a.createElement(u.Marker,{coordinates:r},l.a.createElement("rect",{style:"pill"===t.state.chart?{display:"block",hover:{fill:"#F00"}}:{display:"none",hover:{fill:"#F00"}},x:-o*t.state.factor/2,y:-t.state.width/2*3,height:3*t.state.width,width:o*t.state.factor,fill:"#F008"}),l.a.createElement("rect",{style:"bar"===t.state.chart?{display:"block",hover:{fill:"#F00"}}:{display:"none",hover:{fill:"#F00"}},x:3*t.state.width*0-3*t.state.width*1.5,y:-o*t.state.factor,width:3*t.state.width,height:o*t.state.factor,fill:"#F008"}),l.a.createElement("circle",{style:"pie"===t.state.chart?{display:"block",hover:{fill:"#F00"}}:{display:"none",hover:{fill:"#F00"}},r:Math.sqrt(o)*t.state.factor,fill:"#F008"}),l.a.createElement("title",null,"".concat(n," - ").concat(i," confirmed, ").concat(c," active")),l.a.createElement("text",{textAnchor:"middle",y:s,style:{fontSize:n.endsWith(", US")?"0.005em":"2px",fontFamily:"Arial",fill:"#5D5A6D33",pointerEvents:"none"}},n))})),"none"===t.state.momentum&&!t.state.jhmode&&C.map((function(e){var a=e.rowId,n=e.name,r=e.coordinates,s=e.markerOffset,o=e.size,i=e.val;return t.state.jhmode&&(o=Math.log(1e5*o)/25),"pie"!==t.state.chart&&"pill"!==t.state.chart||(o+=E[a]),"pill"!==t.state.chart&&"bar"!==t.state.chart||(o*=10),l.a.createElement(u.Marker,{coordinates:r},l.a.createElement("rect",{style:"pill"===t.state.chart?{display:"block",hover:{fill:"#0F0"}}:{display:"none",hover:{fill:"#0F0"}},x:-o*t.state.factor/2,y:-t.state.width/2*3,height:3*t.state.width,width:o*t.state.factor,fill:"#0F08"}),l.a.createElement("rect",{style:"bar"===t.state.chart?{display:"block",hover:{fill:"#0F0"}}:{display:"none",hover:{fill:"#0F0"}},x:3*t.state.width*1-3*t.state.width*1.5,y:-o*t.state.factor,width:3*t.state.width,height:o*t.state.factor,fill:"#0F08"}),l.a.createElement("circle",{style:"pie"===t.state.chart?{display:"block",hover:{fill:"#0F0"}}:{display:"none",hover:{fill:"#0F0"}},r:Math.sqrt(o)*t.state.factor,fill:"#0F08"}),l.a.createElement("title",null,n+" - "+i+" recovered"),l.a.createElement("text",{textAnchor:"middle",y:s,style:{fontSize:"1px",fontFamily:"system-ui",fill:"#5D5A6D",pointerEvents:"none"}}))})),"none"===t.state.momentum&&!t.state.jhmode&&S.map((function(e){var a=e.name,n=e.coordinates,r=e.markerOffset,s=e.size,o=e.val;return t.state.jhmode&&(s=Math.log(1e5*s)/25),"pill"!==t.state.chart&&"bar"!==t.state.chart||(s*=10),l.a.createElement(u.Marker,{coordinates:n},l.a.createElement("rect",{style:"pill"===t.state.chart?{display:"block",hover:{fill:"#000"}}:{display:"none",hover:{fill:"#000"}},x:-s*t.state.factor/2,y:-t.state.width/2*3,height:3*t.state.width,width:s*t.state.factor,fill:"#000"}),l.a.createElement("rect",{style:"bar"===t.state.chart?{display:"block",hover:{fill:"#000"}}:{display:"none",hover:{fill:"#000"}},x:3*t.state.width*2-3*t.state.width*1.5,y:-s*t.state.factor,width:3*t.state.width,height:s*t.state.factor,fill:"#000"}),l.a.createElement("circle",{style:"pie"===t.state.chart?{display:"block",hover:{fill:"#000"}}:{display:"none",hover:{fill:"#2128"}},r:Math.sqrt(s)*t.state.factor,fill:"#2128"}),l.a.createElement("title",null,a+" - "+o+" deceased"),l.a.createElement("text",{textAnchor:"middle",y:r,style:{fontSize:"1px",fontFamily:"system-ui",fill:"#5D5A6D33",pointerEvents:"none"}}))})))))}}]),t}(l.a.Component),j=Object(n.memo)(N),I=a(26),z=a(28),O=a(29),D=a(10),F=a(18),T=a(13),J=a(17),A=a(27),L=new Date,G=function(e){return e>1e9?Math.round(e/1e8)/10+"Bn":e>1e6?Math.round(e/1e5)/10+"M":Math.round(e/100)/10+"K"};var R=function(){var e=Object(n.useState)(""),t=Object(o.a)(e,2),a=t[0],r=t[1],s=Object(n.useState)(!1),i=Object(o.a)(s,2),c=i[0],m=i[1],d=Object(n.useState)(0),h=Object(o.a)(d,2),u=h[0],f=h[1],p=Object(n.useState)(0),v=Object(o.a)(p,2),y=v[0],b=v[1],E=Object(n.useState)(0),k=Object(o.a)(E,2),g=k[0],w=k[1];return[l.a.createElement(F.a,{bg:"light",fixed:"top",className:"p-0 pl-2",expand:"xs"},l.a.createElement(F.a.Brand,null,l.a.createElement("span",{className:"small"},"C",l.a.createElement(T.a,{icon:A.a}),"VID19 ")),l.a.createElement("span",null,l.a.createElement("span",{className:"small text-muted mr-3"},"Total:"),l.a.createElement("span",{className:"small text-danger mr-3"},G(u)),l.a.createElement("span",{className:"small text-success mr-3"},G(y)),l.a.createElement("span",{className:"small mr-3"},G(g)))),l.a.createElement(z.a,{fluid:!0,className:"w-100 h-100 p-0"},l.a.createElement(O.a,{noGutters:"true",className:"h-100"},l.a.createElement(D.a,{className:"h-100"},l.a.createElement(j,{setTooltipContent:r,style:{marginTop:"50px"},setTotConf:f,setTotRec:b,setTotDead:w}),l.a.createElement(I.a,null,a)))),l.a.createElement("div",{className:"info small text-muted",style:c?{display:"none"}:{display:"block"},onClick:function(){m(!0)}},l.a.createElement("span",{className:"text-danger"},"Red: confirmed"),l.a.createElement("br",null),l.a.createElement("span",{className:"text-success hideInJh"},"Green: recovered"),l.a.createElement("br",{className:"hideInJh"}),l.a.createElement("span",{className:"text-dark hideInJh"},"Black: deceased"),l.a.createElement("br",{className:"hideInJh"}),l.a.createElement("sub",{className:"lightInJh"},"Using live data from ",l.a.createElement("br",null),l.a.createElement("a",{target:"_blank",href:"https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series"},l.a.createElement(T.a,{icon:J.b})," Johns Hopkins repository"),l.a.createElement("br",null),"Last synchronized on ",L.toLocaleDateString()," at ",L.toLocaleTimeString(),l.a.createElement("br",null),l.a.createElement("a",{target:"_blank",href:"https://github.com/daniel-karl/covid19-map"},l.a.createElement(T.a,{icon:J.a})," Who made this?")),l.a.createElement("br",null),l.a.createElement("span",{className:"small text-danger"},"Hold <CTRL> key to zoom"))]};s.a.render(l.a.createElement(R,null),document.getElementById("root"))}},[[32,1,2]]]);
//# sourceMappingURL=main.67c7a00c.chunk.js.map