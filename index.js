/**
 * Created by chrischen on 2017/6/4.
 */
var score=0;//current score
var life=5;//player's life left,game end when decreased to 0

var leapController;
var listeningToDisconnect = false;

function init()
{
    leapController = new Leap.Controller({enableGestures: true, frameEventName: 'deviceFrame'});

    if (!leapController.sendingInput)
    {
        leapController.sendingInput = true;
        if (!listeningToDisconnect) {
            listeningToDisconnect = true;

            leapController.on('deviceDisconnected', leapDisconnected);
        }

        $('#leapWarning').css('display', 'none');
    }

}

function leapDisconnected()
{
    if (leapController.sendingInput)
    {
        leapController.sendingInput = false;

        $('#leapWarning').css('display', 'block');
    }
}

function leapNotConnected()
{
    leapController.sendingInput = false;
    $('#leapWarning').css('display', 'block');
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






