// src/ui.js

// Importaciones
import {
  calcularOvervalEquipo,
  calcularOvervalEquipoBase,
  resolverGol,
  lanzarDado,
  rotarJugadores,
  cambiarArqueros,
  resolverPenal,
  resolverPorCaracteristicas,
  resolverPaseGol
} from './logic.js';
import { narrativas } from './text.js';

// Logger de acciones / dados
export class DadoLogger {
  constructor() {
    this.logs = [];
    this.container = document.getElementById('log-container');
    this.maxLogs = 10;
  }

  addLog(msg, tiempo) {
    this.logs.push({ msg, tiempo });
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Elimina el log más antiguo
    }
    console.log('Logs actuales:', this.logs.length, this.logs); // Log para depurar
    this.render();
  }

  render() {
    this.container.innerHTML = this.logs
      .map(l => `<div class="log-entry">[${l.tiempo}'] ${l.msg}</div>`)
      .join('');
  }
}



// Helpers
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function promptSeleccionJugador(opciones) {
  const texto = opciones.map((o, i) => `${i + 1}. ${o.label}`).join('\n');
  const resp = parseInt(prompt(`¿Qué jugador?\n${texto}`), 10);
  return (resp > 0 && resp <= opciones.length) ? resp - 1 : 0;
}

const FLAG_MAP = {
  AR: '<img src="https://flagcdn.com/24x18/ar.png" class="flag-icon" alt="AR">',
  DE: '<img src="https://flagcdn.com/24x18/de.png" class="flag-icon" alt="DE">',
  JP: '<img src="https://flagcdn.com/24x18/jp.png" class="flag-icon" alt="JP">',
  SN: '<img src="https://flagcdn.com/24x18/sn.png" class="flag-icon" alt="SN">',
  CO: '<img src="https://flagcdn.com/24x18/co.png" class="flag-icon" alt="CO">',
  UY: '<img src="https://flagcdn.com/24x18/uy.png" class="flag-icon" alt="UY">',
  IN: '<img src="https://flagcdn.com/24x18/in.png" class="flag-icon" alt="IN">',
  ZW: '<img src="https://flagcdn.com/24x18/zw.png" class="flag-icon" alt="ZW">',
  BD: '<img src="https://flagcdn.com/24x18/bd.png" class="flag-icon" alt="BD">',
  PT: '<img src="https://flagcdn.com/24x18/pt.png" class="flag-icon" alt="PT">',
  GB: '<img src="https://flagcdn.com/24x18/gb.png" class="flag-icon" alt="GB">',
  FR: '<img src="https://flagcdn.com/24x18/fr.png" class="flag-icon" alt="FR">',
  IT: '<img src="https://flagcdn.com/24x18/it.png" class="flag-icon" alt="IT">',
  IE: '<img src="https://flagcdn.com/24x18/ie.png" class="flag-icon" alt="IE">',
  MX: '<img src="https://flagcdn.com/24x18/mx.png" class="flag-icon" alt="MX">',
  FI: '<img src="https://flagcdn.com/24x18/fi.png" class="flag-icon" alt="FI">',
  HN: '<img src="https://flagcdn.com/24x18/hn.png" class="flag-icon" alt="HN">',
  KR: '<img src="https://flagcdn.com/24x18/kr.png" class="flag-icon" alt="KR">',
  MA: '<img src="https://flagcdn.com/24x18/ma.png" class="flag-icon" alt="MA">',
  ES: '<img src="https://flagcdn.com/24x18/es.png" class="flag-icon" alt="ES">',
  SE: '<img src="https://flagcdn.com/24x18/se.png" class="flag-icon" alt="SE">',
  CN: '<img src="https://flagcdn.com/24x18/cn.png" class="flag-icon" alt="CN">',
  LB: '<img src="https://flagcdn.com/24x18/lb.png" class="flag-icon" alt="LB">',
  NL: '<img src="https://flagcdn.com/24x18/nl.png" class="flag-icon" alt="NL">',
  BR: '<img src="https://flagcdn.com/24x18/br.png" class="flag-icon" alt="BR">',
  GH: '<img src="https://flagcdn.com/24x18/gh.png" class="flag-icon" alt="GH">',
  DZ: '<img src="https://flagcdn.com/24x18/dz.png" class="flag-icon" alt="DZ">',
  PY: '<img src="https://flagcdn.com/24x18/py.png" class="flag-icon" alt="PY">',
  AU: '<img src="https://flagcdn.com/24x18/au.png" class="flag-icon" alt="AU">',
  JO: '<img src="https://flagcdn.com/24x18/jo.png" class="flag-icon" alt="JO">',
  NZ: '<img src="https://flagcdn.com/24x18/nz.png" class="flag-icon" alt="NZ">',
  RS: '<img src="https://flagcdn.com/24x18/rs.png" class="flag-icon" alt="RS">',
  US: '<img src="https://flagcdn.com/24x18/us.png" class="flag-icon" alt="US">',
  DO: '<img src="https://flagcdn.com/24x18/do.png" class="flag-icon" alt="DO">',
  SA: '<img src="https://flagcdn.com/24x18/sa.png" class="flag-icon" alt="SA">'
};
const COUNTRY_CODE_MAP = {
  Argentina:         'AR',
  Alemania:          'DE',
  Japón:             'JP',
  Senegal:           'SN',
  Colombia:          'CO',
  Uruguay:           'UY',
  India:             'IN',
  Zimbabwe:          'ZW',
  Bangladesh:        'BD',
  Portugal:          'PT',
  Inglaterra:        'GB',
  Francia:           'FR',
  Italia:            'IT',
  'Rep. Irlanda':    'IE',
  México:            'MX',
  Finlandia:         'FI',
  Honduras:          'HN',
  'Corea del Sur':   'KR',
  Marruecos:         'MA',
  España:            'ES',
  Suecia:            'SE',
  China:             'CN',
  Líbano:            'LB',
  'Países Bajos':    'NL',
  Brasil:            'BR',
  Ghana:             'GH',
  Argelia:           'DZ',
  Paraguay:          'PY',
  Australia:         'AU',
  Jordania:          'JO',
  'Nueva Zelanda':   'NZ',
  Serbia:            'RS',
  USA:               'US',
  'Rep. Dominicana': 'DO',
  'Arabia Saudita':  'SA'
};

// Pre-normalizamos las claves para evitar problemas
const NORMALIZED_COUNTRY_MAP = {};
Object.keys(COUNTRY_CODE_MAP).forEach(key => {
  const normalizedKey = key.toLowerCase().trim();
  NORMALIZED_COUNTRY_MAP[normalizedKey] = COUNTRY_CODE_MAP[key];
});

function getFlagEmoji(countryName) {
  if (!countryName) return '';
  
  // Normaliza el nombre del país
  const normalizedCountry = countryName.toString().toLowerCase().trim();
  
  // Obtiene el código del país
  const countryCode = NORMALIZED_COUNTRY_MAP[normalizedCountry] || 
                     COUNTRY_CODE_MAP[countryName] || 
                     countryName;
  
  // Verifica si ya es un emoji (por si acaso)
  if (countryCode.match(/\p{Emoji}/u)) return countryCode;
  
  // Convierte código de país a emoji bandera
  if (countryCode.length === 2) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 0x1F1E6 - 65 + char.charCodeAt(0));
    
    if (codePoints.every(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF)) {
      return String.fromCodePoint(...codePoints);
    }
  }
  
  // Si no se puede convertir, devuelve el nombre original
  return countryName;
}

function getIcono(car) {
  const mapa = {
    'MANO_A_MANO': '🤾',
    'SALTO': '🦘',
    'REFLEJOS': '👀',
    'TIRO': '⚽',
    'GOLPE_AEREO': '✈️',
    'FINTA': '🎭'
  };
  return mapa[car.replace(/ /g, '_')] || '';
}

// Mostrar modal
function openModal(card) {
  const modal = document.getElementById('actionCardModal');
  const titleEl = document.getElementById('actionCardTitle');
  const timeEl = document.getElementById('actionCardTime');
  const condEl = document.getElementById('actionCardCondition');
  const yesEl = document.getElementById('actionCardResultYes');
  const noEl = document.getElementById('actionCardResultNo');
  const extraEl = document.getElementById('actionCardExtra');
  const imageEl = document.getElementById('actionCardImage');

  console.log('Abriendo modal para carta:', card.nombre, 'Imagen:', card.imagen);

  titleEl.innerText = card.nombre;
  timeEl.innerText = `Tiempo: ${card.tiempo}'`;
  condEl.innerText = `Condición: ${card.condicion}`;
  yesEl.innerText = `Sí: ${card.resultadosi}`;
  noEl.innerText = `No: ${card.resultadono}`;
  extraEl.innerText = `Extra: ${card.extra || '–'}`;
  imageEl.src = card.imagen || 'img/fallback.jpg';
  imageEl.alt = `Imagen de ${card.nombre}`;
  modal.classList.add('show');
}

// Cerrar modal
function closeModal() {
  document.getElementById('actionCardModal').classList.remove('show');
}

// Animación de gol
export function mostrarAnimacionGol(equipo) {
  const marcador = document.getElementById('score');
  marcador.classList.add('gol-animacion');
  setTimeout(() => marcador.classList.remove('gol-animacion'), 1000);
}

// Crear HTML de carta
function crearCartaHTML(carta, tipo, teamNumber, state, logger) {
  console.log('Nacionalidad bruta:', carta.nacionalidad);
  const div = document.createElement('div');
  div.className = `jugador ${tipo} ${
    carta.usada
      ? 'habilidad-usada'
      : carta.tipoHabilidad === 'ACTIVA'
      ? 'habilidad-activa'
      : 'habilidad-pasiva'
  }`;

  const img = document.createElement('img');
  img.className = 'card-img';
  img.src = `img/${carta.nombre.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  img.alt = carta.nombre;
  img.onerror = () => img.src = 'img/fallback.jpg';

  const info = document.createElement('div');
  info.className = 'jugador-info';
  console.log(
  `Renderizando carta: ${carta.nombre}`,
  'nacionalidad raw→', carta.nacionalidad,
  'emoji→', getFlagEmoji(carta.nacionalidad)
);
  const flagHtml = FLAG_MAP[carta.nacionalidad.toUpperCase()] || '';
  info.innerHTML = `
  
    <h4>
      ${flagHtml} ${carta.nombre} (${carta.posicion})
      <span class="caracteristica-icon">
      ${getIcono(carta.caracteristica)} ${carta.caracteristica}
    </span>
    </h4>
    <p>
      <strong>ATA:</strong> ${tipo === 'jugador' ? carta.ata : '–'} |
      <strong>POS:</strong> ${tipo === 'jugador' ? carta.pos : '–'} |
      <strong>DEF:</strong> ${carta.def}
    </p>
    <p><strong>Habilidad:</strong> <span class="tipo-habilidad ${carta.tipoHabilidad === 'ACTIVA' ? 'activa' : 'pasiva'}">${carta.tipoHabilidad}</span> – ${carta.habilidad}</p>
    <p><strong>Penales:</strong> ${carta.penales || 'N/A'}</p>
  `;

  // Siempre crear el botón para habilidades activas
  if (carta.tipoHabilidad === 'ACTIVA') {
    const btn = document.createElement('button');
    btn.className = `btn-habilidad ${carta.usada ? 'habilidad-usada' : 'habilidad-activa'}`;
    btn.textContent = 'Usar Habilidad';
    // Deshabilitar si: habilidad usada, no es el turno del equipo, acción ya usada, o partido terminado
    btn.disabled = carta.usada || teamNumber !== state.turno || state.actionUsed || state.matchEnded;
    console.log('Botón:', carta.nombre, {
    usada: carta.usada,
    teamNumber,
    turno: state.turno,
    actionUsed: state.actionUsed,
    matchEnded: state.matchEnded,
    disabled: btn.disabled
  });
    btn.onclick = async () => {
      if (!btn.disabled) {
        await handleHabilidadActivo(carta, state, logger);
      }
    };
    info.appendChild(btn);
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.innerHTML = `
    <strong>Habilidad Completa:</strong><br>
    ${carta.habilidad}<br>
    ${carta.condicionHabilidad ? `<strong>Condición:</strong> ${carta.condicionHabilidad}<br>` : ''}
    ${carta.accionGenera ? `<strong>Acción:</strong> ${carta.accionGenera} (${carta.tiempo || carta.tiempoHabilidad}ʼ)` : ''}
  `;

  div.appendChild(img);
  div.appendChild(info);
  div.appendChild(tooltip);
  return div;
}

// Manejador de habilidades activas
async function handleHabilidadActivo(carta, state, logger) {
  if (carta.accionGenera) {
    const key = carta.accionGenera.toLowerCase();
    const accReal = state.mazoAcciones.find(a =>
      a.nombre.toLowerCase() === key
    );
    if (accReal) {
      await handleCartaAccion(accReal, state, logger);
      return;
    } else {
      await handleCartaAccion({ nombre: carta.accionGenera, tiempo: carta.tiempo || 0 }, state, logger);
      return;
    }
  }

  const cost = carta.tiempo || carta.tiempoHabilidad || 0;
  state.tiempo += cost;
  document.getElementById('time').textContent = `Tiempo: ${state.tiempo}'`;

  logger.addLog(`${carta.nombre} usa su habilidad: ${carta.habilidad}…`, state.tiempo);
  await sleep(1000);

  const equipoA = state.turno === 1 ? state.team1 : state.team2;
  const equipoB = state.turno === 1 ? state.team2 : state.team1;
  let tipoAcc = 'ACCION_DIRECTA', detalles = {};
  if (carta.accionGenera && carta.accionGenera.toLowerCase().includes('penal')) {
    tipoAcc = 'PENAL';
    detalles = { jugador: carta };
  }
  const { esGol, mensaje } = resolverGol(equipoA, equipoB, tipoAcc, detalles);

  logger.addLog(mensaje, state.tiempo);
  if (esGol) mostrarAnimacionGol(state.turno === 1 ? 'Local' : 'Visitante');

  carta.usada = true;
  state.actionUsed = true;
  renderizarEquipos(state, logger);
    // Auto‑pasar turno tras 2 s si usamos algo
    setTimeout(() => {
    clearTurnTimer();                       // limpia el timer actual
    document.getElementById('endTurn').click();
  }, 2000);

}

// Manejador de cartas de acción
async function handleCartaAccion(carta, state, logger) {
  const name = carta.nombre;
  const equipoA = state.turno === 1 ? state.team1 : state.team2;
  const equipoB = state.turno === 1 ? state.team2 : state.team1;

  state.tiempo += carta.tiempo || 0;
  document.getElementById('time').textContent = `Tiempo: ${state.tiempo}'`;

  let narrative = narrativas[name];
  if (!narrative) {
    const matched = Object.keys(narrativas)
      .find(k => k.toLowerCase() === name.toLowerCase());
    narrative = matched ? narrativas[matched] : null;
  }

  if (!narrative) {
    logger.addLog(`Ejecutando acción: ${name}…`, state.tiempo);
    await sleep(1000);

    let resultado, esGol = false;
    if (name.toLowerCase().includes('penal')) {
      const jug = equipoA.jugadores[0];
      const r = resolverPenal(jug, equipoB.arquero);
      resultado = r.mensaje;
      esGol = r.resultado === 'gol';
      if (esGol) equipoA.goles++;
    } else {
      const { numero, accion } = lanzarDado('acciones');
      esGol = numero <= 3;
      resultado = `Dado de acciones: ${numero} (${accion.replace(/_/g,' ')}) → ${esGol ? '¡Gol!' : 'Nada'}`;
      if (esGol) equipoA.goles++;
    }

    logger.addLog(resultado, state.tiempo);
    if (esGol) mostrarAnimacionGol(state.turno === 1 ? 'Local' : 'Visitante');

    carta.usada = true;
    state.actionUsed = true;
    renderizarEquipos(state, logger);
    return;
  }

  logger.addLog(narrative.intro, state.tiempo);
  await sleep(2000);

  let win = false;
  switch (name) {
    case 'Corner defensivo':
      win = calcularOvervalEquipo(equipoA).DEF >= calcularOvervalEquipo(equipoB).ATA;
      if (!win) equipoB.goles++;
      break;

    case 'Corner ofensivo':
      win = calcularOvervalEquipo(equipoA).ATA > calcularOvervalEquipo(equipoB).DEF;
      if (win) equipoA.goles++;
      break;

    case 'Lateral defensivo':
      win = calcularOvervalEquipo(equipoA).POS >= calcularOvervalEquipo(equipoB).POS;
      break;

    case 'Lateral ofensivo': {
      const posA = calcularOvervalEquipo(equipoA).POS;
      const posB = calcularOvervalEquipo(equipoB).POS;
      if (posA > posB) {
        const jugadaGol = state.mazoAcciones.find(a =>
          a.nombre.toLowerCase() === 'jugada de gol'
        );
        if (jugadaGol) {
          await handleCartaAccion(jugadaGol, state, logger);
        } else {
          await handleCartaAccion({ nombre: 'Jugada de gol', tiempo: 0 }, state, logger);
        }
        return;
      } else {
        logger.addLog(narrativas['Lateral ofensivo'].lose, state.tiempo);
        await sleep(2000);
        return;
      }
    }

    case 'Pase adelantado': {
      const cA = equipoA.jugadores[1], cB = equipoB.jugadores[1];
      if (cA.ata > cB.def) {
        await handleCartaAccion({ nombre: 'Jugada de gol', tiempo: 0 }, state, logger);
        return;
      }
      break;
    }

    case 'Jugada de gol': {
      const ovA = calcularOvervalEquipo(equipoA).ATA;
      const ovB = calcularOvervalEquipo(equipoB).DEF;
      if (ovA > ovB) win = true;
      else {
        const { numero, accion } = lanzarDado('acciones');
        logger.addLog(`Dado de acciones: ${numero} (${accion.replace(/_/g,' ')})`, state.tiempo);
        win = numero <= 3;
      }
      if (win) equipoA.goles++;
      break;
    }

    case 'Pase gol': {
      const narrativePG = narrativas['Pase gol'];
      logger.addLog(narrativePG.intro, state.tiempo);
      await sleep(2000);

      const opciones = equipoA.jugadores.map((j,i)=>({
        label: `${j.nombre} (${j.caracteristica}, ATA=${j.ata})`,
        value: i
      }));
      const idx = await promptSeleccionJugador(opciones);
      const jugador = equipoA.jugadores[idx];

      const { resultado, mensaje: fbMsg } = resolverPaseGol(jugador, equipoB.arquero);
      const J = jugador.caracteristica.toUpperCase().replace(/\s+/g,'_');
      const A = equipoB.arquero.caracteristica.toUpperCase().replace(/\s+/g,'_');
      let key;
      if (resultado==='gol' || resultado==='atajado') {
        if ((J==='FINTA'&&A==='MANO_A_MANO') ||
            (J==='TIRO'&&A==='REFLEJOS') ||
            (J==='GOLPE_AEREO'&&A==='SALTO')) {
          const suf = jugador.ata > equipoB.arquero.def ? 'ATA_GT_DEF' : 'ATA_LE_DEF';
          key = `${J}_${A}_${suf}`;
        } else {
          key = `${J}_${A}`;
        }
      }
      const outTxt = (narrativePG.outcomes && narrativePG.outcomes[key]) || fbMsg;
      logger.addLog(outTxt, state.tiempo);

      if (resultado==='gol') {
        equipoA.goles++;
        mostrarAnimacionGol(state.turno===1?'Local':'Visitante');
      }
      if (narrativePG.extra) {
        await sleep(1000);
        logger.addLog(narrativePG.extra, state.tiempo);
      }

      carta.usada = true;
      state.actionUsed = true;
      renderizarEquipos(state, logger);
      return;
    }
  }

  await sleep(2000);
  logger.addLog(win ? narrative.win : narrative.lose, state.tiempo);

  if (win && ['Corner ofensivo','Jugada de gol'].includes(name)) {
    mostrarAnimacionGol(state.turno===1?'Local':'Visitante');
  } else if (!win && name==='Corner defensivo') {
    mostrarAnimacionGol(state.turno===1?'Visitante':'Local');
  }

  if (narrative.extra) {
    await sleep(2000);
    logger.addLog(narrative.extra, state.tiempo);
    rotarJugadores(state.team1, state.team2, 1);
  }

  carta.usada = true;
  state.actionUsed = true;
  renderizarEquipos(state, logger);
    // Auto‑pasar turno tras 2 s si usamos algo
    setTimeout(() => {
    clearTurnTimer();                       // limpia el timer actual
    document.getElementById('endTurn').click();
  }, 2000);


}

// Renderizado de equipos
export function renderizarEquipos(state, logger) {
  // Helper para asignar clase de color según comparación
  function colorClass(val, other) {
    if (val > other) return 'stat-mejorado';    // verde
    if (val < other) return 'stat-disminuido';  // rojo
    return '';                                  // negro
  }

  // Marcador
  document.getElementById('score').textContent =
    `Local ${state.team1.goles} vs ${state.team2.goles} Visitante`;

  // Cálculo de overvalores y bases
  const ov1 = calcularOvervalEquipo(state.team1);
  const ob1 = calcularOvervalEquipoBase(state.team1);
  const ov2 = calcularOvervalEquipo(state.team2);
  const ob2 = calcularOvervalEquipoBase(state.team2);

  // Overvalores con color
  document.getElementById('team1Overval').innerHTML = `
    <span class="${colorClass(ov1.ATA, ov2.ATA)}">
      ATA: ${ov1.ATA}${ov1.ATA > ob1.ATA ? '↑' : ''}
    </span> |
    <span class="${colorClass(ov1.POS, ov2.POS)}">
      POS: ${ov1.POS}${ov1.POS > ob1.POS ? '↑' : ''}
    </span> |
    <span class="${colorClass(ov1.DEF, ov2.DEF)}">
      DEF: ${ov1.DEF}${ov1.DEF > ob1.DEF ? '↑' : ''}
    </span>
  `;
  document.getElementById('team2Overval').innerHTML = `
    <span class="${colorClass(ov2.ATA, ov1.ATA)}">
      ATA: ${ov2.ATA}${ov2.ATA > ob2.ATA ? '↑' : ''}
    </span> |
    <span class="${colorClass(ov2.POS, ov1.POS)}">
      POS: ${ov2.POS}${ov2.POS > ob2.POS ? '↑' : ''}
    </span> |
    <span class="${colorClass(ov2.DEF, ov1.DEF)}">
      DEF: ${ov2.DEF}${ov2.DEF > ob2.DEF ? '↑' : ''}
    </span>
  `;

  // Resaltar el equipo activo
  const team1Container = document.getElementById('team1');
  const team2Container = document.getElementById('team2');
  if (team1Container && team2Container) {
    team1Container.classList.toggle('active-team', state.turno === 1);
    team2Container.classList.toggle('active-team', state.turno === 2);
  } else {
    console.warn('⚠️ Contenedores de equipo no encontrados (#team1, #team2)');
  }

  // Limpiar contenedores
  ['team1Arquero','team1Jugadores','team2Arquero','team2Jugadores']
    .forEach(id => document.getElementById(id).innerHTML = '');

  // Renderizar arquero y jugadores
  document.getElementById('team1Arquero')
    .appendChild(crearCartaHTML(state.team1.arquero, 'arquero', 1, state, logger));
  state.team1.jugadores.forEach(j =>
    document.getElementById('team1Jugadores')
      .appendChild(crearCartaHTML(j, 'jugador', 1, state, logger))
  );
  document.getElementById('team2Arquero')
    .appendChild(crearCartaHTML(state.team2.arquero, 'arquero', 2, state, logger));
  state.team2.jugadores.forEach(j =>
    document.getElementById('team2Jugadores')
      .appendChild(crearCartaHTML(j, 'jugador', 2, state, logger))
  );
}



// Setup de eventos
export function setupEventListeners(state) {

  twemoji.parse(document.body, {
    folder: 'svg',
    ext: '.svg',
    // Aquí apunta al repositorio de SVGs en jsDelivr:
    base: 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/'
  });

  //Timer de turno
  let turnTimerId = null;
  let turnEndTimestamp = 0;
  let turnIntervalId = null;

  function updateTurnDisplay() {
    const el = document.getElementById('turn-timer');
    const msLeft = turnEndTimestamp - Date.now();
    const secLeft = Math.max(0, Math.ceil(msLeft / 1000));
    el.textContent = `${secLeft}″`;
  }
  function startTurnTimer() {
    clearTurnTimer();
    turnEndTimestamp = Date.now() + 30000;
    updateTurnDisplay();
    // refresca cada 500 ms
    turnIntervalId = setInterval(updateTurnDisplay, 500);
    turnTimerId = setTimeout(() => {
      logger.addLog('⏰ Tiempo de turno agotado.', state.tiempo);
      document.getElementById('endTurn').click();
    }, 30000);
  }

  function clearTurnTimer() {
    if (turnTimerId) clearTimeout(turnTimerId);
    if (turnIntervalId) clearInterval(turnIntervalId);
  }

  // Mezcla las cartas de acción al inicio
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffle(state.mazoAcciones);

  const logger = new DadoLogger();

  // ——— ALERTA FLOTANTE PARA SACAR CARTA ———
  function showDrawAlert(message) {
    const drawBtn = document.getElementById('drawActionCard');
    let alertEl = document.getElementById('drawAlert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.id = 'drawAlert';
      alertEl.className = 'draw-alert';
      drawBtn.parentNode.insertBefore(alertEl, drawBtn);
    }
    alertEl.textContent = message;
    setTimeout(() => alertEl.remove(), 2000);
  }

  // ——— Sacar carta de acción ———
  const drawBtn = document.getElementById('drawActionCard');
  if (drawBtn) {
    drawBtn.onclick = () => {
      if (state.actionUsed || state.matchEnded) {
        showDrawAlert('¡Acción ya usada o partido terminado!');
        return;
      }
      if (state.mazoAcciones.length === 0) {
        showDrawAlert('¡No quedan cartas de acción!');
        return;
      }
      const c = state.mazoAcciones.pop();
      state.cartaAccionActual = c;
      openModal(c);
    };
  } else {
    console.warn('⚠️ No se encontró #drawActionCard en el DOM');
  }

  // ——— Usar carta de acción ———
  const useBtn = document.getElementById('useActionCard');
  if (useBtn) {
    useBtn.onclick = async () => {
      if (state.matchEnded) return;
      const c = state.cartaAccionActual;
      if (!c) return;
      closeModal();
      await handleCartaAccion(c, state, logger);
    };
  } else {
    console.warn('⚠️ No se encontró #useActionCard en el DOM');
  }

  // ——— Cancelar modal ———
  const cancelBtn = document.getElementById('cancelActionCard');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      if (state.cartaAccionActual) {
        state.mazoAcciones.push(state.cartaAccionActual);
        state.cartaAccionActual = null;
      }
      closeModal();
    };
  } else {
    console.warn('⚠️ No se encontró #cancelActionCard en el DOM');
  }

  // ——— Handler de “Terminar turno” ———
  const endBtn = document.getElementById('endTurn');
  if (endBtn) {
    endBtn.onclick = async () => {
      if (state.matchEnded) return;

      const siguienteTiempo = state.tiempo + 1;

      // Medio tiempo (solo 1ª vez)
      if (!state.halfTimeDone && siguienteTiempo >= 45) {
        state.halfTimeDone = true;
        state.tiempo = 45;
        document.getElementById('time').textContent = `Tiempo: ${state.tiempo}'`;
        const cambiar = confirm('¡Medio tiempo! ¿Desean cambiar de arqueros?');
        if (cambiar) {
          cambiarArqueros(state.team1, state.team2);
          logger.addLog('Cambio de arqueros.', state.tiempo);
        }
        startTurnTimer();
        return;
      }

      // Fin de partido (solo 1ª vez)
      if (!state.fullTimeDone && siguienteTiempo >= 90) {
        state.fullTimeDone = true;
        state.matchEnded = true;
        state.tiempo = 90;
        document.getElementById('time').textContent = `Tiempo: ${state.tiempo}'`;
        logger.addLog(
          `¡Fin del partido! Resultado: Local ${state.team1.goles} vs ${state.team2.goles} Visitante`,
          state.tiempo
        );
        startTurnTimer();
        return;
      }

      // Turno normal
      state.tiempo = siguienteTiempo;
      document.getElementById('time').textContent = `Tiempo: ${state.tiempo}'`;

      // Alternar turno y resetear estado
      const previousTurn = state.turno;
      state.turno = previousTurn === 1 ? 2 : 1;
      state.actionUsed = false;
      state.team1.arquero.usada = false;
      state.team2.arquero.usada = false;
      state.team1.jugadores.forEach(c => c.usada = false);
      state.team2.jugadores.forEach(c => c.usada = false);

      // Solo rotar jugadores al volver de Visitante a Local
      if (previousTurn === 2 && state.turno === 1) {
        state.rotarJugadores();
        logger.addLog('Rotación de jugadores.', state.tiempo);
      }

      // Log del nuevo turno
      logger.addLog(
        `Turno del equipo ${state.turno === 1 ? 'Local' : 'Visitante'}`,
        state.tiempo
      );

      renderizarEquipos(state, logger);

      // Arranca el timer de 30 s para el siguiente turno
      startTurnTimer();
    };
  } else {
    console.warn('⚠️ No se encontró #endTurn en el DOM');
  }

  // Arranca por primera vez el timer de 30 s
  startTurnTimer();
  return logger;
}
