// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100); // Initial camera position

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light setup
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Add multiple directional lights at different angles
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 1).normalize();
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-1, 1, 1).normalize();
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(1, -1, 1).normalize();
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(1, 1, -1).normalize();
scene.add(light4);


// Load STL Files
const loader = new THREE.STLLoader();
const models = [
    'docs/fixfinger.stl', 'docs/forearm.stl', 'docs/movingfinger.stl','docs/shoulder.stl','docs/shoulder2arm.stl','docs/shoulderpitch.stl','docs/support.stl','docs/upperarm.stl','docs/wrist.stl', 'docs/wristhand.stl'
];

const objects = []; // Store loaded STL objects
const boundingBox = new THREE.Box3(); // To calculate the bounding box of all objects

models.forEach((path, index) => {
    loader.load(path, (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        const mesh = new THREE.Mesh(geometry, material);
        objects.push(mesh);
        scene.add(mesh);

        // Update bounding box for each object
        mesh.updateMatrixWorld(); // Ensure the object's matrix is updated
        boundingBox.expandByObject(mesh); // Expand the bounding box to include this object
    });
});

// Function to center the camera on the scene's center
function centerCamera() {
    const center = boundingBox.getCenter(new THREE.Vector3()); // Get the center of the bounding box

    // Adjust camera position based on the size of the bounding box
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const distance = maxDimension * 2; // Camera distance based on the size of the model

    // Set the camera position and look at the center of the objects
    camera.position.set(center.x, center.y, distance);
    camera.lookAt(center); // Focus the camera on the center of the scene
}

// Ensure camera is centered after all objects are loaded
setTimeout(centerCamera, 1000);

// OrbitControls for interactive camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth transitions
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Prevent panning
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Update controls
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
