(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.BasicRenderer = {}));
}(this, (function (exports) { 'use strict';


        /* ------------------------------------------------------------ */


        // Função que gera os vetores normais das faces de um triângulo
    function gen_normals(primitive){
    var normals = [];
    if (primitive.shape == "triangle"){                
        var dx1 = primitive.vertices[1][0] - primitive.vertices[0][0];                                
        var dy1 = primitive.vertices[1][1] - primitive.vertices[0][1];                        
        dy1 = -1 * dy1;
        normals.push([dy1,dx1]);

        var dx2 = primitive.vertices[2][0] - primitive.vertices[1][0];                                
        var dy2 = primitive.vertices[2][1] - primitive.vertices[1][1];                
        dy2 = -1 * dy2;                
        normals.push([dy2,dx2]);

        var dx3 = primitive.vertices[0][0] - primitive.vertices[2][0];                                
        var dy3 = primitive.vertices[0][1] - primitive.vertices[2][1];                
        dy3 = -1 * dy3;                
        normals.push([dy3,dx3]);

        console.log(normals);
        return normals
        }  
    }

    function earcutPolygon(primitive, preprop_scene){
        const { vertices, color} = primitive;        
        
        for (var i = 1; i < vertices.length - 1; i++){
            var triangle = {
                shape: 'triangle',
                vertices: [vertices[0], vertices[i], vertices[i+1]],
                color              
            }            
            preprop_scene.push(triangle); 
        }                
        return preprop_scene;    
    }

    function cutCircles(primitive, preprop_scene){
        var angleVar = [];
        var centerX = primitive.center[0];
        var centerY = primitive.center[1];
        var radius = primitive.radius;
        var numTriangles = 30;
        var degree = (2 * Math.PI)/(numTriangles+2);

        for (var i = 0; i < numTriangles+2; i++){
            angleVar.push(i*degree);
        }
        
        var circleVertices = [];
        for (const angle of angleVar){
           var aVertex =  [Math.floor(radius * Math.sin(angle) + centerX), Math.floor(radius * Math.cos(angle) + centerY)];
           console.log("entrou no vertex do cutCircles");
           circleVertices.push(aVertex);
           console.log(circleVertices);
        }
        console.log("vai retornar circleVertices");
        return circleVertices    
    }

    function boundingBox(scene){        
        var greater_X = 0;
        var greater_Y = 0;
        var lesser_X = 9000;
        var lesser_Y = 9000;
        var bbox = [];
        for (var primitive of scene){
            
            for (var vertex of primitive.vertices){
                if (vertex[0] > greater_X){
                    greater_X = vertex[0];
                }
                if (vertex[1] > greater_Y){
                    greater_Y = vertex[1];
                }
                if (vertex[0] < lesser_X){
                    lesser_X = vertex[0];
                }
                if (vertex[1] < lesser_Y){
                    lesser_Y = vertex[1];
                }
            }
        }
        bbox.push(lesser_X, greater_X, lesser_Y, greater_Y);
        return bbox
    }
        
        
    function inside(  x, y, primitive, normals  ) {
        // You should implement your inside test here for all shapes   
        // for now, it only returns a false test

        // Testa se é uma primitiva triângulo
        if (primitive.shape == "triangle"){ 
            // pega a lista de normais que foi calculada apenas uma vez, sendo um vetor normal pra cada face do triângulo               
            var normal1 = normals[0];
            var normal2 = normals[1];
            var normal3 = normals[2];                
            
            // Faz o produto interno entre o ponto que está sendo testado e as 3 normais das faces do triângulo.
            var q1 = [x - primitive.vertices[0][0], y - primitive.vertices[0][1]];                       
            var dotProd1 = (q1[0]*normal1[0]) + (q1[1]*normal1[1]);

            var q2 = [x - primitive.vertices[1][0], y - primitive.vertices[1][1]];                       
            var dotProd2 = (q2[0]*normal2[0]) + (q2[1]*normal2[1]);

            var q3 = [x - primitive.vertices[2][0], y - primitive.vertices[2][1]];                       
            var dotProd3 = (q3[0]*normal3[0]) + (q3[1]*normal3[1]);
            // Teste final para saber se o ponto está dentro da área que precisa ser desenhada.
            if (dotProd1>=0 && dotProd2>=0 && dotProd3>=0 || dotProd1<=0 && dotProd2<=0 && dotProd3<=0){
                return true
            }                 
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
                    if (primitive.shape == "triangle"){
                        preprop_scene.push( primitive );
                    }                    
                    if (primitive.shape == "polygon"){
                        preprop_scene.push(earcutPolygon(primitive, preprop_scene));
                    }    
                    if (primitive.shape == "circle"){
                        var circleVertices = cutCircles(primitive,preprop_scene);
                        var primitive2 = {
                            shape: primitive.shape,
                            vertices: circleVertices,
                            color: primitive.color
                        };
                        preprop_scene.push(earcutPolygon(primitive2, preprop_scene));                        
                    }                
                }                
                return preprop_scene;
            },

            createImage: function() {
                this.image = nj.ones([this.height, this.width, 3]).multiply(255);
            },

            rasterize: function() {
                var color;
                //var bbox = boundingBox(scene); // Retorna um array com 4 elementos [x,X,y,Y] como bounding box
         
                // In this loop, the image attribute must be updated after the rasterization procedure.
                for( var primitive of this.scene ) {                    
                    var normals = gen_normals(primitive);
                    // Loop through all pixels
                    for (var i = 0; i < this.width; i++) {
                        var x = i + 0.5;
                        for( var j = 0; j < this.width; j++) {
                            var y = j + 0.5;

                            // First, we check if the pixel center is inside the primitive 
                            if ( inside( x, y, primitive, normals ) ) {
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

