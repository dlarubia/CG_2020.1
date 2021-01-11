(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) { 'use strict';


/* ------------------------------------------------------------ */

function getMaxPoint() {

}

function getMinPoint() {

}

function boundingBox(primitive) {
    var vertices = primitive.vertices;
    var min_x = vertices[0][0];
    var min_y = vertices[0][1];
    var max_x = vertices[0][0];
    var max_y = vertices[0][1];

    vertices.forEach((point) => {
        if(point[0] < min_x)
            min_x = point[0]; 
    })

    vertices.forEach((point) => {
        if(point[0] > max_x)
            max_x = point[0];
    })

    vertices.forEach((point) => {
        if(point[1] < min_y) 
            min_y = point[1];
    })

    vertices.forEach((point) => {
        if(point[1] > max_y)
            max_y = point[1];
    })

    bbox = {
        min_x : min_x,
        max_x : max_x,
        min_y : min_y,
        max_y : max_y
    }

    return bbox;
}

function boundingBoxCircle(primitive) {
    var bbox = {
        min_x : primitive.center[0] + primitive.radius,
        max_x : primitive.center[0] - primitive.radius,
        min_y : primitive.center[1] + primitive.radius,
        max_y : primitive.center[1] - primitive.radius,
    }
    return bbox;
}

function PixelIsInBoundingBox(x, y, bbox) {
    if( (x > bbox.min_x && x < bbox.max_x) && (y > bbox.min_y && y < bbox.max_y) )
        return true;
    else return false;
}

function earcutPolygon(primitive, preprop_scene) {
    // Converte os polígonos em triângulos para que a função 'inside' precise tratar somente de triângulos
        const { vertices, color } = primitive;
        for (var i = 1; i < vertices.length - 1; i++) {
            var triangle = {
                shape: 'triangle',
                vertices: [
                    vertices[0],
                    vertices[i],
                    vertices[i+1]
                ],
                color
                //,xform
            }
            preprop_scene.push(triangle) ;
        }    
    return preprop_scene;
}


// Função auxiliar para o earcut dos círculos
function getRadiansList(triangles_number) {
    var radians = [];
    var degree = (2 * Math.PI)/(triangles_number + 2);
    for (var i = 0; i < triangles_number + 2; i++) 
        radians.push(i * degree);
    return radians;
}

function earcutCircle(primitive) {
    var radius = primitive.radius;
    var center = primitive.center;
    var center_x = center[0];
    var center_y = center[1];
    var radiansList = getRadiansList(40);
}


function getNormals(primitive) {
    var normals = [];
    var vertices = primitive.vertices;

    // Verificar necessidade de realização de checagem
    if(primitive.shape == "triangle") {
        var dx1 = vertices[1][0] - vertices[0][0];                                
        var dy1 = vertices[1][1] - vertices[0][1];                
        dy1 = -1 * dy1;                
        
        var dx2 = vertices[2][0] - vertices[0][0];                                
        var dy2 = vertices[2][1] - vertices[0][1];                
        dy2 = -1 * dy2;                
        
        var dx3 = vertices[2][0] - vertices[1][0];                                
        var dy3 = vertices[2][1] - vertices[1][1];                
        dy3 = -1 * dy3;         

        normals.push([dy1,dx1]);
        normals.push([dy2,dx2]);
        normals.push([dy3,dx3]);
    }

    return normals;
}

function dot(P, normal) {
    return P[0] * normal[0] + P[1] * normal[1];
}
        
function inside(  x, y, primitive  ) {
        // You should implement your inside test here for all shapes   
        // for now, it only returns a false test
        var vertices = primitive.vertices;

        if(primitive.shape == "triangle") {
            //if(PixelIsInBoundingBox(x, y, boundingBox(primitive))) {
                var normals = getNormals(primitive);
                
                // Produto interno
                var P0 = [x - vertices[0][0], y - vertices[0][1]];
                var P1 = [x - vertices[0][0], y - vertices[0][1]];
                var P2 = [x - vertices[2][0], y - vertices[2][1]];
                
                var dot0 = dot(P0, normals[0]);
                var dot1 = dot(P1, normals[1]);
                var dot2 = dot(P2, normals[2]);


                if(dot0 >= 0 && dot1 <= 0 && dot2 >= 0) {
                    return true;
                }
            //}
        }
        return false
}
    

function Screen( width, height, scene ) {
    this.width = width;
    this.height = height;
    this.scene = this.preprocess(scene);   
    this.createImage(); 
}

Object.assign( Screen.prototype, {

        preprocess: function(scene) {
            // Possible preprocessing with scene primitives, for now we don't change anything
            // You may define bounding boxes, convert shapes, etc
            
            var preprop_scene = [];

            for( var primitive of scene ) {  
                // do some processing
                // for now, only copies each primitive to a new list
                if(primitive.shape == "triangle")
                    preprop_scene.push(primitive);

                else if(primitive.shape == "polygon") {
                    preprop_scene.push( earcutPolygon(primitive, preprop_scene) );
                }
                
            }

            
            return preprop_scene;
        },

        createImage: function() {
            this.image = nj.ones([this.height, this.width, 3]).multiply(255);
        },

        rasterize: function() {
            var color;
        
            // In this loop, the image attribute must be updated after the rasterization procedure.
            for( var primitive of this.scene ) {

                // Loop through all pixels
                for (var i = 0; i < this.width; i++) {
                    var x = i + 0.5;
                    for( var j = 0; j < this.height; j++) {
                        var y = j + 0.5;

                        // First, we check if the pixel center is inside the primitive 
                        if ( inside( x, y, primitive ) ) {
                            // only solid colors for now
                            color = nj.array(primitive.color);
                            this.set_pixel( i, this.height - (j + 1), color );
                        }
                        
                    }
                }
            }
            
            
            
        },

        set_pixel: function( i, j, colorarr ) {
            // We assume that every shape has solid color
        
            this.image.set(j, i, 0,    colorarr.get(0));
            this.image.set(j, i, 1,    colorarr.get(1));
            this.image.set(j, i, 2,    colorarr.get(2));
        },

        update: function () {
            // Loading HTML element
            var $image = document.getElementById('raster_image');
            $image.width = this.width; $image.height = this.height;

            // Saving the image
            nj.images.save( this.image, $image );
        }
    }
);

exports.Screen = Screen;

})));

