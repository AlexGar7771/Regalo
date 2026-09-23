// ==========================================
// 1. CONFIGURACIÓN Y SUPABASE
// ==========================================
// Cambia esto por la fecha real de su beso (YYYY-MM-DD)
const FECHA_CORRECTA = '2026-09-07'; 

// Conexión directa a tu proyecto de Supabase
const supabaseUrl = 'https://cdblyqtxpuxnhwbxykfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkYmx5cXR4cHV4bmh3Ynh5a2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMDgxMjksImV4cCI6MjA5OTc4NDEyOX0.XMozUuwLYLz3vB8UokwLNX-E-wJZr4QdVnkcVynvnjk';
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

const FRASES_FLORES = [
  "🌻 Mi persona favorita siempre eres y serás tú.",
  "✨ Tengo muchas ganas de verte y darte un abrazote.",
  "💛 Me encanta cada momento a tu lado, especialmente el día de nuestro primer beso.",
  "🐱 Un día te llenaré de tantas flores reales que no sabrás dónde ponerlas.",
  "🌟 Eres la casualidad más bonita que me pasó en la vida.",
  "🍭 Tu risa y tu compañía son mi lugar seguro.",
  "🌻 Estas flores nunca van a marchitarse, igual que todo mi amor por ti."
];

const DULCES_MSGS = [
  "🐱 *Ronroneo* ¡Te amo con todo mi corazoncito!",
  "🍭 ¡Una paletita dulce para la niña más preciosa!",
  "🍫 ¡Un chocolate para alegrarte el día!",
  "☕ ¡Un cafecito caliente con muchos besitos!"
];

const POSICIONES_RAMO = [
  { top: 55, left: 15, rotate: -25 },
  { top: 20, left: 55, rotate: -12 },
  { top: 5,  left: 115, rotate: 0 },
  { top: 20, left: 175, rotate: 12 },
  { top: 55, left: 215, rotate: 25 },
  { top: 65, left: 80, rotate: -5 },
  { top: 65, left: 150, rotate: 5 }
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
const muralNotas = document.getElementById('mural-notas');
const nuevaNotaTxt = document.getElementById('nueva-nota-txt');
const notaAutor = document.getElementById('nota-autor');
const listaRetos = document.getElementById('lista-retos');
const nuevoRetoTxt = document.getElementById('nuevo-reto-txt');
const toastNotif = document.getElementById('toast-notif');

// ==========================================
// 3. MÚSICA LOCAL (cancion.mp3)
// ==========================================
function reproducirMusica() {
  if (!bgMusic) return;
  bgMusic.play().then(() => {
    musicText.innerText = "Pausar Música";
  }).catch(() => {
    musicText.innerText = "Play Música";
  });
}

musicBtn.addEventListener('click', () => {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play();
    musicText.innerText = "Pausar Música";
  } else {
    bgMusic.pause();
    musicText.innerText = "Play Música";
  }
});

// ==========================================
// 4. DESBLOQUEO POR FECHA
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

    reproducirMusica();
    cargarNotitasCloud();
    cargarRetosCloud();
    renderBouquet();
    suscribirTiempoReal();
  } else {
    errorMsg.innerText = "Esa no es la fecha amorcito... Recuerda bien ese día 🤫💋";
  }
});

// ==========================================
// 5. CAMBIO DE PESTAÑAS
// ==========================================
window.cambiarVista = function(vista) {
  document.querySelectorAll('.tab-view').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  const vistaActiva = document.getElementById(`vista-${vista}`);
  if (vistaActiva) {
    vistaActiva.classList.remove('hidden');
    vistaActiva.classList.add('active');
  }

  const botonActivo = Array.from(document.querySelectorAll('.tab-btn')).find(b => 
    b.getAttribute('onclick').includes(vista)
  );
  if (botonActivo) botonActivo.classList.add('active');
};

// ==========================================
// 6. NOTITAS CON SUPABASE (SINCRONIZADAS)
// ==========================================
async function cargarNotitasCloud() {
  const { data, error } = await db
    .from('notas_pareja')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return;

  muralNotas.innerHTML = '';
  data.forEach(nota => {
    const postIt = document.createElement('div');
    postIt.className = `post-it ${nota.color}`;
    postIt.innerHTML = `
      <div class="note-text">${nota.texto}</div>
      <div class="note-footer">
        <span>${nota.autor} • <small>${nota.fecha}</small></span>
        <button class="btn-del-note" onclick="borrarNotitaCloud(${nota.id})" title="Borrar nota">✕</button>
      </div>
    `;
    muralNotas.appendChild(postIt);
  });
}

window.agregarNotita = async function() {
  const texto = nuevaNotaTxt.value.trim();
  if (!texto) {
    alert("Escribe algo lindo primero 💕");
    return;
  }

  const autor = notaAutor.value;
  // Morado para el casi inge, azulito para corazón de melón
  const color = autor.includes("casi inge") ? "color-morado" : "color-azul";
  
  const hoy = new Date();
  const fechaStr = `${hoy.getDate()}/${hoy.getMonth() + 1}`;

  const btn = document.getElementById('btn-publicar-nota');
  btn.disabled = true;
  btn.innerText = "Pegando...";

  const { error } = await db.from('notas_pareja').insert([{
    texto: texto,
    autor: autor,
    color: color,
    fecha: fechaStr
  }]);

  btn.disabled = false;
  btn.innerText = "Pegar Notita 📌";

  if (!error) {
    nuevaNotaTxt.value = '';
    cargarNotitasCloud();
  } else {
    alert("Error al guardar: " + error.message);
  }
};

window.borrarNotitaCloud = async function(id) {
  if (!confirm("¿Quieres quitar esta notita?")) return;
  await db.from('notas_pareja').delete().eq('id', id);
  cargarNotitasCloud();
};

// ==========================================
// 7. RETOS / DESEOS COMPARTIDOS
// ==========================================
async function cargarRetosCloud() {
  const { data, error } = await db
    .from('retos_pareja')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return;

  listaRetos.innerHTML = '';
  if (data.length === 0) {
    listaRetos.innerHTML = '<p style="color:#64748b;font-size:13px;text-align:center;">Aún no tienen planes guardados. ¡Agreguen uno arriba! ✨</p>';
    return;
  }

  data.forEach(reto => {
    const item = document.createElement('div');
    item.className = `todo-item ${reto.completado ? 'done' : ''}`;
    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <button class="todo-check-btn" onclick="toggleReto(${reto.id}, ${reto.completado})">
          ${reto.completado ? '✓' : ''}
        </button>
        <span style="font-size:14px;font-weight:600;">${reto.titulo}</span>
      </div>
      <button class="btn-del-note" onclick="borrarReto(${reto.id})">✕</button>
    `;
    listaRetos.appendChild(item);
  });
}

window.agregarReto = async function() {
  const txt = nuevoRetoTxt.value.trim();
  if (!txt) return;

  await db.from('retos_pareja').insert([{ titulo: txt, completado: false }]);
  nuevoRetoTxt.value = '';
  cargarRetosCloud();
};

window.toggleReto = async function(id, estadoActual) {
  await db.from('retos_pareja').update({ completado: !estadoActual }).eq('id', id);
  cargarRetosCloud();
};

window.borrarReto = async function(id) {
  await db.from('retos_pareja').delete().eq('id', id);
  cargarRetosCloud();
};

// ==========================================
// 8. INTERACCIÓN "PENSANDO EN TI" (BROADCAST)
// ==========================================
let canalRealtime = null;

function suscribirTiempoReal() {
  // Suscripción a cambios en la base de datos
  db.channel('cambios-db')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notas_pareja' }, () => cargarNotitasCloud())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'retos_pareja' }, () => cargarRetosCloud())
    .subscribe();

  // Canal para mensajes instantáneos entre teléfonos
  canalRealtime = db.channel('canal-pareja');
  canalRealtime
    .on('broadcast', { event: 'pensando_en_ti' }, (payload) => {
      mostrarNotificacion(payload.payload.mensaje);
    })
    .subscribe();
}

window.enviarPensandoEnTi = function() {
  const autor = notaAutor.value.includes("casi inge") ? "Tu casi inge 🐱" : "Tu corazón de melón 💙";
  const msg = `💓 ¡${autor} está pensando en ti justo en este instante!`;
  
  if (canalRealtime) {
    canalRealtime.send({
      type: 'broadcast',
      event: 'pensando_en_ti',
      payload: { mensaje: msg }
    });
  }

  mostrarNotificacion("¡Latido enviado con éxito a su pantalla! 💕");
};

function mostrarNotificacion(texto) {
  toastNotif.innerText = texto;
  toastNotif.classList.remove('hidden');
  setTimeout(() => toastNotif.classList.add('hidden'), 4000);
}

// ==========================================
// 9. RAMO DE FLORES
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

// Mimos
window.petKitty = function() {
  cuteFeedback.innerText = "🐱 *Prrrrr* ¡Miau! Dice que eres el amor de mi vida 💕";
};

window.giveCandy = function(tipo) {
  const aleatorio = DULCES_MSGS[Math.floor(Math.random() * DULCES_MSGS.length)];
  cuteFeedback.innerText = `${tipo} ${aleatorio}`;
};

// Destellos
function createSparkle() {
  const container = document.getElementById('sparkles-container');
  if (!container) return;
  const item = document.createElement('div');
  item.classList.add('sparkle');
  
  const iconos = ['✨', '💙', '⭐', '🐾'];
  item.innerText = iconos[Math.floor(Math.random() * iconos.length)];
  item.style.left = `${Math.random() * 100}vw`;
  item.style.animationDuration = `${Math.random() * 3 + 5}s`;
  item.style.opacity = (Math.random() * 0.4 + 0.3).toString();

  container.appendChild(item);
  setTimeout(() => item.remove(), 8000);
}

setInterval(createSparkle, 600);