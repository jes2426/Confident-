// === Utilidades cortas ===
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

// === Autenticación y pantallas ===
let profilePhotoBase64 = null;
let profileName        = 'Ciclista';

const regPhotoInput = qs('#regPhoto');
const photoNameTxt  = qs('#photoName');
if (regPhotoInput) {
  regPhotoInput.addEventListener('change', () => {
    const file = regPhotoInput.files[0];
    if (!file) return;
    photoNameTxt.textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => { profilePhotoBase64 = e.target.result; };
    reader.readAsDataURL(file);
  });
}

// Toggle de contraseña
qsa('.toggle-eye').forEach(i => i.onclick = () => {
  const t = qs('#' + i.dataset.target);
  t.type = t.type === 'password' ? 'text' : 'password';
  i.classList.toggle('fa-eye');
  i.classList.toggle('fa-eye-slash');
});

// Pantallas de login / registro / app
const login = qs('#loginScreen'),
      reg   = qs('#registerScreen'),
      app   = qs('#app');
qs('#showRegister').onclick = () => { login.classList.add('hidden'); reg.classList.remove('hidden'); };
qs('#showLogin').onclick    = () => { reg.classList.add('hidden');   login.classList.remove('hidden'); };
qs('#btnLogin').onclick     = () => { login.classList.add('hidden'); app.classList.remove('hidden');
  setTimeout(() => { qs('#userName').textContent = profileName; if (profilePhotoBase64) qs('#avatarImg').src = profilePhotoBase64; }, 200);
};
qs('#btnRegister').onclick  = () => {
  profileName = qs('#regName').value.trim() || 'Ciclista';
  reg.classList.add('hidden'); app.classList.remove('hidden');
  setTimeout(() => { qs('#userName').textContent = profileName; if (profilePhotoBase64) qs('#avatarImg').src = profilePhotoBase64; }, 200);
};

// Navegación inferior (solo activa visual)
qsa('#bottomNav button').forEach(b => b.onclick = () => {
  qsa('#bottomNav button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
});

// === Productos para ciclistas ===
const products = [
  { name:'Casco de ciclismo',       desc:'Casco ligero con ventilación',        price:'$1,200 MXN', img:'https://cdn-icons-png.flaticon.com/512/252/252025.png' },
  { name:'Guantes de gel',          desc:'Guantes acolchados para ruta',        price:'$450 MXN',  img:'https://cdn-icons-png.flaticon.com/512/892/892327.png' },
  { name:'Luz trasera LED',         desc:'Recargable USB, 120 lm',              price:'$300 MXN',  img:'https://cdn-icons-png.flaticon.com/512/1130/1130888.png' },
  { name:'Bidón 750 ml',            desc:'Libre de BPA, boquilla ancha',        price:'$180 MXN',  img:'https://cdn-icons-png.flaticon.com/512/2341/2341705.png' },
  { name:'Kit multi‑herramienta',   desc:'17 funciones, compacto',              price:'$650 MXN',  img:'https://cdn-icons-png.flaticon.com/512/716/716744.png' },
  { name:'Bombín portátil',         desc:'Aluminio, válvulas Presta/Schrader',  price:'$520 MXN',  img:'https://cdn-icons-png.flaticon.com/512/6002/6002856.png' }
];

function renderProducts() {
  const list = qs('#productList');
  if (!list) return;
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${p.img}">
      <div>
        <strong>${p.name}</strong><br>
        <small>${p.desc}</small><br>
        <span style="color:#19bf6b;font-weight:bold;">${p.price}</span>
      </div>`;
    list.appendChild(li);
  });
}

function showProducts() {
  hideRefacciones && hideRefacciones();
  hideProducts(); // ensure reset
  qs('#productPanel').classList.remove('hidden');
  renderProducts();
}

function hideProducts() {
  qs('#productPanel')?.classList.add('hidden');
}

// Botón de nav "equipo"
const equipoNavBtn = qs('#bottomNav button[data-tab="equipo"]');
if (equipoNavBtn) equipoNavBtn.addEventListener('click', showProducts);

// Botón regresar
const backBtn = qs('#productBack');
if (backBtn) backBtn.addEventListener('click', () => {
  hideProducts();
  qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
});

// === Refacciones (código reducido) ===
const refacPanel = qs('#refacPanel');
const refacList  = qs('#refacList');

function hideRefacciones() { refacPanel?.classList.add('hidden'); }

// (para mantener los features existentes de refaccionarias, insertaría tu código original aquí)

// === Pánico (código existente, resumido) ===
(function(){
  const bigBtn = qs('#panicSend');
  if (!bigBtn) return;
  bigBtn.addEventListener('click', () => {
    qs('#fullPanic').classList.add('hidden');
    alert('✅ Alerta de emergencia enviada');
    qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
  });
})();

// === Google Maps ===
let map;

function initMapWrapper() {
  const mapDiv = qs('#map');
  if (!mapDiv) return;

  const defaultCenter = { lat: 19.432608, lng: -99.133209 }; // Ciudad de México
  map = new google.maps.Map(mapDiv, {
    center: defaultCenter,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  // Intenta centrar en la ubicación actual
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(loc);
        new google.maps.Marker({ position: loc, map, title: 'Tu ubicación' });
      },
      _err => console.warn('No se pudo obtener la ubicación.')
    );
  }
}


// === Botón de Alertas ===
const alertasBtn = qs('#bottomNav button[data-tab="alertas"]');
const fullPanic  = qs('#fullPanic');
const panicModal = qs('#panicModal');
if (alertasBtn && panicModal) {
  alertasBtn.addEventListener('click', () => {
    hideProducts && hideProducts();
    hideRefacciones && hideRefacciones();
    qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
    alertasBtn.classList.add('active');
    panicModal.classList.remove('hidden'); // Mostrar modal de confirmación
  });
}

// Acciones dentro del modal
const sendPanicBtn  = qs('#sendPanic');
const closePanicBtn = qs('#closePanic');

if (sendPanicBtn) {
  sendPanicBtn.addEventListener('click', () => {
    panicModal.classList.add('hidden');
    alert('✅ Alerta de emergencia enviada');
    qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
  });
}
if (closePanicBtn) {
  closePanicBtn.addEventListener('click', () => {
    panicModal.classList.add('hidden');
    qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
  });
}

// === Refacciones para bicicleta ===
const spareParts = [
  { name:'Cadena 11 velocidades', desc:'116 eslabones, compatible Shimano/SRAM', price:'$850 MXN', img:'https://cdn-icons-png.flaticon.com/512/2933/2933636.png' },
  { name:'Pastillas de freno', desc:'Semi‑metálicas, par universal', price:'$320 MXN', img:'https://cdn-icons-png.flaticon.com/512/8484/8484882.png' },
  { name:'Cable de cambios', desc:'Inoxidable 1.1 mm × 2100 mm', price:'$90 MXN', img:'https://cdn-icons-png.flaticon.com/512/2476/2476797.png' },
  { name:'Llanta 700×25 C', desc:'Rodada delgada para ruta', price:'$780 MXN', img:'https://cdn-icons-png.flaticon.com/512/6029/6029659.png' },
  { name:'Cámara 29″', desc:'Válvula Presta 48 mm', price:'$100 MXN', img:'https://cdn-icons-png.flaticon.com/512/6610/6610948.png' },
  { name:'Disco de freno 160 mm', desc:'6 tornillos, acero inoxidable', price:'$250 MXN', img:'https://cdn-icons-png.flaticon.com/512/2487/2487818.png' }
];

function renderSpareParts() {
  const list = qs('#refacList');
  if (!list) return;
  list.innerHTML = '';
  spareParts.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${p.img}">
      <div>
        <strong>${p.name}</strong><br>
        <small>${p.desc}</small><br>
        <span style="color:#19bf6b;font-weight:bold;">${p.price}</span>
      </div>`;
    list.appendChild(li);
  });
}

function showSpareParts() {
  hideProducts && hideProducts();
  hideRefacciones && hideRefacciones();
  const panel = qs('#refacPanel');
  panel?.classList.remove('hidden');
  renderSpareParts();
}

const refacNavBtn = qs('#bottomNav button[data-tab="refacciones"]');
if (refacNavBtn) refacNavBtn.addEventListener('click', showSpareParts);

// Botón regresar desde refacciones
const refacBackBtn = qs('#refacBack');
if (refacBackBtn) {
  refacBackBtn.addEventListener('click', () => {
    hideRefacciones();
    qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
  });
}


// === Rutas para ciclismo ===
const cyclingRoutes = [
  {
    name:'Ruta Reforma',
    distance:'5 km',
    difficulty:'Fácil',
    color:'#e53935',
    path:[
      {lat:19.432608, lng:-99.133209},
      {lat:19.437608, lng:-99.150209},
      {lat:19.425608, lng:-99.150209},
      {lat:19.432608, lng:-99.133209}
    ]
  },
  {
    name:'Circuito Chapultepec',
    distance:'8 km',
    difficulty:'Moderado',
    color:'#1e88e5',
    path:[
      {lat:19.420, lng:-99.182},
      {lat:19.414, lng:-99.190},
      {lat:19.417, lng:-99.170},
      {lat:19.420, lng:-99.182}
    ]
  }
,
{
  name:'Sendero Bosque',
  distance:'7 km',
  difficulty:'Fácil',
  color:'#2e8b57',
  path:[
    {lat:19.420, lng:-99.187},
    {lat:19.425, lng:-99.190},
    {lat:19.430, lng:-99.185}
  ]
},
{
  name:'Circuito Valle',
  distance:'15 km',
  difficulty:'Media',
  color:'#ff8c00',
  path:[
    {lat:19.440, lng:-99.150},
    {lat:19.445, lng:-99.160},
    {lat:19.455, lng:-99.155}
  ]
},
{
  name:'Ruta del Lago',
  distance:'12 km',
  difficulty:'Fácil',
  color:'#1e90ff',
  path:[
    {lat:19.380, lng:-99.150},
    {lat:19.385, lng:-99.145},
    {lat:19.390, lng:-99.150}
  ]
},
{
  name:'Camino de Montaña',
  distance:'20 km',
  difficulty:'Difícil',
  color:'#8b0000',
  path:[
    {lat:19.500, lng:-99.250},
    {lat:19.510, lng:-99.260},
    {lat:19.520, lng:-99.255}
  ]
}];

let routePolylines = [];

function renderRoutes() {
  const list = qs('#routeList');
  if (!list) return;
  list.innerHTML = '';
  cyclingRoutes.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="width:12px;height:12px;background:${r.color};border-radius:2px;"></div>
      <div>
        <strong>${r.name}</strong><br>
        <small>${r.distance} · ${r.difficulty}</small>
      </div>`;
    list.appendChild(li);
  });
}

function drawRoutesOnMap(){
  if (!map) return;
  // Remove existing
  routePolylines.forEach(p => p.setMap(null));
  routePolylines = [];
  cyclingRoutes.forEach(r => {
    const poly = new google.maps.Polyline({
      path: r.path,
      strokeColor: r.color,
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map
    });
    routePolylines.push(poly);
  });
}

function showRoutes() {
  hideProducts && hideProducts();
  hideRefacciones && hideRefacciones();
  qs('#routePanel').classList.remove('hidden');
  renderRoutes();
  drawRoutesOnMap();
}

function hideRoutes(){
  qs('#routePanel')?.classList.add('hidden');
  routePolylines.forEach(p => p.setMap(null));
}

// Nav button
const rutasNavBtn = qs('#bottomNav button[data-tab="rutas"]');
if (rutasNavBtn) rutasNavBtn.addEventListener('click', showRoutes);

// Back button
const routeBackBtn = qs('#routeBack');
if (routeBackBtn) routeBackBtn.addEventListener('click', () => {
  hideRoutes();
  qsa('#bottomNav button').forEach(b => b.classList.remove('active'));
});


/* === Perfil ciclista === */
const profilePanel  = qs('#profilePanel');
const profileBack   = qs('#profileBack');
const avatarImg     = qs('#avatarImg');

const cyclistData = {
  name: 'Valery',
  role: 'Ciclista',
  level: 3,
  progress: 30,           // porcentaje de avance al siguiente nivel
  photo: 'https://i.pravatar.cc/200?img=12',
  weeklyDistances: [5,7,10,6,9,8,6],
  totalDistance: 14.53,
  difficulty: 'Moderado',
  friends: [
    'https://i.pravatar.cc/60?img=32',
    'https://i.pravatar.cc/60?img=18',
    'https://i.pravatar.cc/60?img=45'
  ]
};

let weeklyChartInstance = null;

function renderProfile(){
  qs('#profilePic').src          = cyclistData.photo;
  qs('#profileName').textContent = cyclistData.name;
  qs('#profileRole').textContent = cyclistData.role;
  qs('#profileLevel').textContent= 'Nivel ' + cyclistData.level;
  qs('#progressBar').style.width = cyclistData.progress + '%';
  qs('#statDistance').textContent= cyclistData.totalDistance.toFixed(2) + ' km';
  qs('#statDifficulty').textContent = cyclistData.difficulty;

  // Amigos
  const flist = qs('#friendsList');
  flist.innerHTML = '';
  cyclistData.friends.forEach(src=>{
     const li = document.createElement('li');
     const img = document.createElement('img');
     img.src = src;
     li.appendChild(img);
     flist.appendChild(li);
  });

  // Gráfica
  const ctx = qs('#weeklyChart').getContext('2d');
  if (weeklyChartInstance) weeklyChartInstance.destroy();
  weeklyChartInstance = new Chart(ctx,{
    type:'bar',
    data:{
      labels:['L','M','M','J','V','S','D'],
      datasets:[{data:cyclistData.weeklyDistances}]
    },
    options:{
      plugins:{legend:{display:false}},
      scales:{y:{beginAtZero:true}}
    }
  });
}

function showProfile(){
  hideProducts && hideProducts();
  hideRefacciones && hideRefacciones();
  hideRoutes && hideRoutes();
  profilePanel.classList.remove('hidden');
  renderProfile();
}
function hideProfile(){
  profilePanel?.classList.add('hidden');
}

// Eventos
avatarImg && avatarImg.addEventListener('click', showProfile);
profileBack && profileBack.addEventListener('click', hideProfile);
