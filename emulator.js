// Ensure you have included jsnes in your project
const canvas = document.getElementById('nes-canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(256, 240);

// Initialize JS.NES
const nes = new jsnes.NES({
    onFrame: function(frameBuffer) {
        // frameBuffer is an array of 256*320 integers (RGB values)
        for (let i = 0; i < frameBuffer.length; i++) {
            let pixel = frameBuffer[i];
            imageData.data[i * 4] = (pixel >> 16) & 0xFF;     // Red
            imageData.data[i * 4 + 1] = (pixel >> 8) & 0xFF;  // Green
            imageData.data[i * 4 + 2] = pixel & 0xFF;         // Blue
            imageData.data[i * 4 + 3] = 255;                  // Alpha
        }
        ctx.putImageData(imageData, 0, 0);
    },
    onAudioSample: function(left, right) {
        // Optional: Pipe audio samples into the Web Audio API
    }
});

// Handle ROM Upload
document.getElementById('rom-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const romData = new Uint8Array(arrayBuffer);
        
        // Convert array to binary string required by jsnes loader
        let romString = "";
        for (let i = 0; i < romData.length; i++) {
            romString += String.fromCharCode(romData[i]);
        }

        nes.loadROM(romString);
        requestAnimationFrame(runEmulator);
    };
    reader.readAsArrayBuffer(file);
});

// Main Emulator Loop
function runEmulator() {
    nes.frame();
    requestAnimationFrame(runEmulator);
}

// Handle Keyboard Input (Controller Mapping)
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
    if (e.key === 'ArrowDown') nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
    if (e.key === 'ArrowLeft') nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
    if (e.key === 'ArrowRight') nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
    if (e.key === 'x') nes.buttonDown(1, jsnes.Controller.BUTTON_A);
    if (e.key === 'z') nes.buttonDown(1, jsnes.Controller.BUTTON_B);
    if (e.key === 'Enter') nes.buttonDown(1, jsnes.Controller.BUTTON_START);
    if (e.key === 'Shift') nes.buttonDown(1, jsnes.Controller.BUTTON_SELECT);
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
    if (e.key === 'ArrowDown') nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
    if (e.key === 'ArrowLeft') nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
    if (e.key === 'ArrowRight') nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
    if (e.key === 'x') nes.buttonUp(1, jsnes.Controller.BUTTON_A);
    if (e.key === 'z') nes.buttonUp(1, jsnes.Controller.BUTTON_B);
    if (e.key === 'Enter') nes.buttonUp(1, jsnes.Controller.BUTTON_START);
    if (e.key === 'Shift') nes.buttonUp(1, jsnes.Controller.BUTTON_SELECT);
});