// src/logic.js
import {
  mazoJugadores,
  mazoArqueros,
  caracteristicasJerarquia,
  dadosConfig,
  mazoAcciones as modelosAcciones
} from './models.js';

// ——— Estados dinámicos de los mazos ———
export let mazoJugadoresState     = [...mazoJugadores];
export let mazoDescarteJugadores  = [];
export let mazoArquerosState      = [...mazoArqueros];
export let mazoDescarteArqueros   = [];

// ——— Barajar Fisher–Yates ———
export function barajarMazo(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ——— Obtener jugadores únicos para repartir ———
export function obtenerJugadoresUnicos(cantidad, equipoActual, team1, team2) {
  const seleccion = [];
  const nombresEnUso = [
    ...team1.jugadores,
    ...team2.jugadores,
    ...equipoActual.jugadores
  ].map(j => j.nombre);

  let intentos = 0;
  while (seleccion.length < cantidad && intentos < 100) {
    if (mazoJugadoresState.length === 0) {
      // reciclar descarte
      mazoJugadoresState.push(...mazoDescarteJugadores);
      mazoDescarteJugadores = [];
      barajarMazo(mazoJugadoresState);
    }
    const carta = mazoJugadoresState.pop();
    if (
      !nombresEnUso.includes(carta.nombre) &&
      !seleccion.find(x => x.nombre === carta.nombre)
    ) {
      seleccion.push(carta);
    } else {
      mazoDescarteJugadores.push(carta);
    }
    intentos++;
  }
  return seleccion;
}

// ——— Cálculo de overval (stats) ———
export function calcularOvervalEquipo(equipo) {
  let ATA = 0, POS = 0, DEF = 0;
  if (equipo.arquero) DEF += equipo.arquero.def;
  equipo.jugadores.forEach(j => {
    ATA += j.ata;
    POS += j.pos;
    DEF += j.def;
  });
  return { ATA, POS, DEF };
}

export function calcularOvervalEquipoBase(equipo) {
  let ATA = 0, POS = 0, DEF = 0;
  if (equipo.arquero) DEF += equipo.arquero.baseDef;
  equipo.jugadores.forEach(j => {
    ATA += j.baseAta;
    POS += j.basePos;
    DEF += j.baseDef;
  });
  return { ATA, POS, DEF };
}

// ——— Dados ———
export function lanzarDado(tipo) {
  const cfg = dadosConfig[tipo];
  const caras = Object.keys(cfg).map(n => Number(n));
  const max = Math.max(...caras);
  const num = Math.floor(Math.random() * max) + 1;
  return { numero: num, accion: cfg[num] };
}

// ——— Resolver por características ———
export function resolverPorCaracteristicas(carJ, carA) {
  const jer = caracteristicasJerarquia[carJ];
  if (jer.supera.includes(carA)) {
    return { resultado: 'gol', mensaje: `${carJ} supera a ${carA}` };
  }
  if (jer.pierde.includes(carA)) {
    return { resultado: 'atajado', mensaje: `${carA} neutraliza a ${carJ}` };
  }
  // Empate: decide con dado de acciones
  const { numero } = lanzarDado('acciones');
  return {
    resultado: numero <= 3 ? 'gol' : 'atajado',
    mensaje: numero <= 3 ? 'Gol por suerte' : 'Atajada por suerte'
  };
}

// ——— Resolver penal ———
export function resolverPenal(jugador, arquero) {
  const { numero, accion } = lanzarDado('penales');
  // Habilidad pasiva "ataja primer penal"
  if (
    arquero.habilidad.includes('ATAJA PRIMER PENAL') &&
    !arquero.penalAtajado
  ) {
    arquero.penalAtajado = true;
    return { resultado: 'atajado', mensaje: `¡${arquero.nombre} ataja con habilidad!` };
  }
  // Casos directos del dado
  if (accion === 'GOL_DIRECTO')  return { resultado: 'gol', mensaje: 'Gol directo' };
  if (accion === 'ERRA_DIRECTO') return { resultado: 'errado', mensaje: 'Erró el penal' };
  if (accion === 'ATAJA_DIRECTO')return { resultado: 'atajado', mensaje: 'Atajada directa' };
  // Dirección
  const dir = accion.toLowerCase();
  const jugVent = jugador.penales?.toUpperCase().includes(dir.toUpperCase());
  const arqVent = arquero.penales?.toUpperCase().includes(dir.toUpperCase());
  if (jugVent && !arqVent) return { resultado: 'gol', mensaje: `Gol a ${dir}` };
  if (arqVent)       return { resultado: 'atajado', mensaje: `Atajada a ${dir}` };
  // Si no hay ventaja, usar características
  return resolverPorCaracteristicas(jugador.caracteristica, arquero.caracteristica);
}

// ——— Resolver cualquier tipo de gol/acción ———
export function resolverGol(equipoAtacante, equipoDefensor, tipoAcc, detalles = {}) {
  let esGol = false, mensaje = '';
  const arq = equipoDefensor.arquero;
  switch (tipoAcc) {
    case 'JUGADA_DE_GOL': {
      const ovA = calcularOvervalEquipo(equipoAtacante).ATA;
      const ovD = calcularOvervalEquipo(equipoDefensor).DEF;
      esGol = ovA > ovD;
      mensaje = esGol
        ? `⚽ ¡GOOOL! (${ovA} vs ${ovD})`
        : `❌ Defendido (${ovD} ≥ ${ovA})`;
      break;
    }
    case 'PENAL': {
      const r = resolverPenal(detalles.jugador, arq);
      esGol = r.resultado === 'gol';
      mensaje = r.mensaje;
      break;
    }
    case 'TIRO_LIBRE': {
      const r = resolverPorCaracteristicas(detalles.jugador.caracteristica, arq.caracteristica);
      esGol = r.resultado === 'gol';
      mensaje = r.mensaje;
      break;
    }
    case 'ACCION_DIRECTA': {
      const { numero } = lanzarDado('acciones');
      esGol = numero <= 3;
      mensaje = esGol ? '⚽ Gol directo!' : '❌ Disparo desviado';
      break;
    }
  }
  if (esGol) equipoAtacante.goles++;
  return { esGol, mensaje };
}

// ——— Reparto inicial de cartas ———
export function repartirCartasIniciales(team1, team2) {
  barajarMazo(mazoArquerosState);
  team1.arquero = mazoArquerosState.pop();
  team2.arquero = mazoArquerosState.pop();
  barajarMazo(mazoJugadoresState);
  team1.jugadores = obtenerJugadoresUnicos(3, team1, team1, team2);
  team2.jugadores = obtenerJugadoresUnicos(3, team2, team1, team2);
}

// ——— Rotación periódica de jugadores ———
export function rotarJugadores(team1, team2, n = 3) {
  [team1, team2].forEach(eq => {
    const salida = eq.jugadores.splice(0, n);
    mazoDescarteJugadores.push(...salida);
    const nuevos = obtenerJugadoresUnicos(n, eq, team1, team2);
    eq.jugadores.unshift(...nuevos);
    while (eq.jugadores.length > 3) {
      mazoDescarteJugadores.push(eq.jugadores.pop());
    }
  });
}

// ——— Cambio de arqueros (medio tiempo) ———
export function cambiarArqueros(team1, team2) {
  // Descartar los actuales
  mazoDescarteArqueros.push(team1.arquero, team2.arquero);
  // Si no hay suficientes, reciclar
  if (mazoArquerosState.length < 2 && mazoDescarteArqueros.length) {
    mazoArquerosState.push(...mazoDescarteArqueros);
    mazoDescarteArqueros = [];
    barajarMazo(mazoArquerosState);
  }
  // Asignar nuevos
  team1.arquero = mazoArquerosState.pop();
  team2.arquero = mazoArquerosState.pop();
}

// ——— Exportar mazo de acciones para UI ———
export const mazoAcciones = modelosAcciones;
/**
 * Resuelve el enfrentamiento de "Pase gol" según
 *  - FINTA vs MANO_A_MANO  → GOL si ATA>DEF, si no ATAJADO
 *  - FINTA vs REFLEJOS/SALTO → SIEMPRE GOL
 *  - TIRO vs REFLEJOS         → GOL si ATA>DEF, si no ATAJADO
 *  - TIRO vs SALTO/MANO_A_MANO → SIEMPRE GOL
 *  - GOLPE_AEREO vs SALTO      → GOL si ATA>DEF, si no ATAJADO
 *  - GOLPE_AEREO vs TIRO/MANO_A_MANO → SIEMPRE GOL
 */
// src/logic.js

/**
 * Resuelve el enfrentamiento de "Pase gol" según:
 *  - FINTA vs MANO_A_MANO  → GOL si ATA>DEF, si no ATAJADO
 *  - FINTA vs REFLEJOS/SALTO → SIEMPRE GOL
 *  - TIRO vs REFLEJOS         → GOL si ATA>DEF, si no ATAJADO
 *  - TIRO vs SALTO/MANO_A_MANO → SIEMPRE GOL
 *  - GOLPE_AEREO vs SALTO      → GOL si ATA>DEF, si no ATAJADO
 *  - GOLPE_AEREO vs TIRO/MANO_A_MANO → SIEMPRE GOL
 * Si la característica no es ninguna de estas, cae en resolverPorCaracteristicas.
 */
export function resolverPaseGol(jugador, arquero) {
  // Normalizamos espacios a "_" para casar con nuestras claves
  const J = jugador.caracteristica
    .toUpperCase()
    .replace(/\s+/g, '_');
  const A = arquero.caracteristica
    .toUpperCase()
    .replace(/\s+/g, '_');
  const atk = jugador.ata;
  const def = arquero.def;
  let res, msg;

  // DEBUG: Ver qué estamos comparando
  console.log(`🔍 resolverPaseGol: ${J} (ATA=${atk}) vs ${A} (DEF=${def})`);

  // FINTA
  if (J === 'FINTA') {
    if (A === 'MANO_A_MANO') {
      res = atk > def ? 'gol' : 'atajado';
      msg = atk > def
        ? `(${atk}>${def}) ¡Gambetea al arquero y define gooool!`
        : `(${atk}≤${def}) El arquero logra despejar el balón.`;
    } else {
      // vs REFLEJOS o SALTO → siempre gol
      res = 'gol';
      msg = `Gambetea al arquero... ¡defínee gooool!`;
    }
  }
  // TIRO
  else if (J === 'TIRO') {
    if (A === 'REFLEJOS') {
      res = atk > def ? 'gol' : 'atajado';
      msg = atk > def
        ? `(${atk}>${def}) Disparo rasante... ¡gooool!`
        : `(${atk}≤${def}) El arquero ataja el disparo.`;
    } else {
      // vs SALTO o MANO_A_MANO → siempre gol
      res = 'gol';
      msg = `La pone al primer palo... ¡gooool!`;
    }
  }
  // GOLPE_AEREO
  else if (J === 'GOLPE_AEREO') {
    if (A === 'SALTO') {
      res = atk > def ? 'gol' : 'atajado';
      msg = atk > def
        ? `(${atk}>${def}) Cabezazo por arriba... ¡gooool!`
        : `(${atk}≤${def}) El arquero atrapa el cabezazo.`;
    } else {
      // vs TIRO o MANO_A_MANO → siempre gol
      res = 'gol';
      msg = `Cabezazo certero... ¡gooool!`;
    }
  }
  // Cualquier otra característica → fallback genérico
  else {
    return resolverPorCaracteristicas(jugador.caracteristica, arquero.caracteristica);
  }

  return { resultado: res, mensaje: msg };
}

