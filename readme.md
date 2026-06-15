# Casa Proyecto — Resumen técnico y funcional

## Qué es

App web para Ve y Juanma para gestionar el proceso de construir su casa en Argentina. Registra zonas candidatas, terrenos, visitas, journal, checklist, presupuesto y contactos. Tiene un mapa interactivo de Argentina con radios de distancia desde CABA.

---

## Stack técnico

| Componente | Tecnología |
|---|---|
| Frontend | HTML + CSS + JS vanilla (un solo archivo `index.html`) |
| Backend / API | Google Apps Script desplegado como Web App |
| Base de datos | Google Sheets |
| Almacenamiento de fotos | Google Drive |
| Mapa | Leaflet.js + OpenStreetMap + Overpass API |

---

## Archivos

- `index.html` — toda la app (~2000 líneas)
- `apps-script.gs` — backend en Google Apps Script (~280 líneas)

---

## Configuración

```js
// En index.html
const SCRIPT_URL = '';

// En apps-script.gs
const SHEET_ID = '';
const PHOTOS_FOLDER_ID = '';
```

---

## Google Sheets — estructura

Todas las pestañas en **minúsculas**:

| Hoja | Columnas |
|---|---|
| `journal` | id, fecha, etiqueta, autor, texto, fotos |
| `zonas` | id, nombre, provincia, clima, distancia, servicios, costo, terrenos, comunidad, taller, pros, contras, notas, elegida, score, fotos |
| `visitas` | id, zona_id, zona_nombre, categoria, nombre, fecha, estado, notas |
| `checklist` | etapa_id, item_id, completado |
| `checklistEstructura` | etapa_id, etapa_nombre, etapa_orden, item_id, item_texto, item_orden |
| `presupuesto` | id, rubro, descripcion, proveedor, monto, moneda, estado, fecha, notas |
| `contactos` | id, nombre, rubro, zona, telefono, email, estado, notas |
| `terrenos` | id, nombre, zona_id, zona_nombre, precio, moneda, superficie, servicios, pros, contras, notas, estado, fotos |

Columnas `pros` y `contras` almacenan ítems separados por `|`.
Columnas `fotos` almacenan URLs de Google Drive separadas por `|`.

---

## Apps Script — acciones disponibles

**GET:**
- `readAll` — devuelve todas las secciones en un objeto

**POST:**
- `write` — agrega una fila a una sección
- `delete` — elimina una fila por id
- `toggleCheck` — activa/desactiva un ítem del checklist
- `toggleElegida` — marca/desmarca una zona como elegida
- `saveChecklistStructure` — reescribe toda la estructura de etapas
- `deleteChecklistItem` — elimina un ítem de una etapa
- `deleteChecklistEtapa` — elimina una etapa completa
- `updateChecklistItem` — actualiza el texto de un ítem
- `updateEtapaNombre` — actualiza el nombre de una etapa
- `uploadPhoto` — sube una foto a Drive y guarda la URL en la Sheet
- `deletePhoto` — elimina una URL de foto de la Sheet
- `updateField` — actualiza un campo específico de una fila

---

## Secciones de la app

### Resumen
Panel con métricas (zonas, journal, tareas, decisiones), progreso por etapa del checklist, zona con mejor puntaje, y última entrada del journal.

### Zonas
Comparador de zonas candidatas con 7 criterios (clima, distancia a CABA, servicios, costo de vida, terrenos, comunidad, potencial taller). Cada zona tiene puntaje promedio automático, pros/contras, notas, visitas asociadas, fotos. Botón "Marcar como elegida". Botón "+ Visita" que lleva al formulario de visitas con la zona preseleccionada.

### Terrenos
Fichas de terrenos específicos con precio, m², precio/m² calculado, servicios, pros/contras, notas, fotos. Vinculados a una zona candidata.

### Journal
Entradas unificadas (antes separadas en Journal y Decisiones). Campos: etiqueta (General, Decisión, Zona, Terreno, Arquitecto, Obra, Legal, Financiero, Emocional, Idea), autor (Ve / Juanma / Los dos), timestamp completo con día y hora, texto. Cada entrada puede tener fotos.

### Checklist
Etapas y tareas completamente editables (agregar, editar, eliminar etapas e ítems). Bloques colapsables individualmente + colapsar/expandir todo. Filtros: Todas / Pendientes / Completadas. Mini barra de progreso por etapa. Las etapas 100% completas se muestran tachadas con ✓ verde.


Etapas por defecto:
1. Exploración de zonas
2. Terreno
3. Equipo profesional
4. Proyecto y diseño
5. Trabajo y economía
6. Mudanza y logística

### Visitas
Formulario con zona asociada, categoría (Exploración del pueblo / Terreno específico / Reunión con profesional / Otra), descripción, fecha, estado y notas. Vista lista o calendario. El calendario agrupa por mes y colorea los días con visitas según categoría.

### Presupuesto
Cotizaciones agrupadas por rubro (Terreno, Arquitecto, Construcción, Instalaciones, Materiales, Trámites, Otros). Resumen de totales en USD y ARS (excluye descartadas).

### Contactos
Lista ordenada por estado (En conversación primero). Estado cambiable desde la tarjeta. Teléfono y email son links clickeables.

### Mapa
Leaflet.js con OpenStreetMap. ~65 pueblos/ciudades marcados en un radio de 2-6 horas desde CABA. 4 anillos concéntricos por franja horaria. Rutas reales cargadas desde Overpass API (RN 2, 3, 5, 7, 9, 12, 14, 33, 188, 226, 228). Panel lateral con lista de destinos filtrable. Al clickear cualquier punto del mapa muestra la distancia estimada desde CABA y la ruta más cercana. El mapa es un overlay `position:fixed` que ocupa todo el viewport.

Los destinos tienen puntaje de 1 a 5 según criterios del perfil de Ve y Juanma:
- **5 — Muy recomendado:** Tandil, Rauch, Sierra de la Ventana
- **4 — Recomendado:** Balcarce, Tornquist, Colón (ER), Federación (ER), etc.
- **3 — Posible:** la mayoría de los destinos
- **2 — Menos ideal:** ciudades grandes, zonas muy periurbanas
- **1 — Referencia:** pueblos muy chicos o zona pampeana profunda

---

## Fotos

El flujo de fotos funciona así:
1. Usuario clickea "📷 Agregar foto" en una tarjeta (zona, terreno, o entrada de journal)
2. El archivo se convierte a base64 en el browser
3. Se envía al Apps Script via POST
4. El script lo sube a Google Drive en la carpeta correspondiente (`zonas/`, `terrenos/`, `journal/`)
5. El script hace el archivo público (anyone with link) y guarda la URL directa en la Sheet
6. La app actualiza la tarjeta con la foto en grilla 3x3
7. Click en foto abre lightbox. Hover muestra botón ✕ para eliminar.

Secciones con fotos: Zonas, Terrenos, Journal.

---

## Navbar

- **Desktop (>768px):** tabs horizontales que ocupan todo el ancho + "Nuestra casa" a la derecha
- **Mobile (≤768px):** botón hamburguesa ☰ que despliega menú vertical

Tabs: Resumen · Zonas · Terrenos · Journal · Checklist · Visitas · Presupuesto · Contactos · Mapa
