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
    static empty = function():void{
        geoRequestQueue.requests = [];
    };
}

var geoJSONobj:IGeofeature;
var currentBoundary:Boundary = new Boundary();
var jsonResponse:JQueryXHR;
var allFetchedBoundaries:Array<Boundary> = [];
var activeFetch:boolean = false;
function getBoundaryData(url,description){
        var alreadyFetched = false;
        allFetchedBoundaries.forEach(function (boundary) {
            if (boundary.description == description && boundary.url == url) {
                alreadyFetched = true;
                currentBoundary = boundary;
                console.log('Boundary already downloaded for %s, assigned from saved boundaries',url);
                console.log(currentBoundary.boundingBox);
                if(geoRequestQueue.requests.length>0){
                    var nextRequest = geoRequestQueue.popNext();
                    getBoundaryData(nextRequest.url,nextRequest.description);
                }
            }
        });
        if (!alreadyFetched) {
            if(!activeFetch) {
                activeFetch = true;
                console.log(url);
                jsonResponse = $.getJSON(url);
                jsonResponse.done(function () {
                    activeFetch = false;
                    geoJSONobj = JSON.parse(jsonResponse.responseText);
                    currentBoundary = new Boundary(geoJSONobj, url, description);
                    currentBoundary.boundingBox = currentBoundary.getFeatureBounds();
                    allFetchedBoundaries.push(currentBoundary);
                    console.log(currentBoundary.boundingBox);
                    if(geoRequestQueue.requests.length>0){
                        var nextRequest = geoRequestQueue.popNext();
                        getBoundaryData(nextRequest.url,nextRequest.description);
                    }
                });
            }
            else {
                geoRequestQueue.addRequest({url:url,description:description});
            }
        }

}

getBoundaryData('geodata/states/tn.geojson','State of Tennessee');
getBoundaryData('geodata/states/hi.geojson','State of Hawaii');
getBoundaryData('geodata/states/tn.geojson','State of Tennessee');




