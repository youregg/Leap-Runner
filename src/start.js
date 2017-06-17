//get game container
var container=document.getElementById("container");

//create game scene
var scene=new THREE.Scene();

//create game camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 5000);
camera.position.set(0, 200, 750);
scene.add(camera);

//create renderer
var renderer=new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setClearColor(0xB0BEC5, 1);
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);
renderer.shadowMapEnabled=true;

var audio = document.createElement('audio');
audio.src = "sound/Kan R. Gao - For River - Piano (Johnny's Version).mp3";
audio.autoplay='autoplay';
audio.loop=true;
document.body.appendChild(audio);



//orbit control
controls = new THREE.OrbitControls(camera,container);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.025;
controls.noPan = true;
controls.noZoom = true;
controls.minPolarAngle = 1.3;
controls.maxPolarAngle = 1.3;
controls.rotateLeft(45);

var r=1;

function render()
{
    requestAnimationFrame(render);


    sun.position.x = Math.sin(r* 0.0125) * 1200;
    sun.position.y = Math.cos(r * 0.0125) * 250;
    r += Math.PI / 180 * 2;

    renderer.render(scene, camera);
    controls.update();
}

function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomGauss(median, variance, cove)
{
    return variance * Math.pow((Math.random() - 0.5), cove) + median;
}

function Tree(x, z)
{

    var crownHeight = getRandomGauss(60, 800, 5);
    var crownWidth = crownHeight * (Math.random() * 0.21 + 0.3);
    var stemHeight = crownHeight * 0.25;
    var stemWidth = stemHeight * 0.3;

    var coneGeometry = new THREE.CylinderGeometry(0, crownWidth, crownHeight, 8);
    var coneMaterial = new THREE.MeshLambertMaterial({
        color: 0x4db6ac,
        shading: THREE.FlatShading
    });
    var cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(x, (crownHeight * 0.5) + stemHeight, z);

    var cylinderGeometry = new THREE.CylinderGeometry(stemWidth, stemWidth, stemHeight, 5);
    var cylinderMaterial = new THREE.MeshLambertMaterial({
        color: 0x5D4037
    });
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, -stemHeight * 2.5, 0);

    cone.add(cylinder);
    cone.castShadow = true;
    cone.receiveShadow = true;

    return cone;
}

function Sun(radius) {
    var pointLight = {},
        pointLightHelper = {},
        spotlight = {},
        sun = {},
        sunGeometry = {},
        sunMaterial = {};

    sunGeometry = new THREE.SphereGeometry(radius, 10, 10);
    sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xfdd835
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 250, 0);

    pointLight = new THREE.PointLight(0xE65100, 10, 200);
    pointLight.position.set(0, -radius, 0);
    sun.add(pointLight);

    spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(0, 0, 0);
    spotlight.castShadow = true;
    spotlight.shadowDarkness = 0.5;
    spotlight.angle = Math.PI / 2;
    spotlight.shadowCameraFov = 100;
    spotlight.shadowMapHeight = 1024;
    sun.add(spotlight);

    pointLightHelper = new THREE.PointLightHelper(pointLight, 1);

    return sun;
}

THREE.ImageUtils.crossOrigin = '';


planeGeometry = new THREE.CylinderGeometry(1000, 1000, 1, 100);
planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xa6bcc5
});
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;



for (var i = 0; i < 150; i += 1) {
    var x = getRandomInteger(-700, 700),
        z = getRandomInteger(-700, 700);
    scene.add(new Tree(x, z));
}


sun = new Sun(20);
directionalLight = new THREE.DirectionalLight(0x263238, 0.5);
directionalLight.position.set(0, 1, 0);

scene.add(sun);
scene.add(plane);
window.addEventListener('resize', handleWindowResize, false);//resize scene according to the window size

render();

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

