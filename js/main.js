/**
* @author Sean Taylor Hutchison
* @email seanthutchison@gmail.com
* @website http://taylorhutchison.com
* @created 7/21/2014
* @last_modified 7/21/2014
*/
/// <reference path="geomath.ts"/>
/// <reference path="..\..\library\typescript\definitions\jquery\jquery.d.ts" />
var geoJSONobj;
var currentBoundary;
var jsonResponse;
var allFetchedBoundaries = [];

function getBoundaryData(filename, description) {
    var alreadyFetched = false;
    allFetchedBoundaries.forEach(function (boundary) {
        if (boundary.description == description && boundary.filename == filename) {
            alreadyFetched = true;
            currentBoundary = boundary;
            console.log('Boundary already downloaded, assigned from saved boundaries');
        }
    });
    if (!alreadyFetched) {
        jsonResponse = $.getJSON(filename);
        jsonResponse.done(function () {
            geoJSONobj = JSON.parse(jsonResponse.responseText);
            currentBoundary = new Boundary(geoJSONobj, filename, description);
            currentBoundary.boundingBox = currentBoundary.getFeatureBounds();
            allFetchedBoundaries.push(currentBoundary);
        });
    }
}

getBoundaryData('geodata/states/tn.geojson', 'State of Tennessee');
console.log(currentBoundary.boundingBox);
//# sourceMappingURL=main.js.map
