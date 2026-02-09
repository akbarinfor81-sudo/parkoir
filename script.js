const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Konstanta
const gravity = 0.8;
const jumpStrength = -15;
const playerSpeed = 5;
const obstacleSpeed = 5;

// Player
let player = {
    x: 100,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    velY: 0,
    onGround: true
};

// Obstacles
let obstacles = [];
let score = 0;

// Input
let keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Fungsi update
function update() {
    // Player movement
    if (keys['KeyA']) player.x -= playerSpeed;  // Kiri
    if (keys['KeyD']) player.x += playerSpeed;  // Kanan
    if (keys['Space'] && player.onGround) {    // Lompat
        player.velY = jumpStrength;
        player.onGround = false;
    }

    // Gravitasi
    player.velY += gravity;
    player.y += player.velY;

    // Cek tanah
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velY = 0;
        player.onGround = true;
    }

    // Batas layar
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Update obstacles
    obstacles.forEach((obs, index) => {
        obs.x -= obstacleSpeed;
        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);  // Hapus jika keluar layar
        }
    });

    // Tambah obstacle acak
    if (Math.random() < 0.01) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 100,
            width: 50,
            height: 50
        });
    }

    // Cek tabrakan
    obstacles.forEach(obs => {
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            alert('Game Over! Skor: ' + score);
            resetGame();
        }
    });

    score++;
    scoreElement.textContent = score;
}

// Fungsi draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Gambar obstacles
    ctx.fillStyle = 'black';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

// Reset game
function resetGame() {
    player.x = 100;
    player.y = canvas.height - 100;
    player.velY = 0;
    player.onGround = true;
    obstacles = [];
    score = 0;
}

// Loop game
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
