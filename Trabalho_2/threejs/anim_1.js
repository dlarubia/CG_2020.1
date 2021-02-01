function WaveAnimation() {}

Object.assign( WaveAnimation.prototype, {

    init: function() {
        let upperArmTween = new TWEEN.Tween( {theta:0} )
            .to( {theta:Math.PI/1.2 }, 500)
            .onUpdate(function(){
                // This is an example of rotation of the right_upper_arm 
                // Notice that the transform is M = T * R 
                let right_upper_arm =  robot.getObjectByName("right_upper_arm");
                //right_upper_arm.matrix.makeRotationZ(this._object.theta).premultiply( new THREE.Matrix4().makeTranslation(3, 0, 0 ) );
                 
                right_upper_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(0, -2, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(-0.4, 2.3, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(2.8, 0, 0 ));

                // Updating final world matrix (with parent transforms) - mandatory
                right_upper_arm.updateMatrixWorld(true);
                // Updating screen
                stats.update();
                renderer.render(scene, camera);    
            })

            // Here you may include animations for other parts 
            
            // Right lower arm
            let lowerArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/3}, 500)
            .onUpdate(function() {
                let right_lower_arm =  robot.getObjectByName("right_lower_arm");
                 
                right_lower_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-1, 0, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(0, -1.5, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(1.8, -0.7, 0 )); 
                
                right_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })
            

            // Hand
            let rightHandTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/3}, 500)
            .onUpdate(function() {
                let right_hand = robot.getObjectByName("right_hand");

                right_hand.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.7, 0, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(0, -1.3, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(1.2, -0.5, 0 )); 
            })
        
        //  upperArmTween.chain( ... ); this allows other related Tween animations occur at the same time
        upperArmTween.start();   
        lowerArmTween.start();    
        rightHandTween.start();
    },
    animate: function(time) {
        window.requestAnimationFrame(this.animate.bind(this));
        TWEEN.update(time);
    },
    run: function() {
        this.init();
        this.animate(0);
    }
});




