import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let arr = [1];
const arrayInput = document.getElementById("array-input");

arrayInput.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        try {
            arr = JSON.parse(arrayInput.value);
            for (let i = 0; i < arr.length*2; i++) {
                createCubes(arr);
              }
        } catch (error) {
            console.log("Input is not an array !");
        }
        console.log(arr);
    }
})

// Connector

function createCubes(array) {
    scene.children.forEach(child => {
        if (child.geometry instanceof THREE.BoxGeometry) {
            scene.remove(child);
        }
    });  
    
    // Create cubes
    array.forEach((subArray, subIndex) => {
        subArray.forEach((innerArray, outerIndex) => {
            innerArray.forEach((values, innerIndex) => {
                const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
                const cubeMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0xffffff,
                    map: minecraftGlass,
                    metalness: 0.5, 
                    roughness: 0.2,
                    alphaTest: 0.1,
                });
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                cube.receiveShadow = true;
                const xPos = innerIndex ;
                const yPos = outerIndex;
                const zPos = subIndex; 
                cube.position.set(xPos, yPos, zPos);
                cube.userData.isCube = true; // Flag to identify cubes for raycasting
                
                // Create sprite
                const spriteCanvas = document.createElement('canvas');
                spriteCanvas.width = 64; 
                spriteCanvas.height = 64; 
                const spriteContext = spriteCanvas.getContext('2d');
                spriteContext.font = '20px Arial';
                spriteContext.fillStyle = 'gray';
                spriteContext.fillText(values, 25, 35); 
                
                const spriteTexture = new THREE.CanvasTexture(spriteCanvas);
                spriteTexture.needsUpdate = true;
                
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: spriteTexture,
                    depthTest: false  });
                const sprite = new THREE.Sprite(spriteMaterial);
                cube.add(sprite); // Attach sprite to cube
                
                scene.add(cube);
            });
        });
    });
}


// THREE

const scene = new THREE.Scene();
const fogColor = 0x000000;
const fogNear = 1; 
const fogFar = 100; 
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(3, 5, 5);
camera.lookAt(0, 0, 0);

const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const controls = new OrbitControls( camera, renderer.domElement );

var ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
scene.add(ambientLight);

// Create a spotlight
const spotlight = new THREE.SpotLight(0xffffff, 50);
spotlight.position.set(0, 10, 0); // Position the spotlight
spotlight.angle = Math.PI / 6; // Set the spotlight angle
spotlight.penumbra = 0.5; // Softens the edges of the spotlight
spotlight.decay = 2; // How the light intensity attenuates over distance
spotlight.distance = 200; // The distance at which the light intensity is zero
spotlight.castShadow = true; // Enable shadow casting
scene.add(spotlight);

// Helper to visualize the spotlight
// const spotlightHelper = new THREE.SpotLightHelper(spotlight);
// scene.add(spotlightHelper);

// Create a point light
const pointLightBottom = new THREE.PointLight(0xffffff, 5); // color, intensity
pointLightBottom.position.set(0, 0, 0); 
scene.add(pointLightBottom);

const pointLightLeft = new THREE.PointLight(0xffffff, 5); // color, intensity
pointLightLeft.position.set(5, 5, 0); 
scene.add(pointLightLeft);

const pointLightRight = new THREE.PointLight(0xffffff, 5); // color, intensity
pointLightRight.position.set(-5, 5, 0); // Adjust position for the right
scene.add(pointLightRight);

const pointLightFront = new THREE.PointLight(0xffffff, 5); // color, intensity
pointLightFront.position.set(0, 5, -5); // Adjust position for the front
scene.add(pointLightFront);

const pointLightBack = new THREE.PointLight(0xffffff, 5); // color, intensity
pointLightBack.position.set(0, 5, 5); // Adjust position for the back
scene.add(pointLightBack);

const textureLoader = new THREE.TextureLoader();
const minecraftGlass = textureLoader.load('../assets/glass.png');

const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    map: minecraftGlass,
    metalness: 0.5, 
    roughness: 0.2,
    alphaTest: 0.1,
});
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( cube );

const groundGeometry = new THREE.PlaneGeometry(100, 100); 
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x000, }); 

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; 
ground.position.y -= 0.5;
ground.receiveShadow = true;
scene.add(ground);

// Y-axis line
const yPoints = [];
yPoints.push(new THREE.Vector3(0, 0, 0)); // Start point (at origin)
yPoints.push(new THREE.Vector3(0, 10, 0)); // End point (along the y-axis)
const yLineMaterial = new THREE.LineBasicMaterial({ color: 0xBCF5A6 }); // Line color
const yLineGeometry = new THREE.BufferGeometry().setFromPoints(yPoints);
const yLine = new THREE.Line(yLineGeometry, yLineMaterial);
scene.add(yLine);

// X-axis line
const xPoints = [];
xPoints.push(new THREE.Vector3(-10, 0, 0)); // Start point (at origin)
xPoints.push(new THREE.Vector3(10, 0, 0)); // End point (along the x-axis)
const xLineMaterial = new THREE.LineBasicMaterial({ color: 0xDB6A6C }); // Line color
const xLineGeometry = new THREE.BufferGeometry().setFromPoints(xPoints);
const xLine = new THREE.Line(xLineGeometry, xLineMaterial);
scene.add(xLine);

// Z-axis line
const zPoints = [];
zPoints.push(new THREE.Vector3(0, 0, -10)); // Start point (at origin)
zPoints.push(new THREE.Vector3(0, 0, 10)); // End point (along the z-axis)
const zLineMaterial = new THREE.LineBasicMaterial({ color: 0x658CBB }); // Line color
const zLineGeometry = new THREE.BufferGeometry().setFromPoints(zPoints);
const zLine = new THREE.Line(zLineGeometry, zLineMaterial);
scene.add(zLine);

function animate() {
	requestAnimationFrame( animate );
    controls.update();
	renderer.render( scene, camera );
}
animate();

