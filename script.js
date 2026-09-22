// ==========================================
// 1. CONFIGURACIONES EDITABLES (TUS DATOS)
// ==========================================

// Cambia esta fecha por la fecha en que se escaparon y se dieron el beso (Formato: YYYY-MM-DD)
const FECHA_CORRECTA = '2026-09-07'; 

// Frases tiernas para cuando toque cada una de las flores amarillas
const FRASES_FLORES = [
  "🌻 Mi persona favorita eres tuuu.",
  "✨ Tengo muchas ganas de vertee.",
  "💛 Me encanta cada recuerdo a tu lado, especialmente el día de nuestro primer beso.",
  "🐱 Un dia te llenare de tantas flores que no sabras donde ponerlas jsjsjs.",
  "🌟 Eres la casualidad más bonita que me ha pasado en la vida.",
  "🍭 Tu risa y tu compañía son mi lugar seguro.",
  "🌻 Estas flores nunca van a marchitarse, igual que lo que siento por ti."
];

// Reacciones del gatito y los dulces
const DULCES_MSGS = [
  "🐱 *Ronroneo* ¡Te amo con todo mi corazoncito!",
  "🍭 ¡Una paletita dulce para la niña más dulce del mundo!",
  "🍫 ¡Un chocolate para alegrarte el día!",
  "🧁 ¡Un cupcake relleno de besitos y abrazos!"
];

// ==========================================
// 2. ELEMENTOS DEL DOM
// ==========================================
const lockScreen = document.getElementById('lock-screen');
const mainContent = document.getElementById('main-content');
const dateInput = document.getElementById('date-pass');
const unlockBtn = document.getElementById('btn-unlock');
const errorMsg = document.getElementById('error-msg');
const bouquetContainer = document.getElementById('bouquet');
const flowerMessage = document.getElementById('flower-message');
const cuteFeedback = document.getElementById('cute-feedback');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const musicText = document.getElementById('music-text');

// ==========================================
// 3. DESBLOQUEO POR CONTRASEÑA DE FECHA
// ==========================================
unlockBtn.addEventListener('click', () => {
  const fechaSeleccionada = dateInput.value;

  if (!fechaSeleccionada) {
    errorMsg.innerText = "Por favor selecciona una fecha 🥺";
    return;
  }

  if (fechaSeleccionada === FECHA_CORRECTA) {
    // Éxito: ocultar candado y mostrar sorpresa
    lockScreen.classList.remove('active');
    lockScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    mainContent.classList.add('active');

    // Iniciar la música de Latin Mafia automáticamente tras interactuar
    iniciarMusica();
  } else {
    errorMsg.innerText = "Esa no es la fecha amorcito... Recuerda bien ese día 🤫💋";
  }
});
// ==========================================
// CONTROL DE MÚSICA (YOUTUBE EMBED)
// ==========================================
let isPlaying = false;
const iframe = document.getElementById('yt-player');

function toggleMusicaYouTube() {
  if (!iframe) return;
  const command = isPlaying 
    ? '{"event":"command","func":"pauseVideo","args":""}' 
    : '{"event":"command","func":"playVideo","args":""}';
  
  iframe.contentWindow.postMessage(command, '*');
  isPlaying = !isPlaying;
  document.getElementById('music-text').innerText = isPlaying ? "Pausar Flores" : "Play Flores";
}

document.getElementById('music-btn').addEventListener('click', toggleMusicaYouTube);

// ==========================================
// 5. GENERACIÓN DEL RAMO INTERACTIVO
// ==========================================
function renderBouquet() {
  FRASES_FLORES.forEach((frase, index) => {
    const flower = document.createElement('span');
    flower.classList.add('flower');
    flower.innerText = '🌻';
    flower.title = 'Haz clic para leer';

    flower.addEventListener('click', () => {
      flowerMessage.innerHTML = `<strong>Flor #${index + 1}:</strong> ${frase}`;
      flowerMessage.style.transform = 'scale(1.03)';
      setTimeout(() => flowerMessage.style.transform = 'scale(1)', 200);
    });

    bouquetContainer.appendChild(flower);
  });
}

// ==========================================
// 6. ACCIONES DE GATITO Y DULCES
// ==========================================
window.petKitty = function() {
  cuteFeedback.innerText = "🐱 *Prrrrr* ¡Miau! Dice que eres el amor de mi vida 💕";
};

window.giveCandy = function(tipo) {
  const aleatorio = DULCES_MSGS[Math.floor(Math.random() * DULCES_MSGS.length)];
  cuteFeedback.innerText = `${tipo} ${aleatorio}`;
};

// ==========================================
// 7. LLUVIA DE PÉTALOS AMARILLOS
// ==========================================
function createPetal() {
  const container = document.getElementById('petals-container');
  const petal = document.createElement('div');
  petal.classList.add('petal');

  const size = Math.random() * 12 + 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.5}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${Math.random() * 3 + 4}s`;
  petal.style.opacity = (Math.random() * 0.5 + 0.4).toString();

  container.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 7000);
}

setInterval(createPetal, 350);

// Inicializar el ramo al cargar
renderBouquet();