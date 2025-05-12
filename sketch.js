let rotationX = 0;
let rotationY = 0;
let binocularMask;
let time = 0;

function preload() {
    binocularMask = loadImage('binocular-mask.png');
}

function setup() {
    let canvas = createCanvas(1280, 720, WEBGL);
    canvas.parent('sketch-holder');
    noStroke();
    perspective(PI/3.0, width/height, 1, 5000);
}

function draw() {
    background(0);
    time += 0.05;
    
    // Calculate rotation based on mouse position
    rotationY = map(mouseX, 0, width, -PI/4, PI/4);
    rotationX = map(mouseY, 0, height, -PI/4, PI/4);
    
    // Apply rotation
    rotateX(rotationX);
    rotateY(rotationY);
    
    // Draw the "world" - expanded colored grid
    push();
    translate(0, 0, -1200);
    
    // Add vertical variation (y-axis)
    for(let y = -300; y <= 300; y += 150) {
        for(let x = -1200; x <= 1200; x += 100) {
            for(let z = -1500; z <= 1500; z += 100) {
                push();
                // Add subtle floating motion
                let yOffset = sin(time + x/100) * 10;
                let boxScale = map(sin(time + z/200), -1, 1, 0.8, 1.2);
                
                translate(x, y + yOffset, z);
                
                // Digital color palette with slower changes
                let hue = (time * 5 + x/100 + z/100) % 360; // Slowed rotation and spatial variation
                let distFromCenter = dist(x, y, z, 0, 0, 0);
                let brightness = map(sin(time/2 + distFromCenter/200), -1, 1, 0.3, 1);
                
                // Create digital color patterns with slower transitions
                let r = map(sin(hue/2 + time), -1, 1, 0, 255) * brightness;
                let g = map(sin(hue/2 + time + PI/2), -1, 1, 0, 255) * brightness;
                let b = map(cos(hue/2 + time), -1, 1, 100, 255) * brightness;
                
                // Reduced frequency of "glitch" effect
                if(random(1) < 0.002) {
                    r = 255;
                    g = 255;
                    b = 255;
                }
                
                fill(r, g, b);
                
                // Animate box size
                box(15 * boxScale);
                pop();
            }
        }
    }
    pop();
        
    // Apply dark tint for overlay
    tint(0, 0, 0, 255);
    
    // Draw the overlay
    push();
    camera(0, 0, height/2/tan(PI/6), 0, 0, 0, 0, 1, 0);
    ortho(-width/2, width/2, -height/2, height/2);
    translate(-width/2, -height/2, 0);
    imageMode(CORNER);
    image(binocularMask, 0, 0, width, height);
    pop();
}