//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0,

};

//game basic information
var score=0;//current score
var distance=0;
var speed=400;
var dead=false;
var crash=false;
var clock=new THREE.Clock();//record time

//all game models
var gamePlayer;
var gameGround;
var collideList=[];
var coinList=[];
var container=document.getElementById('gameContainer');//get game container
var scene=new THREE.Scene();//create game scene

var camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 100, 200 );//create perspective camera
scene.add(camera);

var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
hemisphereLight.position.y=300;//add environmental light
scene.add(hemisphereLight);

var centerLight = new THREE.PointLight( 0xFFFFFF, 1, 4500 );
centerLight.position.z = 200;
centerLight.position.y = 500;
scene.add(centerLight);

scene.fog=new THREE.Fog(0x061837, 10, 950);


var renderer=new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);
renderer.shadowMapEnabled=true;//add object shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x061837, 1);

//capture mouse events on the canvas element to re-position our camera around the scene
var orbitControl = new THREE.OrbitControls( camera, renderer.domElement );
orbitControl.target = new THREE.Vector3(0,15,0);
orbitControl.maxPolarAngle = Math.PI / 2;
orbitControl.addEventListener( 'change', function() { renderer.render(scene, camera)});

//connect to the leap motion device
var leapController= new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});
leapController.connect();

//initialize game audio
var audio = document.createElement('audio');
audio.src = "sound/Mili - NINE POINT EIGHT.mp3";
audio.autoplay='autoplay';
audio.loop=true;
document.body.appendChild(audio);

var audioCollide = document.createElement('audio');
audioCollide.src = "sound/hit.mp3";
audioCollide.preload="auto";

function playCollide()
{
    audioCollide.play();
}

var audioPoint = document.createElement('audio');
audioPoint.src = "sound/point.mp3";
audioPoint.preload="auto";

function playScore()
{
    audioPoint.play();
}

// 返回一个介于min和max之间的随机数
function getRandomArbitrary(min, max)
{
    return Math.random() * (max - min) + min;
}

// 返回一个介于min和max之间的整型随机数
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render( scene, camera );
}

//game ground model
var ground=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="ground";

    var geometry=new THREE.PlaneGeometry(2000,10000);
    var material=new THREE.MeshLambertMaterial({color: 0xCCCCCC,
        emissive: 0xa6bcc5,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide});


    var gameGround=new THREE.Mesh(geometry,material);
    gameGround.position.y = 0;
    gameGround.rotation.x = -Math.PI/2;

    this.mesh.add(gameGround);
    gameGround.castShadow = true;
    gameGround.receiveShadow = true;

}

function createGround()
{
    gameGround= new ground();
    scene.add(gameGround.mesh);

}
createGround();

//player model
/*var player=function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "player";

    var geometry=new THREE.CubeGeometry(100, 100, 100, 10, 10, 10);
    var material=new THREE.MeshPhongMaterial({color:Colors.red});
    var cube=new THREE.Mesh(geometry,material);

    cube.castShadow=true;
    cube.receiveShadow=true;
    this.mesh.add(cube);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}*/


var player=function() {
    this.mesh = new THREE.Group();
    this.mesh.name = "player";
    this.mesh.position.y = 100;
    //drawBody()
    const bodyGeometry = new THREE.IcosahedronGeometry(17, 0);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        roughness: 1,
        shading: THREE.FlatShading
    });
    var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    // body.position.y=100;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    //drawhead
    const head = new THREE.Group();
    head.position.set(0, 6.5, 16);
    head.rotation.x = rad(-20);
    this.mesh.add(head);

    const foreheadGeometry = new THREE.BoxGeometry(7, 6, 7);
    const foreheadMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaf8b,
        roughness: 1,
        shading: THREE.FlatShading
    });
    const forehead = new THREE.Mesh(foreheadGeometry, foreheadMaterial);
    forehead.castShadow = true;
    forehead.receiveShadow = true;
    forehead.position.y = -1.5;
    head.add(forehead);

    const faceGeometry = new THREE.CylinderGeometry(5, 1.5, 4, 40, 10);
    const faceMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaf8b,
        roughness: 1,
        shading: THREE.FlatShading
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.castShadow = true;
    face.receiveShadow = true;
    face.position.y = -6.5;
    face.rotation.y = rad(45);
    head.add(face);

    const woolGeometry = new THREE.BoxGeometry(8.4, 4.6, 9);
    const woolMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        roughness: 1,
        shading: THREE.FlatShading
    });
    const wool = new THREE.Mesh(woolGeometry, woolMaterial);
    wool.position.set(0, 1.2, 0.7);
    wool.rotation.x = rad(20);
    head.add(wool);

    const rightEyeGeometry = new THREE.CylinderGeometry(0.8, 1, 0.6, 60);
    const rightEyeMaterial = new THREE.MeshPhongMaterial({
        color: Colors.brownDark,
        roughness: 1,
        shading: THREE.FlatShading
    });
    const rightEye = new THREE.Mesh(rightEyeGeometry, rightEyeMaterial);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    rightEye.position.set(3.5, -4.8, 3.3);
    rightEye.rotation.set(rad(130.8), 0, rad(-45));
    head.add(rightEye);

    const leftEye = rightEye.clone();
    leftEye.position.x = -rightEye.position.x;
    leftEye.rotation.z = -rightEye.rotation.z;
    head.add(leftEye);

    const rightEarGeometry = new THREE.BoxGeometry(1.2, 5, 3);
    const rightEarMaterial = new THREE.MeshPhongMaterial({
        color: 0xffaf8b,
        roughness: 1,
        shading: THREE.FlatShading
    });
    rightEarGeometry.translate(0, -2.5, 0);
    this.rightEar = new THREE.Mesh(rightEarGeometry, rightEarMaterial);
    this.rightEar.castShadow = true;
    this.rightEar.receiveShadow = true;
    this.rightEar.position.set(3.5, -1.2, -0.7);
    this.rightEar.rotation.set(rad(20), 0, rad(50));
    head.add(this.rightEar);

    this.leftEar = this.rightEar.clone();
    this.leftEar.position.x = -this.rightEar.position.x;
    this.leftEar.rotation.z = -this.rightEar.rotation.z;
    head.add(this.leftEar);

    const legGeometry = new THREE.CylinderGeometry(3, 1.5, 10, 40);
    const legEarMaterial = new THREE.MeshPhongMaterial({
        color: 0x4b4553,
        roughness: 1,
        shading: THREE.FlatShading
    });
    legGeometry.translate(0, -5, 0);
    this.frontRightLeg = new THREE.Mesh(legGeometry, legEarMaterial);
    this.frontRightLeg.castShadow = true;
    this.frontRightLeg.receiveShadow = true;
    this.frontRightLeg.position.set(7, -8, 5);
    this.frontRightLeg.rotation.x = rad(-12);
    this.mesh.add(this.frontRightLeg);

    this.frontLeftLeg = this.frontRightLeg.clone();
    this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
    this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
    this.mesh.add(this.frontLeftLeg);

    this.backRightLeg = this.frontRightLeg.clone();
    this.backRightLeg.position.z = -this.frontRightLeg.position.z;
    this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
    this.mesh.add(this.backRightLeg);

    this.backLeftLeg = this.frontLeftLeg.clone();
    this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
    this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
    this.mesh.add(this.backLeftLeg);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

}

function rad(degrees) {
    return degrees * (Math.PI / 180);
}


function createPlayer()
{
    gamePlayer=new player();
    gamePlayer.mesh.scale.set(.80,.80,.80);

    gamePlayer.mesh.position.y=gameGround.mesh.position.y+20;
    leapController.loop(function(frame)
    {
        if (frame.pointables.length > 0) {
            var position = frame.pointables[0].stabilizedTipPosition;
            gamePlayer.mesh.position.x=position[0];
            camera.rotation.z=gamePlayer.mesh.position.x*0.0002;

        }
    });
    scene.add(gamePlayer.mesh);

}
createPlayer();


var tree=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="tree";
    this.mesh.receiveShadow=true;
    this.mesh.castShadow=true;

    var trunkGeometry = new THREE.CylinderGeometry( 20, 20, 80);
    var trunkMaterial = new THREE.MeshLambertMaterial( {color: 0x5D4037} );
    var trunk = new THREE.Mesh( trunkGeometry, trunkMaterial);
    trunk.receiveShadow=true;
    trunk.castShadow=true;

    this.mesh.add(trunk);

    var coneGeometry=new THREE.CylinderGeometry(0,80,200);
    var coneMaterial=new THREE.MeshLambertMaterial({color:0x4db6ac,shading:THREE.FlatShading});
    var cone=new THREE.Mesh(coneGeometry,coneMaterial);
    cone.receiveShadow=true;
    cone.castShadow=true;

    cone.position.y=100;
    this.mesh.add(cone);
}

function createObstacles(zScale)
{
    var myTree=new tree();
    myTree.mesh.position.x = getRandomArbitrary(-450, 450);
    myTree.mesh.position.y = gameGround.mesh.position.y+20;
    myTree.mesh.position.z = zScale-500;
    scene.add(myTree.mesh);
    collideList.push(myTree.mesh.children[1]);

}


function update()
{
    if(score>=0)
    {
        var delta = clock.getDelta();
        var unitScore = 10;
        gamePlayer.mesh.rotation.y = gameGround.mesh.position.y + 15;
        var moveDistance = speed * delta;

        distance += moveDistance;

        gamePlayer.mesh.position.z -= moveDistance * 0.8;

        if (Math.random() < 0.03)
        {
            createObstacles(gamePlayer.mesh.position.z);
        }
        if (Math.random() < 0.01) {
            createCoin(gamePlayer.mesh.position.z);
        }
        crashDetection();
        camera.position.z = gamePlayer.mesh.position.z + 200;

        gameGround.mesh.position.z = gamePlayer.mesh.position.z;
        document.getElementById('score').innerHTML = "Score: " + score.toFixed(0);
        document.getElementById('distance').innerHTML = "Distance: " + distance.toFixed(0);
    }

    if(score<0)
    {
        dead=true;
        judgeDeath();
        camera.position.set( 0, 100, 200 );
    }
}

render();

function crashDetection()
{
    var originPoint=gamePlayer.mesh.position.clone();

    for (var vertexIndex = 0; vertexIndex < gamePlayer.mesh.children[0].geometry.vertices.length; vertexIndex++)
    {
        var localVertex = gamePlayer.mesh.children[0].geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4( gamePlayer.mesh.matrix );
        var directionVector = globalVertex.sub( gamePlayer.mesh.position );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects( collideList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
        {
            crash=true;
            console.log("hit")
            playCollide();
            score-=10;
            break;
        }

        console.log(coinList);
        var coinResults = ray.intersectObjects(coinList);
        if ( coinResults.length > 0 && coinResults[0].distance < directionVector.length() )
        {
            playScore();
            score+=20;
            break;
        }

        crash=false;
    }
}

var coin=function ()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name="coin";
    this.mesh.position.y = 200;

    const geometry = new THREE.OctahedronGeometry(15);
    const material = new THREE.MeshPhongMaterial({color: Colors.red});
    var gameCoin = new THREE.Mesh(geometry, material);
    // body.position.y=100;
    gameCoin.castShadow = true;
    gameCoin.receiveShadow = true;
    this.mesh.add(gameCoin);

}


function createCoin(zscale)
{
    var gameCoin = new coin();
    gameCoin.mesh.position.x = getRandomArbitrary(-400, 400);
    gameCoin.mesh.position.y =gameGround.mesh.position.y+20;
    gameCoin.mesh.position.z = zscale-500;
    scene.add(gameCoin.mesh);
    coinList.push(gameCoin.mesh.children[0]);
}


function startGame()
{


}

function pauseGame()
{

}

function resumeGame()
{

}

function judgeDeath()
{
    if(dead==true)
    {
        $('#deadScene').css('display','block');
        Leap.loop({enableGestures: true}, function(frame)
        {
            frame.gestures.forEach(function(gesture) {
                if (gesture.type == "swipe")
                    self.location = 'game.html';
            });
        });
    }
}


window.addEventListener('resize', handleWindowResize, false);

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}









