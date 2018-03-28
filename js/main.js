/**
 * Data Training in Hanoi: 
 * Experiments on Highcharts and RESTful API's
 * References:
 * - GitHub portal: https://github.com/ThomasRoca/Data_Training_Hanoi
 * - World Bank data: https://data.worldbank.org/
                      https://api.worldbank.org/v2/indicators?format=json
 * - DHS Program: https://api.dhsprogram.com/rest/dhs/indicators?f=html
 *                https://api.dhsprogram.com/rest/dhs/data/
 * angel;20180130
 */


var data;



// hard-coded list of indicators code and their description
// From World Bank: https://data.worldbank.org/
var indicators_list = {
    "AG.LND.AGRI.ZS": "Agricultural land (% of land area)",
    "EN.ATM.CO2E.PC": "CO2 emissions (metric tons per capita)",
    "AG.LND.FRST.ZS": "Forest area (% of land area)",
    "AG.LND.IRIG.AG.ZS": "Agricultural irrigated land (% of total agricultural land)",
    "NV.AGR.TOTL.ZS": "Agriculture, value added (% of GDP)",
    "SP.POP.TOTL": "Population, total",
    "AG.YLD.CREL.KG": "Cereal yield (kg per hectare)",
    "SH.DYN.MORT": "Mortality rate, under-5 (per 1,000 live births)",
    "EG.ELC.RNEW.ZS": "Renewable electricity output (% of total electricity output)"
};

// default indicator and country iso3 values
var indicator = "AG.LND.AGRI.ZS";
var iso3 = "COG";

// Country iso3 codes and their textual description
var country_list_data = 
{
  "COG": "Congo, Rep.",
  "AFG": "Afghanistan",
  "AND": "Andorra",
  "VNM": "Vietnam",
  "BOL": "Bolivia",
  "PH": "Philippines"
};
var year_list = [];

// where all (group) graphs data are stored
var graphsData = [];
var chart;
var selectAllCountries = false;

// timers and counters used for tracking loaded group data
var countCountryTotal = Object.keys(indicators_list).length;
var countCountryLoaded = 0;
var lastSec = 0;


/**
 * Find indicacators with data
 * From url: https://api.dhsprogram.com/rest/dhs/indicators?f=html
 */
var findGoodIndicators = function(){
  var table = $(".dhsDisplayTable");
  table.children[0].children[3];

  // indicator text: table.children[0].children[3].children[1].innerText

  var testIndicators = [];

  
};


/**
 * Load data from a RESTful URL
 * DHS Indicators: https://api.dhsprogram.com/rest/dhs/data/
 *                 https://api.dhsprogram.com/rest/dhs/indicators?f=html
 * World Bank Indicators: https://api.worldbank.org/v2/indicators?format=json
 * @param url   url query to a REST service. Defaults to WB indicators if none is provided
 */
var loadIndicators = function(url){
    var loadUrl = (url != undefined) ? url : "https://api.worldbank.org/v2/indicators?format=json";
    console.log("loading url:\n" + loadUrl);

    $.ajax({
      url: url,
      type: 'get',
      success: function(j){
        data = j;
      },
      error: function(e){
        console.log("Something went wrong :(\n" + e);
      }
    });
}


/**
 * Select the country ISO code
 */
var selectData = function(){
    iso3 = document.getElementById("countries").value;
    console.log("selected: " + iso3); 

  loadData(iso3);
}


/**
 * Select an indicator and load its graph for individual
 * or all countries
 */
var selectIndicator = function(){
    indicator = document.getElementById("indicators").value; 

    if(selectAllCountries){
      loadAllGraphs();
    }
    else{
      loadData(iso3, indicator);
    }    
};


/*
 * Load a SINGLE country data using selected iso3 country code and set selected  
 * global iso3, indicator values.
 * Render a graph using loaded country data
 * @param newIso3   new country iso3 code
 * @param newIndicator  new indicator
 */
function loadData(newIso3, newIndicator){
  indicator = (newIndicator == undefined) ? indicator : newIndicator;
  iso3 = (newIso3 == undefined) ? iso3 : newIso3;
  var time=30;
	
  var url = "https://api.worldbank.org/v2/countries/"+iso3+"/indicators/"+indicator+"?per_page="+time+"&MRV="+time+"&format=json";
  console.log(url) 

  var array_data = [];
  year_list = [];
    
  $.ajax({ 
    url:url,
    complete: function(json) {
      data= JSON.parse(json.responseText);
      $.each(data[1], function(i, data) {
        country_name = data.country.value;
        indicatorName = data.indicator.value;
        year_list.push(data.date);
        array_data.push(parseFloat(data.value));
      });
	
      // render loaded data on highcharts
      chart = new Highcharts.Chart({
        chart: { type: 'spline', renderTo: 'container'},
        title: {text: indicatorName +" in "+ country_name },
        subtitle: {text: 'Source: World Bank Data'},
        xAxis: { categories: year_list.reverse() }, //.reverse() to have the min year on the left 
        series: [{
          name: country_name,
          data: array_data.reverse() 
        }]
      }); 
    }, 
    error: function() {
      console.log('there was an error!');
    }
  }); 
}


/**
 * Initialize HTML DOM elements, assign action to click events
 * Populate the indicators selection.
 * Initialize default data for iso3 and indicator variables
 */
function initElements(){
    // populate the indicators selection list
    var indicators = $("#indicators");
    for(var i in indicators_list){
        console.log(i)
        indicators.append("<option value='"+i+"'>"+ indicators_list[i] +"</option>");        
    }

    // populate the country selection list
    var indicators = $("#countries");
    for(var i in country_list_data){
        console.log(i)
        indicators.append("<option value='"+i+"'>"+ country_list_data[i] +"</option>");        
    }    
    
    // initialize default values
    indicator = "AG.LND.AGRI.ZS";
    iso3 = "COG";
    countCountryTotal = Object.keys(indicators_list).length;

    // initialize select all countries checkbox event callback
    $("#allcountries").click(function(){
      var countries = $("#countries");
      countries.prop('disabled', countries.prop('disabled') ? false : true);

      if(countries.prop('disabled')){
        selectAllCountries = true;
        countries.css("background", "grey");
        loadAllGraphs();
      }
      else{
        selectAllCountries = false;
        countries.css("background", "white");
        loadData(iso3);
      }
    });
    
    // load initial graph to display on page load
    loadData(iso3, indicator);
}


/*
 * Fetch the remote data of a SINGLE country data using selected iso3 country code and/or indicator  
 * @param newIso3   new country iso3 code
 * @param newIndicator  new indicator
 */
var getGraphData = function(getIso3, getIndicator){
  var time = 30;
  var url = "https://api.worldbank.org/v2/countries/"+getIso3+"/indicators/"+getIndicator+"?per_page="+time+"&MRV="+time+"&format=json";
  year_list = [];
  var content_data = [];

  $.ajax({ 
    url:url,
    complete: function(json) {
      data= JSON.parse(json.responseText);
      $.each(data[1], function(i, data) {
        country_name = data.country.value;
        indicatorName = data.indicator.value;
        year_list.push(data.date);
        content_data.push(parseFloat(data.value));
      });

      console.log("storing " + country_name + "..., array length: " + content_data.length);
      if(content_data.length > 0){
        graphsData.push({
          name: country_name,
          data: content_data.reverse()
        });
      }

      countCountryLoaded++;
    }, 
    error: function() {
      console.log('there was an error!');
    }
  }); 
};


/**
 * Listen until all countries' graph data has finished loading.
 * Display all country graphs for a selected indicator after 
 * ALL data have finished loading
 */
var displayAllGraphs = function(){
  if(countCountryLoaded < Object.keys(country_list_data).length) {
    console.log("loaded graph count is: " + countCountryLoaded);  
    window.requestAnimationFrame(displayAllGraphs);
  }
  else{
    console.log("all graphs are loaded. " + countCountryLoaded + " = " + Object.keys(country_list_data).length);
    window.cancelAnimationFrame(displayAllGraphs)

    // render all loaded data on highcharts
    chart = new Highcharts.Chart({
      chart: { type: 'spline', renderTo: 'container'},
      title: {text: indicators_list[indicator] +" in selected countries" },
      subtitle: {text: 'Source: World Bank Data'},
      xAxis: { categories: year_list.reverse() }, //.reverse() to have the min year on the left 
      series: graphsData
    });    
  }
};


/**
 * Initiate the call to start loading all countries' data for a selected indicator.
 * All graphs will be rendered after all data have finished loading.
 * (see displayAllGraphs)
 */
var loadAllGraphs = function(){
  // reset all country graphs container and counters
  graphsData = [];
  countCountryLoaded = lastSec = 0;

  for(var i in country_list_data){
    getGraphData(i, indicator);
    console.log("loading graph... " + i + ", " + indicator);
  }

  window.requestAnimationFrame(displayAllGraphs);    
};


// main program start
window.onload = function(){
    initElements();
}