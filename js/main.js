/**
* @author Sean Taylor Hutchison
* @email seanthutchison@gmail.com
* @website http://taylorhutchison.com
* @created 7/21/2014
* @last_modified 7/21/2014
*/
/// <reference path="geomath.ts"/>
/// <reference path="..\..\library\typescript\definitions\jquery\jquery.d.ts" />

var geoRequestQueue = (function () {
    function geoRequestQueue() {
    }
    geoRequestQueue.requests = [];
    geoRequestQueue.addRequest = function (request) {
        return geoRequestQueue.requests.push(request) - 1;
    };
    geoRequestQueue.popNext = function () {
        return geoRequestQueue.requests.splice(0, 1)[0];
    };
    return geoRequestQueue;
})();

var geoJSONobj;
var currentBoundary = new Boundary();
var allFetchedBoundaries = [];
var activeFetch = false;
var jsonResponse;

function fetchBoundaryData(url, description, defer) {
    if (!defer) {
        var defer = jQuery.Deferred();
        var promise = defer.promise();
    }
    var alreadyFetched = false;
    allFetchedBoundaries.forEach(function (boundary) {
        if (boundary.description == description && boundary.url == url) {
            alreadyFetched = true;
            currentBoundary = boundary;
            defer.resolve();
            if (geoRequestQueue.requests.length > 0) {
                var nextRequest = geoRequestQueue.popNext();
                fetchBoundaryData(nextRequest.url, nextRequest.description, nextRequest.defer);
            }
        }
    }, this);
    if (!alreadyFetched) {
        if (!activeFetch) {
            activeFetch = true;
            jsonResponse = $.getJSON(url);
            jsonResponse.done(function () {
                activeFetch = false;
                geoJSONobj = JSON.parse(jsonResponse.responseText);
                currentBoundary = new Boundary(geoJSONobj, url, description);
                currentBoundary.boundingBox = currentBoundary.getFeatureBounds();
                allFetchedBoundaries.push(currentBoundary);
                defer.resolve();
                if (geoRequestQueue.requests.length > 0) {
                    var nextRequest = geoRequestQueue.popNext();
                    fetchBoundaryData(nextRequest.url, nextRequest.description, nextRequest.defer);
                }
            });
        } else {
            geoRequestQueue.addRequest({ url: url, description: description, defer: defer });
        }
    }
    return promise;
}

var p1 = fetchBoundaryData('geodata/states/hi.geojson', 'State of Hawaii');
p1.done(function () {
    console.log('first promise is resolved');
});

var p2 = fetchBoundaryData('geodata/states/tn.geojson', 'State of TN');
p2.done(function () {
    console.log('second promise is resolved');
});
//# sourceMappingURL=main.js.map
