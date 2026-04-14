var roi = ee.Geometry.Point([-47.370359,-16.75789]);

// Load MODIS EVI data
var dataset = ee.ImageCollection('MODIS/061/MOD13Q1')
                  .select('EVI')
                  .filterDate('2001-01-01', '2006-07-31');
// print(dataset)

var dataset2 = ee.ImageCollection('MODIS/061/MOD13Q1')
                  .select('EVI')
                  .filterDate('2006-08-01', '2012-07-31');
//print(dataset2)

var dataset3 = ee.ImageCollection('MODIS/061/MOD13Q1')
                  .select('EVI')
                  .filterDate('2012-08-01', '2018-07-31');
//print(dataset3)

var dataset4 = ee.ImageCollection('MODIS/061/MOD13Q1')
                  .select('EVI')
                  .filterDate('2018-08-01', '2024-07-31');
//print(dataset4)

// Function to add a time band to each image
var addTime = function(image) {
  return image.addBands(image.metadata('system:time_start').rename('time'));
};

// Add time band to each image
dataset = dataset.map(addTime);
dataset2 = dataset2.map(addTime);
dataset3 = dataset3.map(addTime);
dataset4 = dataset4.map(addTime);

// Function to reduce image collection to a time series at the ROI
var getTimeSeries = function(collection, roi) {
  return collection.map(function(image) {
    var mean = image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: roi,
      scale: 30
    }).set('date', image.date().format('YYYY-MM-dd'));
    return ee.Feature(null, mean);
  });
};

// Get original and smoothed time series
var originalTimeSeries = getTimeSeries(dataset, roi);
var smoothedTimeSeries = getTimeSeries(dataset2, roi);
var whatever = getTimeSeries(dataset3, roi);
var whatever2 = getTimeSeries(dataset4, roi);

// Print the time series
//print('Original EVI Time Series:', originalTimeSeries);
//print('Smoothed EVI Time Series:', smoothedTimeSeries);
//print('whatever', whatever);
//print('whatever2', whatever2);

// Chart the original and smoothed NDVI time series
var chart = ui.Chart.feature.byFeature({
  features: ee.FeatureCollection(originalTimeSeries),
  xProperty: 'date',
  yProperties: ['EVI']
}).setSeriesNames(['EVI Curve'])
  .setOptions({
    title: '2000-2006',
    hAxis: {title: 'Date'},
    vAxis: {title: 'EVI'}
  });

var smoothedChart = ui.Chart.feature.byFeature({
  features: ee.FeatureCollection(smoothedTimeSeries),
  xProperty: 'date',
  yProperties: ['EVI']
}).setSeriesNames(['EVI Curve'])
  .setOptions({
    title: '2006-2012',
    hAxis: {title: 'Date'},
    vAxis: {title: 'EVI'}
  });

var chart2 = ui.Chart.feature.byFeature({
  features: ee.FeatureCollection(whatever),
  xProperty: 'date',
  yProperties: ['EVI']
}).setSeriesNames(['EVI Curve'])
  .setOptions({
    title: '2012-2018',
    hAxis: {title: 'Date'},
    vAxis: {title: 'EVI'}
  });

var smoothedChart2 = ui.Chart.feature.byFeature({
  features: ee.FeatureCollection(whatever2),
  xProperty: 'date',
  yProperties: ['EVI']
}).setSeriesNames(['EVI Curve'])
  .setOptions({
    title: '2018-2024',
    hAxis: {title: 'Date'},
    vAxis: {title: 'EVI'}
  });

print(chart);
print(smoothedChart);
print(chart2);
print(smoothedChart2);
