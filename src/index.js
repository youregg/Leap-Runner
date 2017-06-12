var score=0;//current score
var life=5;//player's life left,game end when decreased to 0
var difficulty=1;//difficult level
var volume=50;//background music volume

var leapController=new Leap.Controller({
        enableGestures:true
    });

var scene =new THREE.scene();//create game scene
var camera=new THREE.PerspectiveCamera();


function init()
{
    leapController.connect();
    if(leapController.connected)
        $('#leapWarning').css('display','none');
    else
    {
        $('#leapWarning').css('display','block');
        $('#startButton').css('disabled','disabled');//if not connected, disable the start button
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

function setBGM()
{

}


function deadScene()
{

}






