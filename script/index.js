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
var winScore=false;
var clock=new THREE.Clock();//record time

//all game models
var gamePlayer;
var gameGround;
var collideList=[];
var coinList=[];
var container=document.getElementById('gameContainer');//get game container
var scene=new THREE.Scene();//create game scene

var camera=new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 50, 200 );//create perspective camera
scene.add(camera);

var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
hemisphereLight.position.y=300;//add environmental light
scene.add(hemisphereLight);

var centerLight = new THREE.PointLight( 0xFFFFFF, 1, 4500 );

centerLight.position.y = 500;
centerLight.position.z = 200;
centerLight.castShadow=true;
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



var textureLoader = new THREE.TextureLoader();
map  = textureLoader.load('img/snow.png');
material = new THREE.SpriteMaterial({map: map});

var particles=[];
var fallSpeed=1;
for ( i = 0; i < 60; i ++ )
{
    var particle = new THREE.Sprite( material );
    var randomScale = getRandom(5,10);

    particle.scale.x = particle.scale.y = particle.scale.z = randomScale;
    particle.v = new THREE.Vector3(0, -fallSpeed, 0);
    particle.v.z = (getRandom(-1, 1));
    particle.v.x = (getRandom(-1, 1));

    particles.push(particle);
    scene.add( particle );
}


// 返回一个介于min和max之间的随机数
function getRandom(min, max)
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
var player=function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "player";

    var geometry=new THREE.CubeGeometry(20, 20, 20, 10, 10, 10);
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

    gamePlayer.mesh.position.y=gameGround.mesh.position.y+13;

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
    myTree.mesh.position.x = getRandom(-500, 500);
    myTree.mesh.position.y = gameGround.mesh.position.y+13;
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
        var moveDistance = speed * delta;

        distance += moveDistance*0.01;

        gamePlayer.mesh.position.z -= moveDistance * 0.8;
        centerLight.position.z=gamePlayer.mesh.position.z;
        if (Math.random() < 0.03)
        {
            createObstacles(gamePlayer.mesh.position.z);
        }
        if (Math.random() < 0.01) {
            createCoin(gamePlayer.mesh.position.z);
        }

        crashDetection();
        if(crash==true)
        {
            console.log(crash)
            score-=5;
            playCollide();
        }
        winScoreDetection();
        if(winScore==true)
        {
            console.log("score")
            score+=20;
            playScore();
        }


        camera.position.z = gamePlayer.mesh.position.z + 200;

        gameGround.mesh.position.z = gamePlayer.mesh.position.z;
        document.getElementById('score').innerHTML = "Score: " + score.toFixed(0);
        document.getElementById('distance').innerHTML = "Distance: " + distance.toFixed(0);
    }

    if(score<0)
    {
        dead=true;
        judgeDeath();
        camera.position.set( 0, 150, 200 );
    }

    for(var i = 0; i < particles.length; i++)
    {
        var particle = particles[i];
        particle.position.z=gamePlayer.mesh.position.z-100;
        particle.position.x=getRandom(-window.innerWidth/2,window.innerWidth/2);
        particle.position.y=getRandom(-window.innerHeight/2,window.innerHeight/2);
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
            break;
        }
        crash=false;
    }
}

function winScoreDetection()
{
    var originPoint=gamePlayer.mesh.position.clone();

    for (var vertexIndex = 0; vertexIndex < gamePlayer.mesh.children[0].geometry.vertices.length; vertexIndex++)
    {
        var localVertex = gamePlayer.mesh.children[0].geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4( gamePlayer.mesh.matrix );
        var directionVector = globalVertex.sub( gamePlayer.mesh.position );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        var coinResults = ray.intersectObjects(coinList);
        if (coinResults.length > 0 && coinResults[0].distance < directionVector.length() )
        {
            winScore=true;
            break;
        }
        winScore=false;
    }
}


var coin=function ()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name="coin";

    const geometry = new THREE.OctahedronGeometry(15);
    const material = new THREE.MeshPhongMaterial({color: Colors.red});
    var gameCoin = new THREE.Mesh(geometry, material);

    gameCoin.castShadow = true;
    gameCoin.receiveShadow = true;

    this.mesh.add(gameCoin);

}


function createCoin(zscale)
{
    var gameCoin = new coin();
    gameCoin.mesh.position.x = getRandom(-300, 300);
    gameCoin.mesh.position.y =gameGround.mesh.position.y+13;
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









