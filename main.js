import { mazoAcciones }            from './models.js';
import { repartirCartasIniciales,
         rotarJugadores }         from './logic.js';
import { renderizarEquipos,
         setupEventListeners }     from './ui.js';

const state = {
  team1:        { arquero: null, jugadores: [], goles: 0 },
  team2:        { arquero: null, jugadores: [], goles: 0 },
  tiempo:       0,
  turno:        1,
  mazoAcciones: [...mazoAcciones],
  actionUsed:   false,
  rotarJugadores: null
};
// inyectamos la función evitando ciclos
state.rotarJugadores = () => rotarJugadores(state.team1, state.team2, 3);

window.addEventListener('DOMContentLoaded', () => {
  // 1) Asignamos handlers y obtenemos logger
  const logger = setupEventListeners(state);

  // 2) Repartimos cartas iniciales
  repartirCartasIniciales(state.team1, state.team2);

  // 3) Primera renderización
  renderizarEquipos(state, logger);
});
