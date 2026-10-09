// ==========================================
// 1. CONFIGURACIÓN Y SUPABASE BLINDADO
// ==========================================
const FECHA_CORRECTA = '2026-09-07'; 

let db = null;
try {
  const supabaseUrl = 'https://udwtfwicbwpdbxefnmth.supabase.co';
  const supabaseKey = 'sb_publishable_S582CVeyAW6QzN_5RwTXRA_cFBxQloI';
  if (window.supabase) {
    db = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.warn("Supabase no disponible, usando modo local:", e);
}

const FRASES_FLORES = [
  "🌻 Mi persona favorita siempre eres y serás tú.",
  "✨ ¡Feliz aniversario! Gracias por hacerme el novio más feliz del mundo.",
  "💛 Me encanta cada recuerdo a tu lado, especialmente el día de nuestro primer beso.",
  "🐱 Un día te llenaré de tantas flores reales que no sabrás dónde ponerlas.",
  "🌟 Eres la casualidad más hermosa que me pasó en la vida.",
  "🍭 Tu risa y tu compañía son mi lugar seguro.",
  "🌻 Estas flores nunca van a marchitarse, igual que todo mi amor por ti."
];

const DULCES_MSGS = [
  "🐱 *Ronroneo* ¡Feliz aniversario, amor de mi vida!",
  "🍭 ¡Una paletita dulce para la niña más preciosa del mundo!",
  "🍫 ¡Un chocolate para festejar nuestro amor!",
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
// 2. DESBLOQUEO FLEXIBLE Y BYPASS
// ==========================================
window.intentarDesbloquear = function() {
  const input = document.getElementById('date-pass');
  const errorMsg = document.getElementById('error-msg');
  const val = input ? input.value.trim() : '';

  if (!val) {
    if (errorMsg) errorMsg.innerText = "Selecciona una fecha o pulsa el botón rosa de abajo 🥺";
    return;
  }

  // Comprobar formato flexible
  const esValida = 
    val === '2026-09-07' || 
    val === '2024-09-07' || 
    val === '07/09/2026' || 
    val === '7/9/2026' || 
    val.includes('09-07') || 
    val.includes('07-09');

  if (esValida) {
    ejecutarEntrada();
  } else {
    if (errorMsg) errorMsg.innerText = "Esa no es la fecha amorcito... Recuerda bien ese día 🤫💋";
  }
};

window.desbloquearDirecto = function() {
  ejecutarEntrada();
};

function ejecutarEntrada() {
  const lock = document.getElementById('lock-screen');
  const main = document.getElementById('main-content');
  if (lock) {
    lock.classList.remove('active');
    lock.classList.add('hidden');
  }
  if (main) {
    main.classList.remove('hidden');
    main.classList.add('active');
  }

  try { actualizarContador(); } catch (_) {}
  try { cargarNotitasCloud(); } catch (_) {}
  try { cargarRetosCloud(); } catch (_) {}
  try { cargarDibujosCloud(); } catch (_) {}
  try { cargarCancionesCloud(); } catch (_) {}
  try { cargarCartitasLocal(); } catch (_) {}
  try { renderBouquet(); } catch (_) {}
  try { suscribirTiempoReal(); } catch (_) {}
}

// ==========================================
// 3. CONTADOR DE ANIVERSARIO
// ==========================================
function actualizarContador() {
  const fechaInicio = new Date('2026-09-07T00:00:00');
  const ahora = new Date();
  
  let diferencia = ahora - fechaInicio;
  if (diferencia < 0) diferencia = 0;

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / 1000 / 60) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  const elDias = document.getElementById('dias-juntos');
  const elHoras = document.getElementById('horas-juntos');
  const elMinutos = document.getElementById('minutos-juntos');
  const elSegundos = document.getElementById('segundos-juntos');

  if (elDias) elDias.innerText = dias;
  if (elHoras) elHoras.innerText = horas;
  if (elMinutos) elMinutos.innerText = minutos;
  if (elSegundos) elSegundos.innerText = segundos;
}
setInterval(actualizarContador, 1000);

// ==========================================
// 4. NAVEGACIÓN ENTRE PESTAÑAS
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
    b.getAttribute('onclick') && b.getAttribute('onclick').includes(vista)
  );
  if (botonActivo) botonActivo.classList.add('active');

  if (vista === 'dibujo') {
    setTimeout(inicializarPizarra, 80);
  }
};

// ==========================================
// 5. PIZARRA CON PINCEL, BORRADOR Y RELLENO
// ==========================================
let canvas, ctx;
let dibujando = false;
let herramientaActual = 'brush';
let pizarraInicializada = false;

window.seleccionarHerramienta = function(herramienta) {
  herramientaActual = herramienta;
  document.querySelectorAll('.tools-group .tool-btn').forEach(b => {
    if (b.id && b.id.startsWith('tool-')) b.classList.remove('active');
  });
  
  const btn = document.getElementById(`tool-${herramienta}`);
  if (btn) btn.classList.add('active');

  const txt = document.getElementById('current-tool-txt');
  if (txt) {
    txt.innerText = herramienta === 'brush' ? 'Pincel' : (herramienta === 'eraser' ? 'Borrador' : 'Bote de Relleno');
  }
};

function inicializarPizarra() {
  canvas = document.getElementById('paint-canvas');
  if (!canvas) return;

  const wrapper = canvas.parentElement;
  const w = wrapper ? wrapper.clientWidth : 340;
  const h = wrapper ? wrapper.clientHeight : 320;

  if (canvas.width !== w || canvas.height !== h) {
    const tempImage = ctx ? canvas.toDataURL() : null;
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (tempImage) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = tempImage;
    }
  }

  if (pizarraInicializada) return;
  pizarraInicializada = true;

  function getCoords(e) {
    const r = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - r.left) * (canvas.width / r.width),
      y: (clientY - r.top) * (canvas.height / r.height)
    };
  }

  function start(e) {
    const pos = getCoords(e);
    if (herramientaActual === 'fill') {
      rellenarCanvas(Math.floor(pos.x), Math.floor(pos.y));
      return;
    }

    dibujando = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!dibujando || herramientaActual === 'fill') return;
    if (e.cancelable) e.preventDefault();
    const pos = getCoords(e);

    if (herramientaActual === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = parseInt(document.getElementById('draw-size').value) * 2.5;
    } else {
      ctx.strokeStyle = document.getElementById('draw-color').value;
      ctx.lineWidth = document.getElementById('draw-size').value;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stop() {
    dibujando = false;
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stop);

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stop);
}

function rellenarCanvas(startX, startY) {
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const hex = document.getElementById('draw-color').value;
    const fillColor = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
      255
    ];

    const startIndex = (startY * canvas.width + startX) * 4;
    const startColor = [
      data[startIndex],
      data[startIndex + 1],
      data[startIndex + 2],
      data[startIndex + 3]
    ];

    if (coloresIguales(startColor, fillColor)) return;

    const pixelStack = [[startX, startY]];
    const width = canvas.width;
    const height = canvas.height;

    while (pixelStack.length > 0) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      let pixelPos = (y * width + x) * 4;
      while (y >= 0 && matchColor(data, pixelPos, startColor)) {
        y--;
        pixelPos -= width * 4;
      }
      pixelPos += width * 4;
      y++;

      let reachLeft = false;
      let reachRight = false;

      while (y < height && matchColor(data, pixelPos, startColor)) {
        data[pixelPos] = fillColor[0];
        data[pixelPos + 1] = fillColor[1];
        data[pixelPos + 2] = fillColor[2];
        data[pixelPos + 3] = 255;

        if (x > 0) {
          if (matchColor(data, pixelPos - 4, startColor)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < width - 1) {
          if (matchColor(data, pixelPos + 4, startColor)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        y++;
        pixelPos += width * 4;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error("Error al rellenar:", err);
  }
}

function matchColor(data, pos, color) {
  return (
    Math.abs(data[pos] - color[0]) < 30 &&
    Math.abs(data[pos + 1] - color[1]) < 30 &&
    Math.abs(data[pos + 2] - color[2]) < 30
  );
}

function coloresIguales(c1, c2) {
  return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
}

window.limpiarCanvas = function() {
  if (!canvas || !ctx) return;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// GUARDAR DIBUJOS (SUPABASE + LOCAL STORAGE)
window.guardarDibujoWeb = async function() {
  if (!canvas) return;

  const dataUrl = canvas.toDataURL('image/png');
  const autorEl = document.getElementById('nota-autor');
  const autor = autorEl ? autorEl.value : "Nosotros";
  const hoy = new Date();
  const fechaStr = `${hoy.getDate()}/${hoy.getMonth() + 1}`;

  const nuevoDibujo = {
    id: Date.now(),
    imagen_data: dataUrl,
    autor: autor,
    fecha: fechaStr
  };

  // Guardar en LocalStorage siempre como seguro
  let locales = JSON.parse(localStorage.getItem('dibujos_respaldo') || '[]');
  locales.unshift(nuevoDibujo);
  localStorage.setItem('dibujos_respaldo', JSON.stringify(locales));

  // Guardar en Supabase si está disponible
  if (db) {
    try {
      await db.from('dibujos_pareja').insert([{
        imagen_data: dataUrl,
        autor: autor,
        fecha: fechaStr
      }]);
    } catch (_) {}
  }

  alert("¡Dibujito guardado con éxito! 🎨💖");
  cargarDibujosCloud();
};

async function cargarDibujosCloud() {
  const contenedor = document.getElementById('mural-dibujos');
  if (!contenedor) return;

  let dibujos = [];
  if (db) {
    try {
      const { data, error } = await db.from('dibujos_pareja').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        dibujos = data;
      }
    } catch (_) {}
  }

  if (dibujos.length === 0) {
    dibujos = JSON.parse(localStorage.getItem('dibujos_respaldo') || '[]');
  }

  contenedor.innerHTML = '';
  if (dibujos.length === 0) {
    contenedor.innerHTML = '<p style="color:#64748b;font-size:13px;text-align:center;grid-column:1/-1;">Aún no hay dibujos guardados en la web. ¡Crea uno arriba! ✨</p>';
    return;
  }

  dibujos.forEach(d => {
    const card = document.createElement('div');
    card.className = 'drawing-item-card';
    card.innerHTML = `
      <img src="${d.imagen_data}" class="drawing-item-img" alt="Dibujito">
      <div class="drawing-item-footer">
        <span>${d.autor} • ${d.fecha}</span>
        <button class="btn-del-note" onclick="borrarDibujoCloud(${d.id})">🗑️</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

window.borrarDibujoCloud = async function(id) {
  if (!confirm("¿Deseas eliminar este dibujo?")) return;

  let locales = JSON.parse(localStorage.getItem('dibujos_respaldo') || '[]');
  locales = locales.filter(d => d.id !== id);
  localStorage.setItem('dibujos_respaldo', JSON.stringify(locales));

  if (db) {
    try { await db.from('dibujos_pareja').delete().eq('id', id); } catch (_) {}
  }
  cargarDibujosCloud();
};

// ==========================================
// 6. CANCIONES COMPARTIDAS
// ==========================================
async function cargarCancionesCloud() {
  const contenedor = document.getElementById('lista-canciones');
  if (!contenedor) return;

  let canciones = [];
  if (db) {
    try {
      const { data, error } = await db.from('canciones_pareja').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        canciones = data;
      }
    } catch (_) {}
  }

  if (canciones.length === 0) {
    canciones = JSON.parse(localStorage.getItem('canciones_respaldo') || '[]');
  }

  contenedor.innerHTML = '';
  if (canciones.length === 0) {
    contenedor.innerHTML = '<p style="color:#64748b;font-size:13px;text-align:center;">Aún no han dedicado canciones. ¡Agrega una arriba! 🎵</p>';
    return;
  }

  canciones.forEach(c => {
    const item = document.createElement('div');
    item.className = 'song-card';
    const botonLink = c.enlace 
      ? `<a href="${c.enlace}" target="_blank" rel="noopener noreferrer" class="song-link-btn">Escuchar ↗</a>`
      : '';

    item.innerHTML = `
      <div class="song-info">
        <span class="song-title">🎶 ${c.titulo}</span>
        <span class="song-author">Dedicada por: ${c.autor}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        ${botonLink}
        <button class="btn-del-note" onclick="borrarCancionCloud(${c.id})">✕</button>
      </div>
    `;
    contenedor.appendChild(item);
  });
}

window.agregarCancion = async function() {
  const tituloEl = document.getElementById('cancion-titulo');
  const linkEl = document.getElementById('cancion-link');
  const autorEl = document.getElementById('cancion-autor');

  const titulo = tituloEl ? tituloEl.value.trim() : '';
  const link = linkEl ? linkEl.value.trim() : '';
  const autor = autorEl ? autorEl.value : 'Nosotros';

  if (!titulo) {
    alert("Por favor escribe el nombre de la canción 💕");
    return;
  }

  const nueva = { id: Date.now(), titulo: titulo, enlace: link, autor: autor };
  let canciones = JSON.parse(localStorage.getItem('canciones_respaldo') || '[]');
  canciones.unshift(nueva);
  localStorage.setItem('canciones_respaldo', JSON.stringify(canciones));

  if (db) {
    try {
      await db.from('canciones_pareja').insert([{ titulo: titulo, enlace: link, autor: autor }]);
    } catch (_) {}
  }

  if (tituloEl) tituloEl.value = '';
  if (linkEl) linkEl.value = '';
  cargarCancionesCloud();
};

window.borrarCancionCloud = async function(id) {
  if (!confirm("¿Deseas quitar esta canción?")) return;

  let canciones = JSON.parse(localStorage.getItem('canciones_respaldo') || '[]');
  canciones = canciones.filter(c => c.id !== id);
  localStorage.setItem('canciones_respaldo', JSON.stringify(canciones));

  if (db) {
    try { await db.from('canciones_pareja').delete().eq('id', id); } catch (_) {}
  }
  cargarCancionesCloud();
};

// ==========================================
// 7. CARTITAS
// ==========================================
function obtenerCartitas() {
  const data = localStorage.getItem('pareja_cartitas');
  return data ? JSON.parse(data) : [
    {
      id: 1,
      titulo: "Nuestra Primera Carta",
      contenido: "Esta es la primera carta de aniversario para recordarte lo mucho que significas para mí. ¡Te amo con todo mi corazón!",
      icono: "💌",
      fecha: "07/09/2026"
    }
  ];
}

function cargarCartitasLocal() {
  const contenedor = document.getElementById('contenedor-cartas');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  const cartas = obtenerCartitas();

  cartas.forEach(c => {
    const card = document.createElement('div');
    card.className = 'sobre-card';
    card.innerHTML = `
      <div class="sobre-icono">${c.icono}</div>
      <div class="sobre-titulo">${c.titulo}</div>
      <div class="sobre-fecha">${c.fecha}</div>
    `;
    card.onclick = () => abrirCarta(c);
    contenedor.appendChild(card);
  });
}

function abrirCarta(carta) {
  const contenedor = document.getElementById('contenedor-cartas');
  const existente = document.getElementById('detalle-carta-abierta');
  if (existente) existente.remove();

  const preview = document.createElement('div');
  preview.id = 'detalle-carta-abierta';
  preview.className = 'carta-abierta';
  preview.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <h3 style="color:#be185d;">${carta.icono} ${carta.titulo}</h3>
      <button class="btn-del-note" onclick="document.getElementById('detalle-carta-abierta').remove()">✕</button>
    </div>
    <p style="white-space:pre-wrap; line-height:1.7; font-size:14px; color:#334155;">${carta.contenido}</p>
    <div style="text-align:right; margin-top:12px; font-size:11px; color:#94a3b8;">Fecha: ${carta.fecha}</div>
  `;
  contenedor.parentNode.insertBefore(preview, contenedor.nextSibling);
}

window.guardarCartita = function() {
  const tituloEl = document.getElementById('carta-titulo');
  const contenidoEl = document.getElementById('carta-contenido');
  const iconoEl = document.getElementById('carta-icono');

  const titulo = tituloEl ? tituloEl.value.trim() : '';
  const contenido = contenidoEl ? contenidoEl.value.trim() : '';
  const icono = iconoEl ? iconoEl.value : '💌';

  if (!titulo || !contenido) {
    alert("Por favor ponle un título y mensaje a la carta 💕");
    return;
  }

  const hoy = new Date();
  const nuevaCarta = {
    id: Date.now(),
    titulo: titulo,
    contenido: contenido,
    icono: icono,
    fecha: `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`
  };

  const cartas = obtenerCartitas();
  cartas.unshift(nuevaCarta);
  localStorage.setItem('pareja_cartitas', JSON.stringify(cartas));

  if (tituloEl) tituloEl.value = '';
  if (contenidoEl) contenidoEl.value = '';
  cargarCartitasLocal();
  alert("¡Cartita guardada en el buzón con éxito! 💌");
};

// ==========================================
// 8. NOTITAS COMPARTIDAS
// ==========================================
async function cargarNotitasCloud() {
  const mural = document.getElementById('mural-notas');
  if (!mural) return;

  let notas = [];
  if (db) {
    try {
      const { data, error } = await db.from('notas_pareja').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) notas = data;
    } catch (_) {}
  }

  if (notas.length === 0) {
    notas = JSON.parse(localStorage.getItem('notas_respaldo') || '[]');
  }

  mural.innerHTML = '';
  notas.forEach(nota => {
    const postIt = document.createElement('div');
    postIt.className = `post-it ${nota.color}`;
    postIt.innerHTML = `
      <div class="note-text">${nota.texto}</div>
      <div class="note-footer">
        <span>${nota.autor} • <small>${nota.fecha}</small></span>
        <button class="btn-del-note" onclick="borrarNotitaCloud(${nota.id})" title="Borrar nota">✕</button>
      </div>
    `;
    mural.appendChild(postIt);
  });
}

window.agregarNotita = async function() {
  const txtEl = document.getElementById('nueva-nota-txt');
  const autorEl = document.getElementById('nota-autor');

  const texto = txtEl ? txtEl.value.trim() : '';
  if (!texto) {
    alert("Escribe algo lindo primero 💕");
    return;
  }

  const autor = autorEl ? autorEl.value : "Nosotros";
  const color = autor.includes("casi inge") ? "color-morado" : "color-azul";
  const hoy = new Date();
  const fechaStr = `${hoy.getDate()}/${hoy.getMonth() + 1}`;

  const nueva = { id: Date.now(), texto: texto, autor: autor, color: color, fecha: fechaStr };
  let notas = JSON.parse(localStorage.getItem('notas_respaldo') || '[]');
  notas.unshift(nueva);
  localStorage.setItem('notas_respaldo', JSON.stringify(notas));

  if (db) {
    try {
      await db.from('notas_pareja').insert([{ texto: texto, autor: autor, color: color, fecha: fechaStr }]);
    } catch (_) {}
  }

  if (txtEl) txtEl.value = '';
  cargarNotitasCloud();
};

window.borrarNotitaCloud = async function(id) {
  if (!confirm("¿Quieres quitar esta notita?")) return;

  let notas = JSON.parse(localStorage.getItem('notas_respaldo') || '[]');
  notas = notas.filter(n => n.id !== id);
  localStorage.setItem('notas_respaldo', JSON.stringify(notas));

  if (db) {
    try { await db.from('notas_pareja').delete().eq('id', id); } catch (_) {}
  }
  cargarNotitasCloud();
};

// ==========================================
// 9. RETOS / METAS
// ==========================================
async function cargarRetosCloud() {
  const lista = document.getElementById('lista-retos');
  if (!lista) return;

  let retos = [];
  if (db) {
    try {
      const { data, error } = await db.from('retos_pareja').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) retos = data;
    } catch (_) {}
  }

  if (retos.length === 0) {
    retos = JSON.parse(localStorage.getItem('retos_respaldo') || '[]');
  }

  lista.innerHTML = '';
  if (retos.length === 0) {
    lista.innerHTML = '<p style="color:#64748b;font-size:13px;text-align:center;padding:12px 0;">Aún no tienen planes agregados. ¡Escriban uno arriba! ✨</p>';
    return;
  }

  retos.forEach(reto => {
    const item = document.createElement('div');
    item.className = `todo-item ${reto.completado ? 'done' : ''}`;
    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="todo-check-btn" onclick="toggleReto(${reto.id}, ${reto.completado})">
          ${reto.completado ? '✓' : ''}
        </button>
        <span style="font-size:14px;font-weight:600;">${reto.titulo}</span>
      </div>
      <button class="btn-del-note" onclick="borrarReto(${reto.id})">✕</button>
    `;
    lista.appendChild(item);
  });
}

window.agregarReto = async function() {
  const txtEl = document.getElementById('nuevo-reto-txt');
  const txt = txtEl ? txtEl.value.trim() : '';
  if (!txt) {
    alert("Escribe una idea o plan de aniversario 👫");
    return;
  }

  const nuevo = { id: Date.now(), titulo: txt, completado: false };
  let retos = JSON.parse(localStorage.getItem('retos_respaldo') || '[]');
  retos.push(nuevo);
  localStorage.setItem('retos_respaldo', JSON.stringify(retos));

  if (db) {
    try { await db.from('retos_pareja').insert([{ titulo: txt, completado: false }]); } catch (_) {}
  }

  if (txtEl) txtEl.value = '';
  cargarRetosCloud();
};

window.toggleReto = async function(id, estadoActual) {
  let retos = JSON.parse(localStorage.getItem('retos_respaldo') || '[]');
  retos = retos.map(r => r.id === id ? { ...r, completado: !estadoActual } : r);
  localStorage.setItem('retos_respaldo', JSON.stringify(retos));

  if (db) {
    try { await db.from('retos_pareja').update({ completado: !estadoActual }).eq('id', id); } catch (_) {}
  }
  cargarRetosCloud();
};

window.borrarReto = async function(id) {
  let retos = JSON.parse(localStorage.getItem('retos_respaldo') || '[]');
  retos = retos.filter(r => r.id !== id);
  localStorage.setItem('retos_respaldo', JSON.stringify(retos));

  if (db) {
    try { await db.from('retos_pareja').delete().eq('id', id); } catch (_) {}
  }
  cargarRetosCloud();
};

// ==========================================
// 10. LATIDOS EN VIVO
// ==========================================
function suscribirTiempoReal() {
  if (!db) return;
  try {
    db.channel('cambios-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notas_pareja' }, () => cargarNotitasCloud())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'retos_pareja' }, () => cargarRetosCloud())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dibujos_pareja' }, () => cargarDibujosCloud())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'canciones_pareja' }, () => cargarCancionesCloud())
      .subscribe();

    const canal = db.channel('canal-pareja');
    canal
      .on('broadcast', { event: 'pensando_en_ti' }, (payload) => {
        mostrarNotificacion(payload.payload.mensaje);
      })
      .subscribe();
  } catch (_) {}
}

window.enviarPensandoEnTi = function() {
  const autorEl = document.getElementById('nota-autor');
  const autor = autorEl && autorEl.value.includes("casi inge") ? "Tu casi inge 🐱" : "Tu corazón de melón 💙";
  const msg = `💓 ¡${autor} está pensando en ti justo en este instante!`;
  
  if (db) {
    try {
      db.channel('canal-pareja').send({
        type: 'broadcast',
        event: 'pensando_en_ti',
        payload: { mensaje: msg }
      });
    } catch (_) {}
  }

  mostrarNotificacion("¡Latido enviado con éxito a su pantalla! 💕");
};

function mostrarNotificacion(texto) {
  const toast = document.getElementById('toast-notif');
  if (!toast) return;
  toast.innerText = texto;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ==========================================
// 11. RAMO DE FLORES
// ==========================================
function renderBouquet() {
  const bouquet = document.getElementById('bouquet');
  const flowerMessage = document.getElementById('flower-message');
  if (!bouquet) return;

  bouquet.innerHTML = '';
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
      if (flowerMessage) {
        flowerMessage.innerHTML = `<strong>Flor #${index + 1}:</strong> ${frase}`;
        flowerMessage.style.transform = 'scale(1.03)';
        setTimeout(() => flowerMessage.style.transform = 'scale(1)', 200);
      }
    });

    bouquet.appendChild(flower);
  });
}

window.petKitty = function() {
  const feedback = document.getElementById('cute-feedback');
  if (feedback) feedback.innerText = "🐱 *Prrrrr* ¡Miau! Dice que eres el amor de mi vida 💕";
};

window.giveCandy = function(tipo) {
  const feedback = document.getElementById('cute-feedback');
  const aleatorio = DULCES_MSGS[Math.floor(Math.random() * DULCES_MSGS.length)];
  if (feedback) feedback.innerText = `${tipo} ${aleatorio}`;
};