/**
 * @author Sean Taylor Hutchison
 * @email seanthutchison@gmail.com
 * @website http://taylorhutchison.com
 * @created 7/21/2014
 * @last_modified 7/21/2014
 */

/// <reference path="geomath.ts"/>
/// <reference path="..\..\library\typescript\definitions\jquery\jquery.d.ts" />

interface IGeoRequest {
    url:string;
    description:string;
}

class geoRequestQueue {
    static requests:Array<IGeoRequest> = [];
    static addRequest = function(request:IGeoRequest):number{
        return geoRequestQueue.requests.push(request)-1;
    };
    static popNext = function():IGeoRequest{
        return geoRequestQueue.requests.splice(0,1)[0];
    };
}

var geoJSONobj:IGeofeature;
var currentBoundary:Boundary = new Boundary();
var allFetchedBoundaries:Array<Boundary> = [];
var activeFetch:boolean = false;
var jsonResponse:JQueryXHR;

function fetchBoundaryData(url,description){
        var alreadyFetched = false;
        allFetchedBoundaries.forEach(function (boundary) {
            if (boundary.description == description && boundary.url == url) {
                alreadyFetched = true;
                currentBoundary = boundary;
                if(geoRequestQueue.requests.length>0){
                    var nextRequest = geoRequestQueue.popNext();
                    fetchBoundaryData(nextRequest.url,nextRequest.description);
                }
            }
        });
        if (!alreadyFetched) {
            if(!activeFetch) {
                activeFetch = true;
                jsonResponse = $.getJSON(url);
                jsonResponse.done(function () {
                    activeFetch = false;
                    geoJSONobj = JSON.parse(jsonResponse.responseText);
                    currentBoundary = new Boundary(geoJSONobj, url, description);
                    currentBoundary.boundingBox = currentBoundary.getFeatureBounds();
                    allFetchedBoundaries.push(currentBoundary);
                    if(geoRequestQueue.requests.length>0){
                        var nextRequest = geoRequestQueue.popNext();
                        fetchBoundaryData(nextRequest.url,nextRequest.description);
                    }
                });
            }
            else {
                geoRequestQueue.addRequest({url:url,description:description});
            }
        }
}


fetchBoundaryData('geodata/states/hi.geojson','State of Hawaii');
jsonResponse.done(function(){
    console.log(geoMath.randomPointInsideBounds(currentBoundary.boundingBox));
});

fetchBoundaryData('geodata/states/tn.geojson','State of Tennessee');

jsonResponse.done(function(){
    console.log(geoMath.randomPointInsideBounds(currentBoundary.boundingBox));
});



