import React, {memo, useState} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

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

let testing = {

  // https://en.wikipedia.org/wiki/COVID-19_testing
  "Spain": 30000,

  // world in data
  "Armenia": 813,
  "Australia": 1391,
  "Australia - New South Wales": 30244,
  "Austria": 15613,
  "Bahrain": 17022,
  "Belarus": 19000,
  "Belgium": 18360,
  "Brazil": 2927,
  "Canada": 38482,
  "Alberta, Canada": 16857,
  "British Columbia, Canada": 6326,
  "National lab, Canada": 1008,
  "New Brunswick, Canada": 204,
  "Northwest Territories, Canada": 143,
  "Nova Scotia, Canada": 941,
  "Ontario, Canada": 16650,
  "Quebec, Canada": 6452,
  "Saskatchewan, Canada": 796,
  "China - Guangdong": 320000,
  "Colombia": 3656,
  "Croatia": 724,
  "Czechia": 11619,
  "Denmark": 12043,
  "Ecuador": 1153,
  "Estonia": 2504,
  "Finland": 3000,
  "France, France": 36747,
  "Germany": 167000,
  "Grenada": 18,
  "Hong Kong": 5271,
  "Hungary": 1470,
  "Iceland": 2278,
  "India": 6636,
  "Indonesia": 1939,
  "Ireland": 1784,
  "Israel": 10864,
  "Italy": 182777,
  "Japan": 18844,
  "Kuwait": 120000,
  "Kazakhstan": 5093,
  "Kyrgyzstan": 1545,
  "Latvia": 2677,
  "Lithuania": 624,
  "Malaysia": 13876,
  "Malta": 889,
  "Mexico": 278,
  "Netherlands, Netherlands": 6000,
  "New Zealand": 522,
  "Norway": 34583,
  "Pakistan": 531,
  "Palestine": 2519,
  "Panama": 1455,
  "Peru": 3841,
  "Philippines": 1267,
  "Poland": 13072,
  "Romania": 8284,
  "Russia": 122854,
  "Slovakia": 2439,
  "Slovenia": 9860,
  "South Africa": 4832,
  "South Korea": 316664,
  "Sweden": 14300,
  "Switzerland": 4000,
  "Taiwan": 21396,
  "Thailand": 8777,
  "Turkey": 2900,
  "Ukraine": 316,
  "United Arab Emirates": 125000,
  "United Kingdom": 44872,
  "United States": 44872,
  "Vietnam": 15009,

  // https://docs.google.com/spreadsheets/u/2/d/e/2PACX-1vRwAqp96T9sYYq2-i7Tj0pvTf6XVHjDSMIKBdZHXiCGGdNC0ypEU9NbngS8mxea55JuCFuua1MUeOj5/pubhtml#
  "Alaska, US":	        513,
  "Alabama, US":        106,
  "Arkansas, US":       559,
  "Arizona, US":        352,
  "California, US":     9845,
  "Colorado, US":       2952,
  "Connecticut, US":    763,
  "DC":                 573,              /* unkown */
  "Delaware, US":       66,
  "Florida, US":        3254,
  "Georgia, US":        1831,
  "Hawaii, US":         159,
  "Iowa, US":           686,
  "Idaho, US":          613,
  "Illinois, US":       3151,
  "Indiana, US":        380,
  "Kansas, US":         451,
  "Kentucky, US":       639,
  "Louisiana, US":      899,
  "Massachusetts, US":  3132,
  "Maryland, US":       201,
  "Maine, US":          2057,
  "Michigan, US":       2447,
  "Minnesota, US":      3038,
  "Missouri, US":       397,
  "MP": 0,               /* unkown */
  "Mississippi, US":    602,
  "Montana, US":        946,
  "North Carolina, US": 2505,
  "North Dakota, US":   673,
  "Nebraska, US":       272,
  "New Hampshire, US":  1420,
  "New Jersey, US":     1070,
  "New Mexico, US":     2797,
  "Nevada, US":         1721,
  "New York, US":       2284,
  "Ohio, US":           259,
  "Oklahoma, US":       760,
  "Oregon, US":         1854,
  "Pennsylvania, US":   1793,
  "Rhode Island, US":   907,
  "South Carolina, US": 914,
  "South Dakota, US":   947,
  "Tennessee, US":      618,
  "Texas, US":          2335,
  "Utah, US":           1526,
  "Virginia, US":       1923,
  "Vermont, US":        689,
  "Washington, US":     20712,
  "Wisconsin, US":      2347,
  "West Virginia, US":  237,
  "Wyoming, US":        289,

  "Guam": 81,
  "Puerto Rico": 90,
  "Virgin Islands": 3
};


// Population counts extracted from the following sources:
// US States: from https://www.census.gov/newsroom/press-kits/2019/national-state-estimates.html:
// Countries: from https://population.un.org/wpp/Download/Files/1_Indicators%20(Standard)/CSV_FILES/WPP2019_TotalPopulationBySex.csv
// China: from https://www.worldatlas.com/articles/chinese-provinces-by-population.html
// Australia: from https://en.wikipedia.org/wiki/States_and_territories_of_Australia
// Diamond Princess: https://www.nytimes.com/2020/03/08/world/asia/coronavirus-cruise-ship.html
let population = {
  "Alabama, US": 4903185,
  "Alaska, US": 731545,
  "Arizona, US": 7278717,
  "Arkansas, US": 3017804,
  "California, US": 39512223,
  "Colorado, US": 5758736,
  "Connecticut, US": 3565287,
  "Delaware, US": 973764,
  "District of Columbia, US": 705749,
  "Florida, US": 21477737,
  "Georgia, US": 10617423,
  "Hawaii, US": 1415872,
  "Idaho, US": 1787065,
  "Illinois, US": 12671821,
  "Indiana, US": 6732219,
  "Iowa, US": 3155070,
  "Kansas, US": 2913314,
  "Kentucky, US": 4467673,
  "Louisiana, US": 4648794,
  "Maine, US": 1344212,
  "Maryland, US": 6045680,
  "Massachusetts, US": 6892503,
  "Michigan, US": 9986857,
  "Minnesota, US": 5639632,
  "Mississippi, US": 2976149,
  "Missouri, US": 6137428,
  "Montana, US": 1068778,
  "Nebraska, US": 1934408,
  "Nevada, US": 3080156,
  "New Hampshire, US": 1359711,
  "New Jersey, US": 8882190,
  "New Mexico, US": 2096829,
  "New York, US": 19453561,
  "North Carolina, US": 10488084,
  "North Dakota, US": 762062,
  "Ohio, US": 11689100,
  "Oklahoma, US": 3956971,
  "Oregon, US": 4217737,
  "Pennsylvania, US": 12801989,
  "Rhode Island, US": 1059361,
  "South Carolina, US": 5148714,
  "South Dakota, US": 884659,
  "Tennessee, US": 6829174,
  "Texas, US": 28995881,
  "Utah, US": 3205958,
  "Vermont, US": 623989,
  "Virginia, US": 8535519,
  "Washington, US": 7614893,
  "West Virginia, US": 1792147,
  "Wisconsin, US": 5822434,
  "Wyoming, US": 578759,
  "Afghanistan": 38928341,
  "Africa": 1340598113,
  "African Group": 1338826591,
  "African Union": 1339423921,
  "African Union: Central Africa": 158619638,
  "African Union: Eastern Africa": 392563672,
  "African Union: Northern Africa": 207032899,
  "African Union: Southern Africa": 184002188,
  "African Union: Western Africa": 397205524,
  "African, Caribbean and Pacific (ACP) Group of States": 1179679906,
  "Albania": 2877800,
  "Algeria": 43851043,
  "American Samoa": 55197,
  "Andean Community": 113170819,
  "Andorra": 77265,
  "Angola": 32866267.999999996,
  "Anguilla": 15002,
  "Antigua and Barbuda": 97928,
  "Argentina": 45195777,
  "Armenia": 2963234,
  "Aruba": 106766,
  "Asia": 4641054786,
  "Asia-Pacific Economic Cooperation (APEC)": 2972249482,
  "Asia-Pacific Group": 4621682230,
  "Association of Southeast Asian Nations (ASEAN)": 667301412,
  "Australia": 25499881,
  "Australia/New Zealand": 30322114,
  "Austria": 9006400,
  "Azerbaijan": 10139175,
  "BRIC": 3177822028,
  "BRICS": 3237130718,
  "The Bahamas": 393248,
  "Bahrain": 1701583,
  "Bangladesh": 164689383,
  "Barbados": 287371,
  "Belarus": 9449321,
  "Belgium": 11589616,
  "Belize": 397621,
  "Belt-Road Initiative (BRI)": 3403061795,
  "Belt-Road Initiative: Africa": 1192659576,
  "Belt-Road Initiative: Asia": 1572525725,
  "Belt-Road Initiative: Europe": 413895375,
  "Belt-Road Initiative: Latin America and the Caribbean": 208569955,
  "Belt-Road Initiative: Pacific": 15411164,
  "Benin": 12123198,
  "Bermuda": 62273,
  "Bhutan": 771612,
  "Black Sea Economic Cooperation (BSEC)": 343357186,
  "Bolivarian Alliance for the Americas (ALBA)": 58690348,
  "Bolivia": 11673029,
  "Bonaire, Sint Eustatius and Saba": 26221,
  "Bosnia and Herzegovina": 3280815,
  "Botswana": 2351625,
  "Brazil": 212559409,
  "British Virgin Islands": 30237,
  "Brunei Darussalam": 437483,
  "Bulgaria": 6948445,
  "Burkina Faso": 20903278,
  "Burundi": 11890781,
  "Cabo Verde": 555988,
  "Cambodia": 16718971.000000002,
  "Cameroon": 26545864,
  "Canada": 37742157,
  "Caribbean": 43532374,
  "Caribbean Community and Common Market (CARICOM)": 18849823,
  "Cayman Islands": 65720,
  "Central African Republic": 4829764,
  "Central America": 179670186,
  "Central Asia": 74338926,
  "Central European Free Trade Agreement (CEFTA)": 25746658,
  "Central and Southern Asia": 2014708531,
  "Chad": 16425859,
  "Channel Islands": 173859,
  "Chile": 19116209,
  "China": 1439323774,
  "China (and dependencies)": 1471286879,
  "China, Hong Kong SAR": 7496988,
  "China, Macao SAR": 649342,
  "China, Taiwan Province of China": 23816775,
  "Colombia": 50882884,
  "Commonwealth of Independent States (CIS)": 290592838,
  "Commonwealth of Nations": 2565385550,
  "Commonwealth: Africa": 583993867,
  "Commonwealth: Asia": 1825653173,
  "Commonwealth: Caribbean and Americas": 44597814,
  "Commonwealth: Europe": 69534904,
  "Commonwealth: Pacific": 41605792,
  "Comoros": 869595,
  "Congo": 5518092,
  "Cook Islands": 17564,
  "Costa Rica": 5094114,
  "Countries with Access to the Sea": 7199203331,
  "Countries with Access to the Sea: Africa": 999209561,
  "Countries with Access to the Sea: Asia": 4474222842,
  "Countries with Access to the Sea: Europe": 679066702,
  "Countries with Access to the Sea: Latin America and the Caribbean": 635156773,
  "Countries with Access to the Sea: Northern America": 368869644,
  "Countries with Access to the Sea: Oceania": 42677809,
  "Croatia": 4105268,
  "Cuba": 11326616,
  "Curaçao": 164100,
  "Cyprus": 1207361,
  "Czechia": 10708982,
  "Côte d'Ivoire": 26378275,
  "Dem. People's Republic of Korea": 25778815,
  "Democratic Republic of the Congo": 89561404,
  "Denmark, Denmark": 5792203,
  "Denmark (and dependencies)": 5897840,
  "Djibouti": 988002,
  "Dominica": 71991,
  "Dominican Republic": 10847904,
  "ECE: North America-2": 368744804,
  "ECE: UNECE-52": 1301482488,
  "ECLAC: Latin America": 641934032,
  "ECLAC: The Caribbean": 12024817,
  "ESCAP region: East and North-East Asia": 1654272852,
  "ESCAP region: North and Central Asia": 237364970,
  "ESCAP region: Pacific": 42665213,
  "ESCAP region: South and South-West Asia": 2024708672,
  "ESCAP region: South-East Asia": 668619854,
  "ESCAP: ADB Developing member countries (DMCs)": 4064234805,
  "ESCAP: ADB Group A (Concessional assistance only)": 165457879,
  "ESCAP: ADB Group B (OCR blend)": 1812617151,
  "ESCAP: ADB Group C (Regular OCR only)": 2086159775,
  "ESCAP: ASEAN": 667301412,
  "ESCAP: Central Asia": 91430510,
  "ESCAP: ECO": 512630793,
  "ESCAP: HDI groups": 4627631561,
  "ESCAP: Landlocked countries (LLDCs)": 166831944,
  "ESCAP: Least Developed Countries (LDCs)": 314374173,
  "ESCAP: Pacific island dev. econ.": 12343099,
  "ESCAP: SAARC": 1856376652,
  "ESCAP: WB High income econ.": 223305480,
  "ESCAP: WB Low income econ.": 93843964,
  "ESCAP: WB Lower middle income econ.": 2414189200,
  "ESCAP: WB Upper middle income econ.": 1896273735,
  "ESCAP: WB income groups": 4627612379,
  "ESCAP: high HDI": 222728251,
  "ESCAP: high income": 222956185,
  "ESCAP: income groups": 4627631561,
  "ESCAP: low HDI": 1933858787,
  "ESCAP: low income": 2096735108,
  "ESCAP: lower middle HDI": 2069715776,
  "ESCAP: lower middle income": 586217954,
  "ESCAP: other Asia-Pacific countries/areas": 200828133,
  "ESCAP: upper middle HDI": 401328747,
  "ESCAP: upper middle income": 1721722314,
  "ESCWA: Arab countries": 436378875,
  "ESCWA: Arab least developed countries": 96075713,
  "ESCWA: Gulf Cooperation Council countries": 58664095,
  "ESCWA: Maghreb countries": 99451506,
  "ESCWA: Mashreq countries": 182187561,
  "ESCWA: member countries": 374777016,
  "East African Community (EAC)": 195283232,
  "Eastern Africa": 445405578,
  "Eastern Asia": 1678089627,
  "Eastern Europe": 293013210,
  "Eastern European Group": 339831453,
  "Eastern and South-Eastern Asia": 2346709481,
  "Economic Community of Central African States (ECCAS)": 204438115,
  "Economic Community of West African States (ECOWAS)": 397205524,
  "Economic Cooperation Organization (ECO)": 512630793,
  "Ecuador": 17643060,
  "Egypt": 102334403,
  "El Salvador": 6486201,
  "Equatorial Guinea": 1402985,
  "Eritrea": 3546427,
  "Estonia": 1326539,
  "Eswatini": 1160164,
  "Ethiopia": 114963583,
  "Eurasian Economic Community (Eurasec)": 223691520,
  "Europe": 747636045,
  "Europe (48)": 747636045,
  "Europe and Northern America": 1116505689,
  "European Community (EC: 12)": 384860299,
  "European Free Trade Agreement (EFTA)": 14455247,
  "European Union (EU: 15)": 409506687,
  "European Union (EU: 28)": 513136526,
  "Falkland Islands (Malvinas)": 3483,
  "Faroe Islands, Denmark": 48865,
  "Fiji": 896444,
  "Finland": 5540718,
  "France, France": 65273512,
  "France (and dependencies)": 68147687,
  "French Guiana": 298682,
  "French Polynesia": 280904,
  "Gabon": 2225728,
  "Gambia": 2416664,
  "Georgia": 3989175,
  "Germany": 83783945,
  "Ghana": 31072945,
  "Gibraltar": 33691,
  "Greater Arab Free Trade Area (GAFTA)": 413978399,
  "Greece": 10423056,
  "Greenland": 56772,
  "Grenada": 112519,
  "Group of 77 (G77)": 6135279467,
  "Group of Eight (G8)": 918561011,
  "Group of Seven (G7)": 772626551,
  "Group of Twenty (G20) - member states": 4653331418,
  "Guadeloupe, France": 400127,
  "Guam": 168783,
  "Guatemala": 17915567,
  "Guinea": 13132792,
  "Guinea-Bissau": 1967998,
  "Gulf Cooperation Council (GCC)": 58664095,
  "Guyana": 786559,
  "Haiti": 11402533,
  "High-income countries": 1263092934,
  "Holy Sea": 809,
  "Honduras": 9904608,
  "Hungary": 9660350,
  "Iceland": 341250,
  "India": 1380004385,
  "Indonesia": 273523621,
  "Iran": 83992953,
  "Iraq": 40222503,
  "Ireland": 4937796,
  "Isle of Man": 85032,
  "Israel": 8655541,
  "Italy": 60461828,
  "Jamaica": 2961161,
  "Japan": 126476458,
  "Jordan": 10203140,
  "Kazakhstan": 18776707,
  "Kenya": 53771300,
  "Kiribati": 119446,
  "Kuwait": 4270563,
  "Kyrgyzstan": 6524191,
  "LLDC: Africa": 341388552,
  "LLDC: Asia": 166831944,
  "LLDC: Europe": 6117343,
  "LLDC: Latin America": 18805559,
  "Land-locked Countries": 595596207,
  "Land-locked Countries (Others)": 62452809,
  "Land-locked Developing Countries (LLDC)": 533143398.00000006,
  "Lao People's Democratic Republic": 7275556,
  "Latin America and the Caribbean": 653962332,
  "Latin American Integration Association (ALADI)": 573658551,
  "Latin American and Caribbean Group (GRULAC)": 649376323,
  "Latvia": 1886202,
  "League of Arab States (LAS, informal name: Arab League)": 436378875,
  "Least developed countries": 1057438163,
  "Least developed: Africa": 701835489,
  "Least developed: Asia": 343074875,
  "Least developed: Latin America and the Caribbean": 11402533,
  "Least developed: Oceania": 1125266,
  "Lebanon": 6825442,
  "Lesotho": 2142252,
  "Less developed regions": 6521494468,
  "Less developed regions, excluding China": 5050207589,
  "Less developed regions, excluding least developed countries": 5464056305,
  "Less developed: Africa": 1340598113,
  "Less developed: Asia": 4514578328,
  "Less developed: Latin America and the Caribbean": 653962332,
  "Less developed: Oceania": 12355695,
  "Liberia": 5057677,
  "Libya": 6871287,
  "Liechtenstein": 38137,
  "Lithuania": 2722291,
  "Low-income countries": 775710612,
  "Lower-middle-income countries": 3098235284,
  "Luxembourg": 625976,
  "Madagascar": 27691019,
  "Malawi": 19129955,
  "Malaysia": 32365998,
  "Maldives": 540542,
  "Mali": 20250834,
  "Malta": 441539,
  "Marshall Islands": 59194,
  "Martinique": 375265,
  "Mauritania": 4649660,
  "Mauritius": 1271767,
  "Mayotte": 272813,
  "Melanesia": 11122990,
  "Mexico": 128932753,
  "Micronesia": 548927,
  "Micronesia (Fed. States of)": 115021,
  "Middle Africa": 179595125,
  "Middle-income countries": 5753051615,
  "Monaco": 39244,
  "Mongolia": 3278292,
  "Montenegro": 628062,
  "Montserrat": 4999,
  "More developed regions": 1273304261,
  "More developed: Asia": 126476458,
  "More developed: Europe": 747636045,
  "More developed: Northern America": 368869644,
  "More developed: Oceania": 30322114,
  "Morocco": 36910558,
  "Mozambique": 31255435,
  "Myanmar": 54409794,
  "Namibia": 2540916,
  "Nauru": 10834,
  "Nepal": 29136808,
  "Netherlands, Netherlands": 17134873,
  "Netherlands (and dependencies)": 17474842,
  "New Caledonia": 285491,
  "New EU member states (joined since 2004)": 103629839,
  "New Zealand": 4822233,
  "New Zealand (and dependencies)": 4842765,
  "Nicaragua": 6624554,
  "Niger": 24206636,
  "Nigeria": 206139587,
  "Niue": 1618,
  "No income group available": 2943568,
  "Non-Self-Governing Territories": 1753672,
  "North American Free Trade Agreement (NAFTA)": 497677557,
  "North Atlantic Treaty Organization (NATO)": 944255667,
  "North Macedonia": 2083380,
  "Northern Africa": 246232508,
  "Northern Africa and Western Asia": 525869282,
  "Northern America": 368869644,
  "Northern Europe": 106261271,
  "Northern Mariana Islands": 57557,
  "Norway": 5421242,
  "Oceania": 42677809,
  "Oceania (excluding Australia and New Zealand)": 12355695,
  "Oman": 5106622,
  "Organisation for Economic Co-operation and Development (OECD)": 1313469470,
  "Organization for Security and Co-operation in Europe (OSCE)": 1296294632,
  "Organization of American States (OAS)": 1018121127,
  "Organization of Petroleum Exporting countries (OPEC)": 518144279,
  "Organization of the Islamic Conference (OIC)": 1907530488,
  "Pakistan": 220892331,
  "Palau": 18092,
  "Panama": 4314768,
  "Papua New Guinea": 8947027,
  "Paraguay": 7132530,
  "Peru": 32971845.999999996,
  "Philippines": 109581085,
  "Poland": 37846605,
  "Polynesia": 683778,
  "Portugal": 10196707,
  "Puerto Rico": 2860840,
  "Qatar": 2881060,
  "Korea, South": 51269183,
  "Republic of Moldova": 4033963,
  "Romania": 19237682,
  "Russia": 145934460,
  "Rwanda": 12952209,
  "Réunion": 895308,
  "SIDS Atlantic, and Indian Ocean, Mediterranean and South China Sea (AIMS)": 16226846,
  "SIDS Caribbean": 43506153,
  "SIDS Pacific": 12343099,
  "Saint Barthelemy, France": 9885,
  "Saint Helena": 6071,
  "Saint Kitts and Nevis": 53192,
  "Saint Lucia": 183629,
  "Saint Martin, France": 38659,
  "Saint Pierre and Miquelon": 5795,
  "Saint Vincent and the Grenadines": 110947,
  "Samoa": 198410,
  "San Marino": 33938,
  "Sao Tome and Principe": 219161,
  "Saudi Arabia": 34813867,
  "Senegal": 16743930,
  "Serbia": 8737370,
  "Seychelles": 98340,
  "Shanghai Cooperation Organization (SCO)": 3254462689,
  "Sierra Leone": 7976985,
  "Singapore": 5850343,
  "Sint Maarten (Dutch part)": 42882,
  "Slovakia": 5459643,
  "Slovenia": 2078931.9999999998,
  "Small Island Developing States (SIDS)": 72076098,
  "Solomon Islands": 686878,
  "Somalia": 15893219,
  "South Africa": 59308690,
  "South America": 430759772,
  "South Asian Association for Regional Cooperation (SAARC)": 1856376652,
  "South Sudan": 11193729,
  "South-Eastern Asia": 668619854,
  "Southern Africa": 67503647,
  "Southern African Development Community (SADC)": 363228526,
  "Southern Asia": 1940369605,
  "Southern Common Market (MERCOSUR)": 308470415,
  "Southern Europe": 152215243,
  "Spain": 46754783,
  "Sri Lanka": 21413250,
  "State of Palestine": 5101416,
  "Sub-Saharan Africa": 1094365605,
  "Sudan": 43849269,
  "Suriname": 586634,
  "Sweden": 10099270,
  "Switzerland": 8654618,
  "Syrian Arab Republic": 17500657,
  "Tajikistan": 9537642,
  "Thailand": 69799978,
  "Timor-Leste": 1318442,
  "Togo": 8278736.999999999,
  "Tokelau": 1350,
  "Tonga": 105697,
  "Trinidad and Tobago": 1399491,
  "Tunisia": 11818618,
  "Turkey": 84339067,
  "Turkmenistan": 6031187,
  "Turks and Caicos Islands": 38718,
  "Tuvalu": 11792,
  "UN-ECE: member countries": 1301671072,
  "UNFPA Regions": 6435966035,
  "UNFPA: Arab States (AS)": 377302147,
  "UNFPA: Asia and the Pacific (AP)": 4082579031,
  "UNFPA: East and Southern Africa (ESA)": 617189215,
  "UNFPA: Eastern Europe and Central Asia (EECA)": 249965985,
  "UNFPA: Latin America and the Caribbean (LAC)": 649907020,
  "UNFPA: West and Central Africa (WCA)": 459022637,
  "UNICEF PROGRAMME REGIONS": 6518336209,
  "UNICEF Programme Regions: East Asia and Pacific (EAPRO)": 2142209426,
  "UNICEF Programme Regions: Eastern Caribbean": 2406024,
  "UNICEF Programme Regions: Eastern and Southern Africa (ESARO)": 542249263,
  "UNICEF Programme Regions: Europe and Central Asia (CEECIS)": 280885442,
  "UNICEF Programme Regions: Latin America": 646666007,
  "UNICEF Programme Regions: Latin America and Caribbean (LACRO)": 649072031,
  "UNICEF Programme Regions: Middle East and North Africa (MENARO)": 498959354,
  "UNICEF Programme Regions: South Asia (ROSA)": 1856376652,
  "UNICEF Programme Regions: West and Central Africa (WCARO)": 548584041,
  "UNICEF REGIONS": 7794798729,
  "UNICEF Regions: East Asia and Pacific": 2389387290,
  "UNICEF Regions: Eastern Europe and Central Asia": 426819902,
  "UNICEF Regions: Eastern and Southern Africa": 589624762,
  "UNICEF Regions: Europe and Central Asia": 924612983,
  "UNICEF Regions: Latin America and Caribbean": 653962332,
  "UNICEF Regions: Middle East and North Africa": 463374954,
  "UNICEF Regions: North America": 368869644,
  "UNICEF Regions: South Asia": 1856376652,
  "UNICEF Regions: Sub-Saharan Africa": 1138214874,
  "UNICEF Regions: West and Central Africa": 548590112,
  "UNICEF Regions: Western Europe": 497793081,
  "UNITED NATIONS Regional Groups of Member States": 7789099185,
  "Uganda": 45741000,
  "Ukraine": 43733759,
  "United Arab Emirates": 9890400,
  "United Kingdom, United Kingdom": 67886004,
  "United Kingdom (and dependencies)": 68405089,
  "United Nations Economic Commission for Africa (UN-ECA)": 1338826591,
  "United Nations Economic Commission for Latin America and the Caribbean (UN-ECLAC)": 653958849,
  "United Nations Economic and Social Commission for Asia and the Pacific (UN-ESCAP) Regions": 4627631561,
  "United Nations Member States": 7789099174,
  "United Republic of Tanzania": 59734213,
  "United States Virgin Islands": 104423,
  "United States of America": 331002647,
  "United States of America (and dependencies)": 334249447,
  "Upper-middle-income countries": 2654816331,
  "Uruguay": 3473727,
  "Uzbekistan": 33469199,
  "Vanuatu": 307150,
  "Venezuela": 28435943,
  "Vietnam": 97338583,
  "WB region: East Asia and Pacific (excluding high income)": 2142225998.9999998,
  "WB region: Europe and Central Asia (excluding high income)": 422714634,
  "WB region: Latin America and Caribbean (excluding high income)": 575044612,
  "WB region: Middle East and North Africa (excluding high income)": 396445990,
  "WB region: South Asia (excluding high income)": 1856376652,
  "WB region: Sub-Saharan Africa (excluding high income)": 1135954340,
  "WHO Regions": 7750010916,
  "WHO: African region (AFRO)": 1120161235,
  "WHO: Americas (AMRO)": 1018121127,
  "WHO: Eastern Mediterranean Region (EMRO)": 725720786,
  "WHO: European Region (EURO)": 932888131,
  "WHO: South-East Asia region (SEARO)": 2021386630,
  "WHO: Western Pacific region (WPRO)": 1931733007,
  "Wallis and Futuna Islands": 11246,
  "West African Economic and Monetary Union (UEMOA)": 130852886,
  "Western Africa": 401861255,
  "Western Asia": 279636774,
  "Western Europe": 196146321,
  "Western European and Others Group (WEOG)": 923721644,
  "Western Sahara": 597330,
  "World": 7794798729,
  "World Bank Regional Groups (developing only)": 6528762227,
  "Yemen": 29825968,
  "Zambia": 18383956,
  "Zimbabwe": 14862927,
	"Guangdong, China":	104303132,
	"Shandong, China":	100063065,
	"Henan, China":	94023567,
	"Sichuan, China":	80418200,
	"Jiangsu, China":	78659903,
	"Hebei, China":	71854202,
	"Hunan, China":	65683722,
	"Anhui, China":	59500510,
	"Hubei, China":	57237740,
	"Zhejiang, China":	54426891,
	"Guangxi, China":	46026629,
	"Yunnan, China":	45966239,
	"Jiangxi, China":	44567475,
	"Liaoning, China":	43746323,
	"Fujian, China":	36894216,
	"Shaanxi, China":	37327378,
	"Heilongjiang, China":	38312224,
	"Shanxi, China":	37022111,
	"Guizhou, China":	35806468,
	"Chongqing, China":	28846170,
	"Jilin, China":	27462297,
	"Gansu, China":	25575254,
	"Inner Mongolia, China":	24706321,
	"Xinjiang, China":	21813334,
	"Shanghai, China":	23019148,
	"Beijing, China":	19612368,
	"Tianjin, China":	12938224,
	"Hainan, China":	9261518,
	"Hong Kong, China":	7061200,
	"Ningxia, China":	6176900,
	"Qinghai, China":	5626722,
	"Tibet, China":	3002166,
	"Macau, China":	552503,
	"New South Wales, Australia": 8089952,
	"Queensland, Australia": 5095100,
	"South Australia, Australia": 1044353,
	"Tasmania, Australia": 534281,
	"Victoria, Australia": 6594804,
	"Westerna Australia, Australia": 2621680,
  "Alberta, Canada": 4335768,
  "British Columbia, Canada": 5031893,
  "New Brunswick, Canada": 772790,
  "Northwest Territories, Canada": 45047,
  "Nova Scotia, Canada": 965249,
  "Ontario, Canada": 14441694,
  "Quebec, Canada": 8429241,
  "Saskatchewan, Canada": 1170028,
  "Manitoba, Canada": 1361997
};

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
          if(testing[marker.name] && population[marker.name]) {
            avgTested += testing[marker.name];
            avgPopulation += population[marker.name];
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
          if(testing[confirmed[rowId].name] && population[confirmed[rowId].name]) {
            let localTestRate = testing[confirmed[rowId].name] / population[confirmed[rowId].name];
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

	  // Why can't I load this:
    //Papa.parse("https://population.un.org/wpp/Download/Files/1_Indicators%20(Standard)/CSV_FILES/WPP2019_TotalPopulationBySex.csv", {
	    // but this:?
    //Papa.parse("http://localhost:3000/covid19-map/WPP2019_TotalPopulationBySex.csv", {
    //  download: true,
    //  complete: function(results) {
    //    for(let data of results.data) {
	//	  if (data[4] == "2020") {
	//	    console.log("Loaded 2020 data for " + data[1] + ": " + data[8]);
	//	    population[data[1]] = data[8]*1000;
	//	  }
	//    }
    //    console.log(JSON.stringify(population));
    //  }
    //});
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
          <Form.Check inline title="Represent data as circles. Hover circles on map to see more details." className="small" checked={that.state.chart==="pie" } label="Circles" type={"radio"} name={"a"} id={`inline-radio-1`} onChange={() => {that.setState({chart: "pie"});}}/>
          <Form.Check inline title="Represent data as vertical bars. Hover bars on map to see more details." className="small hideInMomentum" checked={that.state.chart==="bar" } label="Bars" type={"radio"} name={"a"} id={`inline-radio-2`} onChange={() => {that.setState({chart: "bar"});}} disabled={that.state.momentum!=="none" ? true : false}/>
          <Form.Check inline title="Represent data as horizontal progress bars. Hover bars on map to see more details." className="small hideInMomentum" checked={that.state.chart==="pill" } label="Progress" type={"radio"} name={"a"} id={`inline-radio-3`} onChange={() => {that.setState({chart: "pill"});}} disabled={that.state.momentum!=="none" ? true : false}/><br />
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
                      this.state.setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
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
                size = this.scalePpm(size, population[name]);
                size = this.scaleLogAndPpm(size);
                return (<Marker coordinates={coordinates} key={"change_" + rowId}>
                  <circle r={isNaN(size)?0:Math.sqrt(size) * that.state.factor} fill={pos ? "#F008" : "#0F08"} />
                  <title>
                    {`
                      ${name} - ${Math.abs(val)} ${pos ? "INCREASE" : "DECREASE"} in active(= confirmed-recovered) cases (excl. deceased) (${Math.round(ONE_M*val/population[name])} ppm)`
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
              let active = val - recoveredAbsByRowId[rowId] - deathsAbsByRowId[rowId];
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              size = this.scaleLog(size);
              size = this.scalePpm(size, population[name]);
		      size = this.scaleLogAndPpm(size);
		      let ppms = population[name] && !isNaN(val) ? '(' + Math.round(ONE_M * val / population[name]) + ' ppm)'  : '';
		      let ppms2 = population[name] && !isNaN(active) ? '(' + Math.round(ONE_M * active / population[name]) + ' ppm)'  : '';
              return (<Marker coordinates={coordinates} key={"unconfirmed_" + rowId}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={isNaN(size)?0:- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={isNaN(size)?0:size * that.state.factor} fill={color+"8"} />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={that.state.width * 3 * 0 - that.state.width * 3 * 1.5} y={isNaN(size)?0:-size * that.state.factor} width={that.state.width * 3} height={isNaN(size)?0:size * that.state.factor} fill={color+"8"} />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} r={isNaN(size)?0:Math.sqrt(size) * that.state.factor} fill={color+"8"} />
                <title>
                  {
                    `${name} - could be >${rounded(val)} confirmed ${ppms}, >${rounded(active)} active ${ppms2} if local test rate was like global average test rate`
                  }
                </title>
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{ fontSize: name.endsWith(", US") ? "0.005em" : "2px", fontFamily: "Arial", fill: "#5D5A6D33", pointerEvents: "none" }}
		      >
                  {/*name*/}
                </text>
              </Marker>
            )})
          }
          {
            confirmed.map(({ rowId, name, coordinates, markerOffset, size, val }) => {
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
            that.state.momentum==="none" &&
            confirmed.map(({ rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#F00";
              let active = val - recoveredAbsByRowId[rowId] - deathsAbsByRowId[rowId];
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              size = this.scale(size, population[name]);
		      let ppms = population[name] && !isNaN(val) ? '(' + Math.round(ONE_M * val / population[name]) + ' ppm)'  : '';
		      let ppms2 = population[name] && !isNaN(active) ? '(' + Math.round(ONE_M * active / population[name]) + ' ppm)'  : '';
              return (<Marker coordinates={coordinates} key={"confirmed_" + rowId}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={isNaN(size)?0:- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={isNaN(size)?0:size * that.state.factor} fill={color+"8"} />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={that.state.width * 3 * 0 - that.state.width * 3 * 1.5} y={isNaN(size)?0:-size * that.state.factor} width={that.state.width * 3} height={isNaN(size)?0:size * that.state.factor} fill={color+"8"} />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} r={isNaN(size)?0:Math.sqrt(size) * that.state.factor} fill={color+"8"} />
                <title>
                  {
                    `${name} - ${rounded(val)} confirmed ${ppms}, ${rounded(active)} active ${ppms2}`
                  }
                </title>
              </Marker>
            )})
          }
          {
            that.state.momentum==="none" && !that.state.jhmode &&
            recovered.map(({rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#0F0";
              if(that.state.chart==="pie" || that.state.chart==="pill") {
                size += deathsByRowId[rowId];
              }
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              size = this.scale(size, population[name]);
              let ppms = population[name] && !isNaN(val) ? '(' + Math.round(ONE_M * val / population[name]) + ' ppm)'  : '';
              return (<Marker coordinates={coordinates} key={"recovered_" + rowId}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={isNaN(size)?0:- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={isNaN(size)?0:size * that.state.factor} fill={color + "8"} />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={that.state.width * 3 * 1 - that.state.width * 3 * 1.5} y={isNaN(size)?0:-size * that.state.factor} width={that.state.width * 3} height={isNaN(size)?0:size * that.state.factor} fill={color+"8"} />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} r={isNaN(size)?0:Math.sqrt(size) * that.state.factor} fill={color + "8"} />
                <title>{name + " - " + rounded(val) + " recovered " + ppms}</title>
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
            deaths.map(({rowId, name, coordinates, markerOffset, size, val }) => {
              let color = "#000";
              if(that.state.chart==="pill" || that.state.chart==="bar") {
                size *= 10;
              }
              size = this.scale(size, population[name]);
              let ppms = population[name] && !isNaN(val) ? '(' + Math.round(ONE_M * val / population[name]) + ' ppm)'  : '';
              return (<Marker coordinates={coordinates} key={"deceased_" + rowId}>
                <rect style={that.state.chart==="pill" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={isNaN(size)?0:- size * that.state.factor / 2} y={-that.state.width/2*3} height={that.state.width*3} width={isNaN(size)?0:size * that.state.factor} fill={color + "a"} />
                <rect style={that.state.chart==="bar" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} x={that.state.width * 3 * 2 - that.state.width * 3 * 1.5} y={isNaN(size)?0:-size * that.state.factor} width={that.state.width * 3} height={isNaN(size)?0:size * that.state.factor} fill={color + "a"} />
                <circle style={that.state.chart==="pie" ? {display: "block", hover: {fill: color}} : {display: "none", hover: {fill: color}}} r={isNaN(size)?0:Math.sqrt(size) * that.state.factor} fill={color + "a"} />
                <title>{name + " - " + rounded(val) + " deceased " + ppms}</title>
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

  scale = (value, population) => {
    value = this.scaleLog(value);
    value = this.scalePpm(value, population);
    value = this.scaleLogAndPpm(value);
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
