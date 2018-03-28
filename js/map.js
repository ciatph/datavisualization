var map;
var info;

/**
 * Load GeoJSON map layer over the worldmap
 * @param iso2	country iso code
 * @param ind 	indicator code
 * @param 
 */
var loadMap = function(/*iso2, ind, surveyyear*/){
	// vietnam
	var iso2="VN"
	var ind="HC_ELEC_H_ELC"
	var surveyyear=2005;

	apiURL="https://api.dhsprogram.com/rest/dhs/data/?f=geojson&returnGeometry=true&breakdown=subnational&countryIds="+iso2+"+&surveyYear="+surveyyear.toString()+"&indicatorIds="+ind;
	console.log("loading map 2:\n" + apiURL);

	$.getJSON(apiURL, function(data){
		L.geoJson(data, {
				//style: style,
				//onEachFeature: onEachFeature
			}).addTo(map);		
	});
};


window.onload = function(){
/* Philippines */
var iso2="PH"
var ind="HC_ELEC_H_ELC"
var surveyyear=2013;

/* Vietnam
var iso2="VN"
var ind="HC_ELEC_H_ELC"
var surveyyear=2005;
*/
//lat,long to set up view
//capital location dictionnary contains iso3, lat, long, and zoom level according to country size
var capital_location=
{"AL":"ALB,41.1533,20.1683,7", "AO":"AGO,-11.2027,17.8739,5", "AM":"ARM,40.0691,45.0382,7", "AZ":"AZE,40.1431,47.5769,7",
          "BD":"BGD,23.685,90.3563,7", "BJ":"BEN,9.30769,2.31583,6", "BO":"BOL,-16.2902,-63.5887,5", "BT":"BTN,27.5142,90.4336,8",
          "BR":"BRA,-14.235,-51.9253,4", "BF":"BFA,12.2383,-1.56159,6", "BU":"null,-32.87,26.12,6", "KH":"KHM,12.5657,104.991, 7",
          "CM":"CMR,7.36972,12.3547, 5", "CF":"CAF,6.61111,20.9394,6", "TD":"TCD,15.4542,18.7322,5", "CO":"COL,4.57087,-74.2973,5",
          "KM":"COM,-11.875,43.8722,8", "CG":"COG,-0.228021,15.8277,6", "CD":"COD,-4.03833,21.7587,5", "CI":"CIV,7.53999,-5.54708,6",
          "DR":"null,-32.87,26.12,7", "EC":"ECU,-1.83124,-78.1834,6", "EG":"EGY,26.8206,30.8025,5", "ES":"ESP,40.4637,-3.74922,6",
          "ER":"ERI,15.1794,39.7823,7", "ET":"ETH,9.145,40.4897,5", "GA":"GAB,-0.803689,11.6094,6", "GH":"GHA,7.94653,-1.02319,6",
          "GU":"GUM,13.4443,144.794,9", "GN":"GIN,9.94559,-9.69664,6", "GY":"GUY,4.86042,-58.9302,6", "HT":"HTI,18.9712,-72.2852,8",
          "HN":"HND,15.2,-86.2419,7", "IA":"null,-32.87,26.12,7", "ID":"IDN,-0.789275,113.921,4", "JO":"JOR,30.5852,36.2384,7",
          "KK":"null,-32.87,26.12,7", "KE":"KEN,-0.023559,37.9062,6", "KY":"CYM,19.5135,-80.567,9", "LS":"LSO,-29.61,28.2336,8",
          "LB":"LBN,33.8547,35.8623,8", "MD":"MDA,47.4116,28.3699,7", "MW":"MWI,-13.2543,34.3015,6", "MV":"MDV,3.20278,73.2207,7",
          "ML":"MLI,17.5707,-3.99617,5", "MR":"MRT,21.0079,-10.9408,5", "MX":"MEX,23.6345,-102.553,5", "MB":"null,-32.87,26.12,7",
          "MA":"MAR,31.7917,-7.09262,5", "MZ":"MOZ,-18.6657,35.5296,5", "NM":"null,-32.87,26.12,7", "NP":"NPL,28.3949,84.124,7",
          "NC":"NCL,-20.9043,165.618,7", "NI":"NIC,12.8654,-85.2072,7", "NG":"NGA,9.082,8.67528,6", "PK":"PAK,30.3753,69.3451,5",
          "PY":"PRY,-23.4425,-58.4438,6", "PE":"PER,-9.18997,-75.0152,5", "PH":"PHL,12.8797,121.774,6", "RW":"RWA,-1.94028,29.8739,8",
          "ST":"STP,0.18636,6.61308,8", "SN":"SEN,14.4974,-14.4524,7", "SL":"SLE,8.46056,-11.7799,7", "ZA":"ZAF,-30.5595,22.9375,5",
          "LK":"LKA,7.87305,80.7718,7", "SD":"SDN,12.8628,30.2176,5", "SZ":"SWZ,-26.5225,31.4659,8", "TJ":"TJK,38.861,71.2761,6",
          "TZ":"TZA,-6.36903,34.8888,5", "TH":"THA,15.87,100.993,5", "GM":"GMB,13.4432,-15.3101,8", "TL":"TLS,-8.87422,125.728,8",
          "TG":"TGO,8.61954,0.824782,7", "TT":"TTO,10.6918,-61.2225,8", "TN":"TUN,33.8869,9.5375,6", "TR":"TUR,38.9637,35.2433,6",
          "TM":"TKM,38.9697,59.5563,7", "UG":"UGA,1.37333,32.2903,7", "UA":"UKR,48.3794,31.1656,6", "UZ":"UZB,41.3775,64.5853,6",
          "VN":"VNM,14.0583,108.277,6", "YE":"YEM,15.5527,48.5164,6", "ZM":"ZMB,-13.1339,27.8493,6", "ZW":"ZWE,-19.0154,29.1549,6"};

//store location information
var location = capital_location[iso2].split(",")
// use location information to set up the view parameters
var view = [location[1],location[2],location[3]]

apiURL="https://api.dhsprogram.com/rest/dhs/data/?f=geojson&returnGeometry=true&breakdown=subnational&countryIds="+iso2+"+&surveyYear="+surveyyear.toString()+"&indicatorIds="+ind;
console.log(apiURL);

	// get color depending on population density value
	function getColor(d) {
		return d >  90 ? '#800026' :
				d > 80  ? '#BD0026' :
				d > 77  ? '#E31A1C' :
				d > 75  ? '#FC4E2A' :
				d > 60   ? '#FD8D3C' :
				d > 50   ? '#FEB24C' :
				d > 40   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.Value)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}


$.getJSON(apiURL, function(data)  {

var statesData = data
map = L.map('map').setView(view, location[3]);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 10,
		id: 'mapbox.light'
	}).addTo(map);


	// control that shows state info on hover
	info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>DHS Indicator</h4><h5>Households with Electricity</h5>' +  (props ?
			props.Indicator+' <br> ' +'In province of <b>'+ props.CharacteristicLabel + '</b> = <b> ' + props.Value+'</b>'
			: 'Hover over a state');
	};

	info.addTo(map);


	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 40, 50, 60, 75, 77, 80, 90],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);
 
});

}