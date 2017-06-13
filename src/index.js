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
var scoreText=document.getElementById('score');
var life=5;//player's life left,game end when decreased to 0
var lifeText=document.getElementById('life');
var difficulty=1;//difficult level
var volume=50;//background music volume
var dead=false;

var container=document.getElementById('gameContainer');//get game container

//create game scene
var scene =new THREE.Scene();


//create perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );//initialize a three.js camera
camera.position.set( 0, 200, 200 );
scene.add(camera);

//add environmental light
var light = new THREE.AmbientLight(0xffffff);
light.position.set(0,200,0);
scene.add(light);

//create game renderer
var renderer=new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);
renderer.shadowMapEnabled=true;//add object shadow

//render the scene
function render() {
    requestAnimationFrame(render);
    renderer.render( scene, camera );
}
render();

//initialize leap motion control
var leapController=new Leap.Controller();
leapController.connect();

//leap camera control
//var cameraControl=new THREE.LeapCameraControls();

//leap object control
//var objectControl=new THREE.LeapObjectControls();

//add background music
var audio = document.createElement('audio');
audio.src = "sound/Kan R. Gao - For River - Piano (Johnny's Version).mp3";
audio.autoplay='autoplay';
audio.loop=true;
document.body.appendChild(audio);

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
    player = new player();
    player.mesh.scale.set(.25,.25,.25);
    player.mesh.position.y = 100;
    scene.add(player.mesh);
}

//Obstacle model
var obstacle=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="obstacle";
}

function createObstacle()
{

}

//coin model
var coin=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="coin";
}

function createCoin()
{

}

//sky model
var sky=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="sky";
}

function createSky()
{

}

function crash()
{

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

function dead()
{

}








