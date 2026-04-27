const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRb7YVUxjDgnj_rXjh8CpBdhZoMbP8L7yfOIZZLKXnE7YSIqqnW164eID8usq5yt5w/exec';

const DEFAULT_CHECKLISTS = [
  { etapa_id:'e1', etapa_nombre:'Exploración de zonas', etapa_orden:1, items:[
    {item_id:'e1i1',item_texto:'Listar al menos 3 zonas candidatas en el comparador',item_orden:1},
    {item_id:'e1i2',item_texto:'Investigar cada zona online (foros, grupos, Facebook local)',item_orden:2},
    {item_id:'e1i3',item_texto:'Comparar puntajes y elegir 2 finalistas',item_orden:3},
    {item_id:'e1i4',item_texto:'Visitar la zona 1 un fin de semana completo',item_orden:4},
    {item_id:'e1i5',item_texto:'Visitar la zona 2 si la 1 no convence',item_orden:5},
    {item_id:'e1i6',item_texto:'Tomar la decisión final de zona',item_orden:6},
  ]},
  { etapa_id:'e2', etapa_nombre:'Terreno', etapa_orden:2, items:[
    {item_id:'e2i1',item_texto:'Definir tamaño mínimo (casa + taller + animales)',item_orden:1},
    {item_id:'e2i2',item_texto:'Verificar zonificación antes de comprar',item_orden:2},
    {item_id:'e2i3',item_texto:'Confirmar servicios: luz, agua, gas o alternativas',item_orden:3},
    {item_id:'e2i4',item_texto:'Contratar estudio de suelo antes de cerrar compra',item_orden:4},
    {item_id:'e2i5',item_texto:'Verificar escritura, sin deudas ni embargos',item_orden:5},
    {item_id:'e2i6',item_texto:'Consultar si se puede tener gallinas en esa zona',item_orden:6},
    {item_id:'e2i7',item_texto:'Consultar sobre actividad comercial desde domicilio',item_orden:7},
  ]},
  { etapa_id:'e3', etapa_nombre:'Equipo profesional', etapa_orden:3, items:[
    {item_id:'e3i1',item_texto:'Buscar arquitectos con experiencia en la zona',item_orden:1},
    {item_id:'e3i2',item_texto:'Hacer al menos 2-3 consultas antes de elegir',item_orden:2},
    {item_id:'e3i3',item_texto:'Definir el sistema constructivo',item_orden:3},
    {item_id:'e3i4',item_texto:'Contratar gestor o escribano para trámites',item_orden:4},
    {item_id:'e3i5',item_texto:'Consultar instaladores matriculados',item_orden:5},
  ]},
  { etapa_id:'e4', etapa_nombre:'Proyecto y diseño', etapa_orden:4, items:[
    {item_id:'e4i1',item_texto:'Definir el programa de la casa: cuartos, espacios',item_orden:1},
    {item_id:'e4i2',item_texto:'Planificar el taller desde el anteproyecto',item_orden:2},
    {item_id:'e4i3',item_texto:'Planificar espacio exterior: Sandy, animales, huerta',item_orden:3},
    {item_id:'e4i4',item_texto:'Obtener permiso de construcción municipal',item_orden:4},
    {item_id:'e4i5',item_texto:'Definir orientación de la casa (taller con luz norte)',item_orden:5},
  ]},
  { etapa_id:'e5', etapa_nombre:'Trabajo y economía', etapa_orden:5, items:[
    {item_id:'e5i1',item_texto:'Definir qué hace Juanma laboralmente en destino',item_orden:1},
    {item_id:'e5i2',item_texto:'Investigar el mercado laboral local de su rubro',item_orden:2},
    {item_id:'e5i3',item_texto:'Evaluar estructura legal del taller de Ve',item_orden:3},
    {item_id:'e5i4',item_texto:'Definir si el taller vende presencial, online o ambos',item_orden:4},
    {item_id:'e5i5',item_texto:'Abrir ahorro específico para el proyecto',item_orden:5},
    {item_id:'e5i6',item_texto:'Armar presupuesto estimado completo',item_orden:6},
  ]},
  { etapa_id:'e6', etapa_nombre:'Mudanza y logística', etapa_orden:6, items:[
    {item_id:'e6i1',item_texto:'Resolver dónde vivir durante la obra',item_orden:1},
    {item_id:'e6i2',item_texto:'Planificar traslado con un solo auto',item_orden:2},
    {item_id:'e6i3',item_texto:'Conseguir flete para muebles',item_orden:3},
    {item_id:'e6i4',item_texto:'Buscar veterinaria en destino para Sandy',item_orden:4},
    {item_id:'e6i5',item_texto:'Asegurar cerco perimetral desde el día uno',item_orden:5},
    {item_id:'e6i6',item_texto:'Transferir médicos, trámites y servicios',item_orden:6},
  ]},
];

const TAG_COLORS = {
  general:{bg:'#f1efe8',color:'#5f5e5a'}, zona:{bg:'#eeedfe',color:'#3c3489'},
  decision:{bg:'#1a110822',color:'#1a1108'},
  terreno:{bg:'#e1f5ee',color:'#0f6e56'}, arquitecto:{bg:'#eeedfe',color:'#534ab7'},
  obra:{bg:'#faeeda',color:'#854f0b'}, legal:{bg:'#faece7',color:'#993c1d'},
  financiero:{bg:'#e6f1fb',color:'#185fa5'}, emocional:{bg:'#fbeaf0',color:'#993556'},
  idea:{bg:'#eaf3de',color:'#3b6d11'},
};

const CRITERIOS = [
  {id:'clima',label:'Clima'},{id:'distancia',label:'Distancia a CABA'},
  {id:'servicios',label:'Servicios'},{id:'costo',label:'Costo de vida'},
  {id:'terrenos',label:'Terrenos'},{id:'comunidad',label:'Comunidad'},
  {id:'taller',label:'Potencial taller'},
];

let appData = { journal:[], zonas:[], visitas:[], decisiones:[], checklist:[], checklist_structure:[], presupuesto:[], contactos:[], terrenos:[] };
let etapas = [];
let checkStates = {};
let ratings = {};
CRITERIOS.forEach(c => ratings[c.id] = 0);
