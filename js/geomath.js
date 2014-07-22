/**
* @author Sean Taylor Hutchison
* @email seanthutchison@gmail.com
* @website http://taylorhutchison.com
* @created 7/21/2014
* @last_modified 7/21/2014
*/

var Boundary = (function () {
    function Boundary(geoJSONfeature, filename, description) {
        this.type = "";
        this.crs = {};
        this.features = [];
        this.featureVertices = [];
        this.minMaxLatLng = function () {
            var minMax = [{ lat: 0, lng: 0 }, { lat: 0, lng: 0 }];
            minMax[0].lat = this.featureVertices[0][1];
            minMax[0].lng = this.featureVertices[0][0];
            minMax[1].lat = this.featureVertices[0][1];
            minMax[1].lng = this.featureVertices[0][0];
            this.featureVertices.forEach(function (vert) {
                if (minMax[0].lat > vert[1]) {
                    minMax[0].lat = vert[1];
                }
                if (minMax[0].lng > vert[0]) {
                    minMax[0].lng = vert[0];
                }
                if (minMax[1].lat < vert[1]) {
                    minMax[1].lat = vert[1];
                }
                if (minMax[1].lng < vert[0]) {
                    minMax[1].lng = vert[0];
                }
            });
            return minMax;
        };
        this.getFeatureBounds = function () {
            var featureBounds;
            if (this.featureVertices.length < 1) {
                this.featureVertices = this.getAllFeatureVertices();
            }
            featureBounds = new Bounds();
            var minMaxOfBounds = this.minMaxLatLng();
            featureBounds.sw = [minMaxOfBounds[0].lat, minMaxOfBounds[0].lng];
            featureBounds.ne = [minMaxOfBounds[1].lat, minMaxOfBounds[1].lng];
            this.boundingBox = featureBounds;
            return featureBounds;
        };
        /*getBoundingBoxShape = function():number{
        var heightToWidth : number;
        var boxHeight = geoMath.euclideanDist(this.boundingBox.sw[0],this.boundingBox.sw[1],this.boundingBox.ne[0],this.boundingBox.sw[1]);
        var boxWidth = geoMath.euclideanDist(this.boundingBox.sw[0],this.boundingBox.sw[1],this.boundingBox.sw[0],this.boundingBox.ne[1]);
        heightToWidth = boxHeight/boxWidth;
        return heightToWidth;
        };*/
        this.getAllFeatureVertices = function () {
            var featureVertices = [];
            this.features.forEach(function (feature) {
                feature.geometry.coordinates.forEach(function (featurePart) {
                    if (feature.geometry.type.toLowerCase() != "multipolygon") {
                        featurePart.forEach(function (vertex) {
                            featureVertices.push(vertex);
                        });
                    } else {
                        featurePart.forEach(function (multiPart) {
                            multiPart.forEach(function (vertex) {
                                featureVertices.push(vertex);
                            });
                        });
                    }
                });
            });
            return featureVertices;
        };
        this.type = geoJSONfeature.type;
        this.crs = geoJSONfeature.crs;
        this.features = geoJSONfeature.features;
        this.featureCount = this.features.length;
        this.filename = filename;
        this.description = description;
        this.getFeatureBounds();
    }
    return Boundary;
})();

var Bounds = (function () {
    function Bounds(sw, ne) {
        this.ne = [];
        this.sw = [];
        sw = sw || [0, 0];
        ne = ne || [0, 0];
        if (sw[0] < ne[0] && sw[1] < ne[1]) {
            this.sw = sw;
            this.ne = ne;
        }
    }
    return Bounds;
})();
//# sourceMappingURL=geomath.js.map
