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

//game info
var score=0;//current score

var life=5;//player's life left,game end when decreased to 0

var difficulty=1;//difficult level
var volume=50;//background music volume
var distance=0;

var obstacleCount=10;
var speed=400;


var dead=false;
var crash=false;
var clock=new THREE.Clock();

//all game modeels
var gamePlayer;
var gameGround;

var obstacleList=[];
var collideMeshList=[];

var container=document.getElementById('gameContainer');//get game container
var scene=new THREE.Scene();//create game scene

var camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 80, 200 );//create perspective camera
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

//controll to the leap motion device
var leapController= new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});
leapController.connect();

var audio = document.createElement('audio');
audio.src = "sound/Kan R. Gao - For River - Piano (Johnny's Version).mp3";
audio.autoplay='autoplay';
audio.loop=true;
document.body.appendChild(audio);


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
    gameGround.position.y = -0.5;
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
var player=function()
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
}

function createPlayer()
{
    gamePlayer=new player();
    gamePlayer.mesh.scale.set(.30,.30,.30);

    gamePlayer.mesh.position.y=gameGround.mesh.position.y+20;

    leapController.loop(function(frame)
    {
        if (frame.pointables.length > 0) {
            var position = frame.pointables[0].stabilizedTipPosition;
            gamePlayer.mesh.position.x=position[0];
            camera.rotation.z=gamePlayer.mesh.position.x*0.0005;
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

    var a = 1 * 50,
        b = getRandomInt(1, 3) * 50,
        c = 1 * 50;

    var myTree=new tree();
    myTree.mesh.position.x = getRandomArbitrary(-400, 400);
    myTree.mesh.position.y = gameGround.mesh.position.y+20;
    myTree.mesh.position.z = zScale-500;
    scene.add(myTree.mesh);
    collideMeshList.push(myTree.mesh.children[1]);

}


function update()
{
    var delta = clock.getDelta();
    var unitScore=10;

    var moveDistance=speed*delta;

    distance+=moveDistance;

    gamePlayer.mesh.position.z-=moveDistance*0.8;
    if(Math.random()<0.03)
    {
        createObstacles(gamePlayer.mesh.position.z);
    }
    crashDetection();
    camera.position.z =gamePlayer.mesh.position.z+200;

    gameGround.mesh.position.z=gamePlayer.mesh.position.z;
    document.getElementById('score').innerHTML="Score: "+score.toFixed(0);
    document.getElementById('distance').innerHTML="Distance: "+distance.toFixed(0);


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
        var collisionResults = ray.intersectObjects( collideMeshList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
        {
            crash=true;
            console.log("hit")
            score-=10;
            break;

        }
        crash=false;

    }

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
    }
}












