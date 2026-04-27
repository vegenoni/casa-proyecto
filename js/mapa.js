const MAP_CABA = [-34.615, -58.433];
const MAP_RING_COLORS = { 2:'#c4956a', 3:'#b07830', 4:'#8a5c18', 5:'#5c3a08' };
const MAP_FIT_COLORS  = { 5:'#1d9e75', 4:'#5a8e20', 3:'#b07830', 2:'#9e4a1d' };
const MAP_FIT_LABELS  = { 5:'Muy recomendado', 4:'Recomendado', 3:'Posible', 2:'Menos ideal' };
const MAP_RING_KM = { 2:150, 3:270, 4:370, 5:480 };
const MAP_ROUTE_REFS = [
  {ref:'2',name:'RN 2',color:'#c17a2a'},{ref:'3',name:'RN 3',color:'#c17a2a'},
  {ref:'5',name:'RN 5',color:'#c17a2a'},{ref:'7',name:'RN 7',color:'#c17a2a'},
  {ref:'9',name:'RN 9',color:'#c17a2a'},{ref:'12',name:'RN 12',color:'#c17a2a'},
  {ref:'14',name:'RN 14',color:'#c17a2a'},{ref:'33',name:'RN 33',color:'#d4944a'},
  {ref:'188',name:'RN 188',color:'#d4944a'},{ref:'226',name:'RN 226',color:'#d4944a'},
  {ref:'228',name:'RN 228',color:'#d4944a'},
];
const MAP_TOWNS = [
  // ---- BS AS · 2-3h ----
  {name:'Chascomús',lat:-35.573,lng:-58.016,ring:2,h:'~2 h',prov:'Bs As',desc:'Lago, casco histórico, tranquilidad real',ruta:'RN 2',fit:4},
  {name:'Navarro',lat:-35.003,lng:-59.278,ring:2,h:'~2 h',prov:'Bs As',desc:'Lago, campo tranquilo, pueblo chico con historia',ruta:'RP 41',fit:3},
  {name:'Lobos',lat:-35.186,lng:-59.093,ring:2,h:'~2 h',prov:'Bs As',desc:'Campo abierto, tranquilo, servicios básicos',ruta:'RN 205',fit:3},
  {name:'Cañuelas',lat:-35.051,lng:-58.757,ring:2,h:'~1.5 h',prov:'Bs As',desc:'Campo tranquilo, muy cerca de CABA',ruta:'RN 3',fit:3},
  {name:'Mercedes',lat:-34.650,lng:-59.430,ring:2,h:'~2 h',prov:'Bs As',desc:'Ciudad chica, buena infraestructura, río Luján',ruta:'RN 5',fit:3},
  {name:'San Antonio de Areco',lat:-34.246,lng:-59.474,ring:2,h:'~2 h',prov:'Bs As',desc:'Tradición gaucha, comunidad artesanal y cultural',ruta:'RN 8',fit:3},
  {name:'Luján',lat:-34.570,lng:-59.113,ring:2,h:'~1.5 h',prov:'Bs As',desc:'Río, fácil acceso, zona de quintas',ruta:'RN 7',fit:2},
  {name:'Brandsen',lat:-35.170,lng:-58.230,ring:2,h:'~1.5 h',prov:'Bs As',desc:'Pueblo chico, campo, muy cerca de CABA',ruta:'RN 2',fit:2},
  {name:'Roque Pérez',lat:-35.398,lng:-59.325,ring:2,h:'~2.5 h',prov:'Bs As',desc:'Laguna, campo, muy tranquilo',ruta:'RP',fit:3},
  {name:'Gral. Las Heras',lat:-34.928,lng:-59.083,ring:2,h:'~1.5 h',prov:'Bs As',desc:'Pueblo pequeño, zona de quintas',ruta:'RN 3',fit:2},
  {name:'Bragado',lat:-35.119,lng:-60.487,ring:2,h:'~3 h',prov:'Bs As',desc:'Ciudad chica, campo, laguna',ruta:'RN 5',fit:2},
  {name:'Suipacha',lat:-34.773,lng:-59.690,ring:2,h:'~2 h',prov:'Bs As',desc:'Pueblo chico tranquilo, zona rural',ruta:'RN 5',fit:2},
  // ---- BS AS · 3-4h ----
  {name:'Las Flores',lat:-36.016,lng:-59.098,ring:3,h:'~3 h',prov:'Bs As',desc:'Campo puro, pueblo tranquilo con servicios',ruta:'RN 3',fit:3},
  {name:'Dolores',lat:-36.313,lng:-57.679,ring:3,h:'~3 h',prov:'Bs As',desc:'Pueblo típico bonaerense, acceso rápido',ruta:'RN 2',fit:3},
  {name:'Azul',lat:-36.779,lng:-59.855,ring:3,h:'~3.5 h',prov:'Bs As',desc:'Ciudad discreta, infraestructura, terrenos baratos',ruta:'RN 3',fit:4},
  {name:'Rauch',lat:-36.772,lng:-59.090,ring:3,h:'~3.5 h',prov:'Bs As',desc:'Muy tranquilo, cerca de Tandil, terrenos accesibles',ruta:'RN 226',fit:5},
  {name:'Ayacucho',lat:-37.150,lng:-58.490,ring:3,h:'~3.5 h',prov:'Bs As',desc:'Campo, pueblo tranquilo con servicios',ruta:'RN 2',fit:3},
  {name:'Bolívar',lat:-36.234,lng:-61.113,ring:3,h:'~4 h',prov:'Bs As',desc:'Campo puro, pueblo con servicios básicos',ruta:'RN 5',fit:3},
  {name:'Chivilcoy',lat:-34.898,lng:-60.018,ring:3,h:'~3 h',prov:'Bs As',desc:'Campo, buena conectividad',ruta:'RN 5',fit:2},
  {name:'25 de Mayo',lat:-35.433,lng:-60.167,ring:3,h:'~3 h',prov:'Bs As',desc:'Llanura pampeana, pueblo con historia',ruta:'RN 5',fit:2},
  {name:'Gral. Alvear',lat:-36.024,lng:-60.017,ring:3,h:'~3 h',prov:'Bs As',desc:'Pueblo chico, campo, tranquilo',ruta:'RP',fit:2},
  {name:'Maipú',lat:-36.864,lng:-57.884,ring:3,h:'~3.5 h',prov:'Bs As',desc:'Laguna, campo, muy tranquilo',ruta:'RN 2',fit:3},
  {name:'Tapalqué',lat:-36.354,lng:-60.018,ring:3,h:'~3.5 h',prov:'Bs As',desc:'Pueblo muy chico, campo abierto',ruta:'RN 3',fit:2},
  // ---- BS AS · 4-5h ----
  {name:'Tandil',lat:-37.321,lng:-59.133,ring:4,h:'~4.5 h',prov:'Bs As',desc:'Sierras, clima fresco, ciudad universitaria con todos los servicios',ruta:'RN 226',fit:5},
  {name:'Olavarría',lat:-36.892,lng:-60.322,ring:4,h:'~4 h',prov:'Bs As',desc:'Ciudad mediana, zona serrana, buena infraestructura',ruta:'RN 3',fit:3},
  {name:'Balcarce',lat:-37.845,lng:-58.254,ring:4,h:'~4.5 h',prov:'Bs As',desc:'Sierras, clima fresco, cerca de Mar del Plata',ruta:'RN 226',fit:4},
  {name:'Necochea',lat:-38.554,lng:-58.737,ring:4,h:'~5 h',prov:'Bs As',desc:'Costa tranquila, diferente al corredor masivo',ruta:'RN 228',fit:3},
  {name:'Benito Juárez',lat:-37.669,lng:-59.810,ring:4,h:'~4.5 h',prov:'Bs As',desc:'Entre pampa y sierras, tranquilo',ruta:'RN 3',fit:3},
  {name:'Pigüé',lat:-37.600,lng:-62.400,ring:4,h:'~5 h',prov:'Bs As',desc:'Colonia francesa, identidad propia, sierras cercanas',ruta:'RN 33',fit:3},
  {name:'Laprida',lat:-37.544,lng:-60.797,ring:4,h:'~4.5 h',prov:'Bs As',desc:'Zona serrana, muy tranquilo, terrenos baratos',ruta:'RN 3',fit:3},
  {name:'Coronel Suárez',lat:-37.461,lng:-61.932,ring:4,h:'~5 h',prov:'Bs As',desc:'Pueblo tranquilo, llanura, comunidades de inmigrantes',ruta:'RN 33',fit:2},
  {name:'Miramar',lat:-38.270,lng:-57.836,ring:4,h:'~5 h',prov:'Bs As',desc:'Costa tranquila, fuera del boom turístico',ruta:'RN 2',fit:3},
  {name:'Mar del Plata',lat:-38.005,lng:-57.548,ring:4,h:'~5 h',prov:'Bs As',desc:'Ciudad grande, costa, mucha infraestructura',ruta:'RN 2',fit:2},
  // ---- BS AS · 5-6h ----
  {name:'Sierra de la Ventana',lat:-38.133,lng:-61.797,ring:5,h:'~5.5 h',prov:'Bs As',desc:'Sierras, naturaleza extraordinaria, comunidad interesante',ruta:'RN 3',fit:5},
  {name:'Tornquist',lat:-38.100,lng:-62.220,ring:5,h:'~5.5 h',prov:'Bs As',desc:'Pueblo chico junto a las sierras de la Ventana',ruta:'RN 3',fit:4},
  {name:'Tres Arroyos',lat:-38.376,lng:-60.276,ring:5,h:'~5.5 h',prov:'Bs As',desc:'Campo, pueblo grande, buena calidad de vida',ruta:'RN 228',fit:3},
  {name:'Monte Hermoso',lat:-38.985,lng:-61.298,ring:5,h:'~6 h',prov:'Bs As',desc:'Costa tranquila, sin masificación',ruta:'RP 78',fit:3},
  {name:'Bahía Blanca',lat:-38.716,lng:-62.270,ring:5,h:'~6 h',prov:'Bs As',desc:'Ciudad grande, zona patagónica, todos los servicios',ruta:'RN 3',fit:2},
  {name:'Coronel Dorrego',lat:-38.718,lng:-61.288,ring:5,h:'~6 h',prov:'Bs As',desc:'Campo tranquilo, costa cercana',ruta:'RN 3',fit:2},
  {name:'Pigue',lat:-37.600,lng:-62.375,ring:5,h:'~5.5 h',prov:'Bs As',desc:'Colonia francesa, sierras, muy tranquilo',ruta:'RN 33',fit:3},
  // ---- ENTRE RÍOS ----
  {name:'Gualeguaychú',lat:-33.012,lng:-58.520,ring:3,h:'~3 h',prov:'Entre Ríos',desc:'Ciudad sobre el Uruguay, naturaleza fluvial, carnaval',ruta:'RN 14',fit:3},
  {name:'Colón',lat:-32.225,lng:-58.143,ring:4,h:'~4 h',prov:'Entre Ríos',desc:'Termas, río Uruguay, pueblo turístico tranquilo',ruta:'RN 14',fit:4},
  {name:'Concepción del Uruguay',lat:-32.485,lng:-58.234,ring:4,h:'~4 h',prov:'Entre Ríos',desc:'Ciudad histórica, universidad, sobre el Uruguay',ruta:'RN 14',fit:3},
  {name:'Federación',lat:-30.980,lng:-57.930,ring:5,h:'~5.5 h',prov:'Entre Ríos',desc:'Termas, lago Salto Grande, muy tranquilo',ruta:'RN 14',fit:4},
  {name:'Victoria',lat:-32.617,lng:-60.158,ring:3,h:'~3.5 h',prov:'Entre Ríos',desc:'Sobre el Paraná, islas, naturaleza húmeda',ruta:'RN 12',fit:3},
  {name:'Gualeguay',lat:-33.148,lng:-59.313,ring:3,h:'~3.5 h',prov:'Entre Ríos',desc:'Ciudad tranquila, campo, río Gualeguay',ruta:'RN 12',fit:3},
  {name:'Villaguay',lat:-31.866,lng:-59.027,ring:4,h:'~4.5 h',prov:'Entre Ríos',desc:'Cuchillas entrerrianas, campo, tranquilo',ruta:'RN 18',fit:3},
  {name:'Rosario del Tala',lat:-32.300,lng:-59.140,ring:4,h:'~4 h',prov:'Entre Ríos',desc:'Interior de Entre Ríos, muy tranquilo',ruta:'RN 12',fit:3},
  {name:'Nogoyá',lat:-32.390,lng:-59.790,ring:4,h:'~4 h',prov:'Entre Ríos',desc:'Interior entrerriano, campo, tranquilo',ruta:'RN 12',fit:3},
  {name:'Diamante',lat:-32.066,lng:-60.644,ring:4,h:'~4 h',prov:'Entre Ríos',desc:'Sobre el Paraná, barrancas, naturaleza',ruta:'RN 12',fit:3},
  // ---- SANTA FE ----
  {name:'Rosario',lat:-32.946,lng:-60.639,ring:3,h:'~3.5 h',prov:'Santa Fe',desc:'Ciudad grande, río Paraná, gastronomía y cultura',ruta:'RN 9',fit:2},
  {name:'San Lorenzo',lat:-32.745,lng:-60.734,ring:3,h:'~3 h',prov:'Santa Fe',desc:'Sobre el Paraná, acceso fácil',ruta:'RN 9',fit:2},
  {name:'Cañada de Gómez',lat:-32.820,lng:-61.395,ring:4,h:'~4 h',prov:'Santa Fe',desc:'Pueblo tranquilo, campo santafesino',ruta:'RN 9',fit:2},
  {name:'Venado Tuerto',lat:-33.745,lng:-61.969,ring:5,h:'~5 h',prov:'Santa Fe',desc:'Ciudad mediana, campo, buena infraestructura',ruta:'RN 8',fit:2},
  // ---- CÓRDOBA ----
  {name:'Río Tercero',lat:-32.173,lng:-64.107,ring:5,h:'~6 h',prov:'Córdoba',desc:'Lago artificial, naturaleza, ciudad chica',ruta:'RN 36',fit:3},
  {name:'Villa María',lat:-32.407,lng:-63.238,ring:5,h:'~6 h',prov:'Córdoba',desc:'Ciudad universitaria, fácil acceso',ruta:'RN 9',fit:2},
  // ---- LA PAMPA ----
  {name:'Santa Rosa',lat:-36.617,lng:-64.283,ring:5,h:'~5.5 h',prov:'La Pampa',desc:'Capital pampeana, naturaleza árida, médanos',ruta:'RN 5',fit:2},
  {name:'General Pico',lat:-35.656,lng:-63.757,ring:5,h:'~5 h',prov:'La Pampa',desc:'Llanura pampeana, tranquilo, servicios',ruta:'RN 188',fit:2},
  {name:'Eduardo Castex',lat:-35.921,lng:-64.294,ring:5,h:'~5.5 h',prov:'La Pampa',desc:'Interior pampeano, muy tranquilo',ruta:'RN 5',fit:1},
];

let leafletMap = null;
let mapRouteWays = [];
let mapMarkers = {};
let mapCurrentFilter = 'all';
let mapInitialized = false;

function haversine(lat1,lon1,lat2,lon2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function kmToHours(km){
  const h=km/90;
  if(h<1)return`~${Math.round(h*60)} min`;
  const hrs=Math.floor(h),mins=Math.round((h-hrs)*60);
  return mins>0?`~${hrs} h ${mins} min`:`~${hrs} h`;
}

function getRing(km){
  if(km<=160)return 2;if(km<=290)return 3;if(km<=390)return 4;return 5;
}

function nearestMapRoute(lat,lng){
  if(!mapRouteWays.length)return null;
  let best=null,bestD=Infinity;
  mapRouteWays.forEach(w=>w.coords.forEach(p=>{
    const d=haversine(lat,lng,p.lat,p.lon);
    if(d<bestD){bestD=d;best=w;}
  }));
  return bestD<60?best:null;
}

function showMapPanel(lat,lng,name,h,ruta,ringColor){
  const km=haversine(MAP_CABA[0],MAP_CABA[1],lat,lng);
  const horas=h||kmToHours(km);
  const ring=getRing(km);
  const color=MAP_RING_COLORS[ring]||'#888';
  const rutaName=ruta||(nearestMapRoute(lat,lng)?nearestMapRoute(lat,lng).name:'zona sin ruta principal');
  document.getElementById('map-panel-title').textContent=name||'Punto en el mapa';
  document.getElementById('map-panel-time').textContent=`${horas} desde Buenos Aires · ${Math.round(km)} km`;
  document.getElementById('map-panel-ruta').innerHTML=
    `<span style="background:${color}44;color:${color};border:1px solid ${color}66;padding:2px 10px;border-radius:99px;font-size:11px;">${rutaName}</span>
     <span style="background:${color}22;color:${color};border:1px solid ${color}44;padding:2px 10px;border-radius:99px;font-size:11px;margin-left:6px;">${ring*2-2}–${ring*2} h</span>`;
  document.getElementById('map-panel').style.display='block';
}

async function initMap(){
  if(mapInitialized)return;
  mapInitialized=true;

  if(!document.getElementById('leaflet-css')){
    const css=document.createElement('link');
    css.id='leaflet-css';css.rel='stylesheet';
    css.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(css);
  }
  if(!window.L){
    await new Promise(res=>{
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      s.onload=res;document.head.appendChild(s);
    });
  }

  leafletMap=L.map('proyecto-map').setView([-35.0,-60.0],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:14}).addTo(leafletMap);

  Object.entries(MAP_RING_KM).forEach(([ring,km])=>{
    L.circle(MAP_CABA,{radius:km*1000,color:MAP_RING_COLORS[ring],weight:1.5,dashArray:'7 5',fillColor:MAP_RING_COLORS[ring],fillOpacity:0.03}).addTo(leafletMap);
  });

  L.marker(MAP_CABA,{icon:L.divIcon({html:'<div style="width:14px;height:14px;background:#1a1108;border:3px solid #f5f0e8;border-radius:50%;box-shadow:0 0 0 2px #1a1108;"></div>',iconSize:[14,14],iconAnchor:[7,7],className:''})})
    .addTo(leafletMap).bindTooltip('<b>Buenos Aires</b>',{permanent:true,direction:'right',offset:[8,0]});

  renderMapMarkers('all');

  leafletMap.on('click',e=>{
    const {lat,lng}=e.latlng;
    const km=haversine(MAP_CABA[0],MAP_CABA[1],lat,lng);
    if(km>600)return;
    const nr=nearestMapRoute(lat,lng);
    showMapPanel(lat,lng,null,kmToHours(km),nr?nr.name:'zona sin ruta principal');
  });

  loadMapRoutes();
}

function renderMapMarkers(filter){
  if(!leafletMap)return;
  Object.values(mapMarkers).forEach(m=>leafletMap.removeLayer(m));
  mapMarkers={};
  const filtered=filter==='all'?MAP_TOWNS:MAP_TOWNS.filter(t=>t.ring===filter);
  filtered.forEach(t=>{
    const fc=MAP_FIT_COLORS[t.fit]||'#888';
    const rc=MAP_RING_COLORS[t.ring];
    const size=t.fit===5?14:t.fit===4?11:9;
    const labelSize = t.fit===5?11:t.fit===4?10:9;
    const icon=L.divIcon({
      html:`<div style="display:flex;align-items:center;gap:4px;">
        <div style="width:${size}px;height:${size}px;flex-shrink:0;background:${fc};border:2px solid ${rc};border-radius:50%;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>
        <span style="font-family:'DM Mono',monospace;font-size:${labelSize}px;color:#1a1108;white-space:nowrap;background:rgba(245,240,232,0.85);padding:1px 4px;border-radius:3px;line-height:1.3;">${t.name}</span>
      </div>`,
      iconSize:[120,size], iconAnchor:[size/2,size/2], className:''
    });
    const popup=`<span style="font-family:Georgia,serif;font-size:14px;display:block;margin-bottom:3px;">${t.name} <span style="color:#a09070;font-size:10px;">${t.prov}</span></span><span style="color:#c4a870;font-size:10px;">${t.h} · ${t.ruta}</span><div style="color:#d4c8b0;margin-top:4px;font-size:11px;">${t.desc}</div><span style="display:inline-block;margin-top:5px;font-size:9px;padding:2px 7px;border-radius:99px;background:${fc}33;color:${fc}">${MAP_FIT_LABELS[t.fit]||''}</span>`;
    const marker=L.marker([t.lat,t.lng],{icon}).addTo(leafletMap).bindPopup(popup,{maxWidth:220});
    marker.on('click',()=>{
      showMapPanel(t.lat,t.lng,t.name,t.h,t.ruta,MAP_RING_COLORS[t.ring]);
      highlightMapSidebarTown(t.name);
    });
    mapMarkers[t.name]=marker;
  });
  renderMapSidebar(filter);
}

function renderMapSidebar(filter) {
  const el = document.getElementById('map-towns-list');
  if (!el) return;
  const filtered = filter === 'all' ? MAP_TOWNS : MAP_TOWNS.filter(t => t.ring === filter);
  const sorted = [...filtered].sort((a,b) => b.fit - a.fit || a.name.localeCompare(b.name));
  el.innerHTML = sorted.map(t => {
    const fc = MAP_FIT_COLORS[t.fit] || '#888';
    const cardId = 'mapcard-' + t.name.replace(/[^a-zA-Z0-9]/g,'_');
    return `<div id="${cardId}" onclick="flyToMapTown('${t.name}')" style="padding:8px 12px;border-bottom:1px solid rgba(161,130,80,0.2);cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='rgba(176,120,48,0.08)'" onmouseout="this.style.background=''">
      <div style="font-size:12px;font-weight:600;margin-bottom:1px;">${t.name} <span style="font-size:9px;color:#9a8070;font-weight:400;">${t.prov}</span></div>
      <div style="font-size:10px;color:#9a8070;margin-bottom:2px;">${t.h} · ${t.ruta}</div>
      <span style="display:inline-block;font-size:9px;padding:1px 5px;border-radius:99px;background:${fc}22;color:${fc}">${MAP_FIT_LABELS[t.fit]||''}</span>
    </div>`;
  }).join('');
}

function highlightMapSidebarTown(name) {
  document.querySelectorAll('[id^="mapcard-"]').forEach(c => c.style.background = '');
  const card = document.getElementById('mapcard-' + name.replace(/[^a-zA-Z0-9]/g,'_'));
  if (card) { card.style.background = 'rgba(176,120,48,0.18)'; card.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
}

function flyToMapTown(name){
  const t=MAP_TOWNS.find(t=>t.name===name);
  if(!t)return;
  leafletMap.flyTo([t.lat,t.lng],10,{duration:1});
  setTimeout(()=>{
    mapMarkers[name]&&mapMarkers[name].openPopup();
    showMapPanel(t.lat,t.lng,t.name,t.h,t.ruta,MAP_RING_COLORS[t.ring]);
  },1000);
  highlightMapSidebarTown(name);
}

function mapFilter(filter,btn){
  document.querySelectorAll('.map-filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  mapCurrentFilter=filter;
  renderMapMarkers(filter);
}

async function loadMapRoutes(){
  const bbox='-42,-66,-29,-56';
  const query=`[out:json][timeout:25];(way["highway"]["ref"~"^(2|3|5|7|9|12|14|33|188|226|228)$"]["network"="AR:national"](${bbox}););out geom;`;
  try{
    const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(query)});
    const data=await res.json();
    data.elements.forEach(el=>{
      if(el.type!=='way'||!el.geometry)return;
      const ref=el.tags&&el.tags.ref;
      const route=MAP_ROUTE_REFS.find(r=>ref===r.ref||ref==='RN '+r.ref);
      if(!route)return;
      L.polyline(el.geometry.map(p=>[p.lat,p.lon]),{color:route.color,weight:3.5,opacity:0.75}).addTo(leafletMap);
      mapRouteWays.push({ref:route.ref,name:route.name,color:route.color,coords:el.geometry});
    });
    [[-35.8,-57.9,'RN 2'],[-36.8,-59.5,'RN 3'],[-34.9,-60.7,'RN 5'],[-34.4,-60.2,'RN 7'],
     [-33.5,-59.5,'RN 9'],[-33.2,-59.3,'RN 12'],[-32.7,-58.6,'RN 14'],[-35.5,-62.1,'RN 33'],
     [-35.4,-63.5,'RN 188'],[-37.0,-58.8,'RN 226'],[-38.2,-59.3,'RN 228']
    ].forEach(([lat,lng,text])=>{
      L.marker([lat,lng],{icon:L.divIcon({html:`<span style="background:rgba(255,252,245,0.92);padding:2px 6px;border-radius:4px;font-size:9px;color:#7a5c2e;border:1px solid #c4a870;white-space:nowrap;">${text}</span>`,className:'',iconAnchor:[18,8]}),interactive:false}).addTo(leafletMap);
    });
  }catch(e){console.log('Rutas no disponibles',e);}
  const statusEl = document.getElementById('map-route-status');
  if (statusEl) statusEl.textContent = mapRouteWays.length > 0 ? `✓ Rutas cargadas · ${MAP_TOWNS.length} destinos` : `${MAP_TOWNS.length} destinos cargados`;
}

// Override showTab para manejar el overlay del mapa
const _baseShowTab = showTab;
window.showTab = function(id, btn) {
  const overlay = document.getElementById('mapa-overlay');
  if (id === 'mapa') {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const tabsRef = document.getElementById('mapa-tabs-ref');
    if (tabsRef && !tabsRef.innerHTML) {
      document.querySelectorAll('.navbar-tabs .tab').forEach(t => {
        const clone = t.cloneNode(true);
        const tabId = (t.getAttribute('onclick')||'').match(/'(\w+)'/)?.[1];
        clone.onclick = () => {
          overlay.style.display = 'none';
          document.body.style.overflow = '';
          closeMenu();
          _baseShowTab(tabId);
        };
        clone.classList.toggle('active', tabId === 'mapa');
        tabsRef.appendChild(clone);
      });
    }
    _baseShowTab(id);
    setTimeout(() => { initMap(); if(leafletMap) leafletMap.invalidateSize(); }, 100);
  } else {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    closeMenu();
    _baseShowTab(id);
  }
};
