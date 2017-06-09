/**
 * Created by chrischen on 2017/6/4.
 */

var controller = new Leap.Controller();

function init()
{
    controller.connect();//connect the application and the leap motion device
}

function leapConnected()
{
    controller.connect();
    if(controller.connection==true)
        alert("true");


}

function leapNotConnected()
{
}