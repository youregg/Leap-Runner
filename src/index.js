var score=0;//current score
var life=5;//player's life left,game end when decreased to 0
var difficulty=1;//difficult level
var volume=50;//background music volume

var container=document.getElementById('gameContainer');//get canvas
container.style.position = 'absolute';
container.style.top = 0;
container.style.left = 0;

var scene =new THREE.Scene();//create game scene

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );//initialize a three.js camera
camera.position.set( 0, 200, 200 );

//create renderer
var renderer=new THREE.WebGLRenderer({
    canvas: container
});
renderer.setSize(window.innerWidth,window.innerHeight);

//render the scene
function render() {
    requestAnimationFrame(render);
    renderer.render( scene, camera );
}
render();

//init leap motion control
var leapController=new Leap.Controller();
leapController.connect();





function startGame()
{

}

function pauseGame()
{

}

function resumeGame()
{

}

function setBGM()
{

}


function deadScene()
{

}






