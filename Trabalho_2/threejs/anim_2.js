function OneFoot() {}

Object.assign( OneFoot.prototype, {

    init: function() {
        let r_upperArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/1.2 }, 500)
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
            let r_lowerArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/3}, 500)
            .onUpdate(function() {
                let right_lower_arm =  robot.getObjectByName("right_lower_arm");
                 
                right_lower_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.8, -3.2, 0 ))                              
                
                right_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })
            

            // Right Hand
            let rightHandTween = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/4}, 500)
            .onUpdate(function() {
                let right_hand = robot.getObjectByName("right_hand");

                right_hand.matrix.makeRotationZ(this._object.theta)
                .premultiply( new THREE.Matrix4().makeTranslation(0, -2.0, 0 ))                              

                right_hand.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })


            // Left arm -- decidir a pose da bailarina

            // Left lower arm
            let l_lowerArmTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/3}, 500)
            .onUpdate(function() {
                let left_lower_arm =  robot.getObjectByName("left_lower_arm");
                left_lower_arm.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.8, -3.2, 0 ))                                          
                left_lower_arm.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })



            // Left leg
            let left_upperLegTween = new TWEEN.Tween( {theta:0} ).to( {theta:-Math.PI/3}, 500)
            .onUpdate(function() {
                let left_upper_leg =  robot.getObjectByName("left_upper_leg");
                left_upper_leg.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-0.6, -2, 0 ))                              
                .premultiply( new THREE.Matrix4().makeTranslation(-1.1, -2.5, 0 ))
                                       
                left_upper_leg.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })

            // Left lower leg
            let left_lowerLegTween = new TWEEN.Tween( {theta:0} ).to( {theta:Math.PI/1.8}, 500)
            .onUpdate(function() {
                let left_lower_leg =  robot.getObjectByName("left_lower_leg");
                left_lower_leg.matrix.makeRotationZ(this._object.theta)
                .multiply( new THREE.Matrix4().makeTranslation(-1.0, -2.5, 0 ))                              
                                       
                left_lower_leg.updateMatrixWorld(true);
                stats.update();
                renderer.render(scene, camera);
            })

        r_upperArmTween.chain(r_lowerArmTween,rightHandTween);
        
        r_upperArmTween.start();   
        l_lowerArmTween.start();
        
        left_upperLegTween.chain(left_lowerLegTween);
        left_upperLegTween.start();
        
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



