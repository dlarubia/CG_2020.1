function Medit() {}

Object.assign( Medit.prototype, {

    init: function() {
        let r_upperArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/2 }, 500)
            .onUpdate(function(){
                let right_upper_arm =  robot.getObjectByName("right_upper_arm");
                 
                right_upper_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(0, -2, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(-0.4, 2.3, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(2.8, 0, 0 ));

                right_upper_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);    
            })

            // Here you may include animations for other parts 
            
            // Right lower arm
            let r_lowerArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/2}, 500)
            .onUpdate(function() {
                let right_lower_arm =  robot.getObjectByName("right_lower_arm");
                 
                right_lower_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.8, -3.2, 0 ))      
                .premultiply( new THREE.Matrix4().makeTranslation(2, -3.2, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(-1.2, 1, 0 ));                        
                
                right_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })


            let l_upperArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/2 }, 500)
            .onUpdate(function(){
                let left_upper_arm =  robot.getObjectByName("left_upper_arm");
                 
                left_upper_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(0, -2, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(-0.4, 2.3, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(-2.0, 0, 0 ));

                left_upper_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);    
            })

            // Left lower arm
            let l_lowerArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/2}, 500)
            .onUpdate(function() {
                let left_lower_arm =  robot.getObjectByName("left_lower_arm");
                left_lower_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.8, -3.2, 0 ))      
                .premultiply( new THREE.Matrix4().makeTranslation(2, -3.2, 0 ))
                .premultiply( new THREE.Matrix4().makeTranslation(-1.2, 1, 0 ));                                        
                left_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })



            // Left leg
            let l_upperLegTween = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/2}, 500)
            .onUpdate(function() {
                let left_upper_leg =  robot.getObjectByName("left_upper_leg");
                left_upper_leg.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.1, -0.1, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(-3.6, -3, 0 ))
                                       
                left_upper_leg.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })

            let r_upperLegTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/2}, 500)
            .onUpdate(function() {
                let right_upper_leg =  robot.getObjectByName("right_upper_leg");
                right_upper_leg.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.1, -0.1, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(3.6, -3, 0 ))
                                       
                right_upper_leg.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })


            // let bodyTween = new TWEEN.Tween( {theta:0} ).to( {theta:0}, 500)
            // .onUpdate(function() {
            //     let body =  robot.getObjectByName("torso");
            //     body.matrix.makeRotationZ(this._object.theta)
            //     .multiply( new THREE.Matrix4().makeTranslation(-5, -5, 0 ))                              
                                       
            //     body.updateMatrixWorld(true);
            //     stats.update();
            //     renderer.render(scene, camera);
            // })

        //r_upperArmTween.chain(r_lowerArmTween,rightHandTween);
        r_upperArmTween.chain(r_lowerArmTween);
        l_upperArmTween.chain(l_lowerArmTween);
        r_upperArmTween.start(); 
        l_upperArmTween.start();  
        

        l_upperLegTween.start();
        r_upperLegTween.start();
        // l_lowerArmTween.start();
        
        // left_upperLegTween.chain(left_lowerLegTween);
        // left_upperLegTween.start();
        
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



