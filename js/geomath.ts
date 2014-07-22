/**
 * @author Sean Taylor Hutchison
 * @email seanthutchison@gmail.com
 * @website http://taylorhutchison.com
 * @created 7/21/2014
 * @last_modified 7/21/2014
 */

/*class geoMath {
    static euclideanDist = function(x1:number,y1:number,x2:number,y2:number):number{
        return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
    };
    static randomPointInsideBounds = function(boundingBox:IBounds):ILatLng{
        var point = {lat:0,lng:0};
        point.lat = Math.random() * (boundingBox.ne[0] - boundingBox.sw[0]) + boundingBox.sw[0];
        point.lng = Math.random() * (boundingBox.ne[1] - boundingBox.sw[1]) + boundingBox.sw[1];
        return point;
    }
}*/


interface IGeofeature {
    type: string;
    crs: any;
    features: Array<any>;
}

interface IBounds {
    ne:Array<number>;
    sw:Array<number>;
}

interface ILatLng {
    lat:number;
    lng:number;
}


class Boundary implements IGeofeature{
    filename:string;
    description:string;
    type:string = "";
    crs:any = {};
    features: Array<any> = [];
    featureCount:number;
    featureVertices:Array<ILatLng> = [];
    boundingBox:IBounds;
    minMaxLatLng = function():Array<ILatLng> {
        var minMax = [{lat:0,lng:0},{lat:0,lng:0}];
        minMax[0].lat = this.featureVertices[0][1];
        minMax[0].lng = this.featureVertices[0][0];
        minMax[1].lat = this.featureVertices[0][1];
        minMax[1].lng = this.featureVertices[0][0];
        this.featureVertices.forEach(function(vert){
            if(minMax[0].lat>vert[1]){
                minMax[0].lat = vert[1];
            }
            if(minMax[0].lng>vert[0]){
                minMax[0].lng = vert[0];
            }
            if(minMax[1].lat<vert[1]){
                minMax[1].lat = vert[1];
            }
            if(minMax[1].lng<vert[0]){
                minMax[1].lng = vert[0];
            }
        });
        return minMax;
    };
    getFeatureBounds = function():IBounds{
        var featureBounds:Bounds;
        if(this.featureVertices.length<1){
            this.featureVertices = this.getAllFeatureVertices();
        }
        featureBounds = new Bounds();
        var minMaxOfBounds = this.minMaxLatLng();
        featureBounds.sw = [minMaxOfBounds[0].lat,minMaxOfBounds[0].lng];
        featureBounds.ne = [minMaxOfBounds[1].lat,minMaxOfBounds[1].lng];
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

    getAllFeatureVertices = function():Array<ILatLng>{
        var featureVertices:Array<ILatLng> = [];
        this.features.forEach(function(feature){
            feature.geometry.coordinates.forEach(function (featurePart) {
                if(feature.geometry.type.toLowerCase()!="multipolygon") {
                    featurePart.forEach(function(vertex:ILatLng) {
                        featureVertices.push(vertex);
                    });
                }
                else {
                    featurePart.forEach(function(multiPart){
                        multiPart.forEach(function(vertex:ILatLng){
                            featureVertices.push(vertex);
                        });
                    });
                }
            });
        });
        return featureVertices;
    };

    constructor(geoJSONfeature:IGeofeature,filename:string,description:string) {
        this.type = geoJSONfeature.type;
        this.crs = geoJSONfeature.crs;
        this.features = geoJSONfeature.features;
        this.featureCount = this.features.length;
        this.filename = filename;
        this.description = description;
        this.getFeatureBounds();
    }
}

class Bounds implements IBounds{
    ne:Array<number> = [];
    sw:Array<number> = [];
    constructor(sw?:Array<number>,ne?:Array<number>){
        sw = sw || [0,0];
        ne = ne || [0,0];
        if(sw[0]<ne[0] && sw[1]<ne[1]) { // Won't work if bounds wrap around the map
            this.sw = sw;
            this.ne = ne;
        }
    }
}





