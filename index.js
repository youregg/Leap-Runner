/**
 * Created by chrischen on 2017/6/4.
 */

var controller = new Leap.Controller();

var  leapjs = require('leap-0.6.4.js'),
    controller = new leapjs.Controller({
        enableGestures: true,
        frameEventName: 'animationFrame'
    });

function init()
{
    controller.connect();//connect the application and the leap motion device
}

function leapConnected()
{
    controller.connect();
    if(controller.connection==true)
        console.log("true");


}

function leapNotConnected()
{
}

