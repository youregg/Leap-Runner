//game info
var score=0;//current score
var life=5;//player's life left,game end when decreased to 0
var difficulty=1;//difficult level
var volume=50;//background music volume

var container=document.getElementById('gameContainer');//get game container

//create game scene
var scene =new THREE.Scene();


//create perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );//initialize a three.js camera
camera.position.set( 0, 200, 200 );

//add environmental light
var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

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

//add background music
var audio = document.createElement('audio');
audio.src = "sound/Kan R. Gao - For River - Piano (Johnny's Version).mp3";
audio.autoplay='autoplay';
audio.loop=true;
document.body.appendChild(audio);

//plane model
var plane=function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "plane";
    var cube=new THREE.BoxGeometry(80,50,50,1,1,1);
    this.mesh.add(cube);
}

//Obstacle model
var obstacle=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="obstacle";
}

//Enemy model
var enemy=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="enemy";
}


//coin model
var coin=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="coin";
}

//sky model
var sky=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="sky";
}

//sea model
var sky=function()
{
    this.mesh=new THREE.Object3D();
    this.mesh.name="sea";
}


function init()
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

function deadScene()
{

}








