// ==========================================
// 1. CONFIGURACIÓN EDITABLE
// ==========================================

// Fecha en la que se escaparon y se dieron el beso (Formato: YYYY-MM-DD)
// Reemplaza por el año, mes y día exacto de ese recuerdo especial:
const FECHA_CORRECTA = '2026-09-07'; 

const FRASES_FLORES = [
  "🌻 Mi persona favorita eres tuuu.",
  "✨ Tengo muchas ganas de vertee.",
  "💛 Me encanta cada recuerdo a tu lado, especialmente el día de nuestro primer beso.",
  "🐱 Un día te llenaré de tantas flores que no sabrás dónde ponerlas jsjsjs.",
  "🌟 Eres la casualidad más bonita que me ha pasado en la vida.",
  "🍭 Tu risa y tu compañía son mi lugar seguro.",
  "🌻 Estas flores nunca van a marchitarse, igual que lo que siento por ti."
];

const DULCES_MSGS = [
  "🐱 *Ronroneo* ¡Te amo con todo mi corazoncito!",
  "🍭 ¡Una paletita dulce para la niña más dulce del mundo!",
  "🍫 ¡Un chocolate para alegrarte el día!",
  "🧁 ¡Un cupcake relleno de besitos y abrazos!"
];

// Disposición simétrica de las flores sobre los tallos
const POSICIONES_RAMO = [
  { top: 55, left: 20, rotate: -25 },
  { top: 20, left: 60, rotate: -12 },
  { top: 5,  left: 120, rotate: 0 },
  { top: 20, left: 180, rotate: 12 },
  { top: 55, left: 220, rotate: 25 },
  { top: 65, left: 85, rotate: -5 },
  { top: 65, left: 155, rotate: 5 }
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
// 3. CONTROL DE MÚSICA LOCAL (cancion.mp3)
// ==========================================
function reproducirMusica() {
  if (!bgMusic) return;
  bgMusic.play().then(() => {
    if (musicText) musicText.innerText = "Pausar Flores";
  }).catch((err) => {
    console.log("Reproducción pendiente de interacción:", err);
  });
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play();
      musicText.innerText = "Pausar Flores";
    } else {
      bgMusic.pause();
      musicText.innerText = "Play Flores";
    }
  });
}

// ==========================================
// 4. DESBLOQUEO POR CONTRASEÑA DE FECHA
// ==========================================
unlockBtn.addEventListener('click', () => {
  const fechaSeleccionada = dateInput.value;

  if (!fechaSeleccionada) {
    errorMsg.innerText = "Por favor selecciona una fecha 🥺";
    return;
  }

  if (fechaSeleccionada === FECHA_CORRECTA) {
    lockScreen.classList.remove('active');
    lockScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    mainContent.classList.add('active');

    // Reproduce la música de Latin Mafia de inmediato
    reproducirMusica();
  } else {
    errorMsg.innerText = "Esa no es la fecha amorcito... Recuerda bien ese día 🤫💋";
  }
});

// ==========================================
// 5. GENERACIÓN DEL RAMO INTERACTIVO
// ==========================================
function renderBouquet() {
  bouquetContainer.innerHTML = '';
  FRASES_FLORES.forEach((frase, index) => {
    const flower = document.createElement('span');
    flower.classList.add('flower-item');
    flower.innerText = '🌻';
    flower.title = 'Tócame';

    const pos = POSICIONES_RAMO[index] || { top: 40, left: 120, rotate: 0 };
    flower.style.top = `${pos.top}px`;
    flower.style.left = `${pos.left}px`;
    flower.style.transform = `rotate(${pos.rotate}deg)`;

    flower.addEventListener('click', () => {
      flowerMessage.innerHTML = `<strong>Flor #${index + 1}:</strong> ${frase}`;
      flowerMessage.style.transform = 'scale(1.03)';
      setTimeout(() => flowerMessage.style.transform = 'scale(1)', 200);
    });

    bouquetContainer.appendChild(flower);
  });
}

// ==========================================
// 6. ACCIONES DE GATITOS Y DULCES
// ==========================================
window.petKitty = function() {
  cuteFeedback.innerText = "🐱 *Prrrrr* ¡Miau! Dice que eres el amor de mi vida 💕";
};

window.giveCandy = function(tipo) {
  const aleatorio = DULCES_MSGS[Math.floor(Math.random() * DULCES_MSGS.length)];
  cuteFeedback.innerText = `${tipo} ${aleatorio}`;
};

// ==========================================
// 7. PÉTALOS FLOTANTES CAYENDO
// ==========================================
function createPetal() {
  const container = document.getElementById('petals-container');
  if (!container) return;
  const petal = document.createElement('div');
  petal.classList.add('petal');

  const size = Math.random() * 12 + 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.5}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${Math.random() * 3 + 4}s`;
  petal.style.opacity = (Math.random() * 0.5 + 0.4).toString();

  container.appendChild(petal);
  setTimeout(() => petal.remove(), 7000);
}

setInterval(createPetal, 350);
renderBouquet();