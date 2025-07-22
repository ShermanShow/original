export class CartaJugador {
  constructor(nombre, nacionalidad, posicion, ata, pos, def, caracteristica,
              habilidad, tipoHabilidad, condicionHabilidad, accionGenera,
              tiempo, penales) {
    this.nombre = nombre;
    this.nacionalidad = nacionalidad;
    this.posicion = posicion;
    this.ata = ata;
    this.pos = pos;
    this.def = def;
    this.caracteristica = caracteristica;
    this.habilidad = habilidad;
    this.tipoHabilidad = tipoHabilidad;
    this.condicionHabilidad = condicionHabilidad;
    this.accionGenera = accionGenera;
    this.tiempo = tiempo;
    this.penales = penales;
    this.usada = false;
    this.baseAta = ata;
    this.basePos = pos;
    this.baseDef = def;
  }

  resetAtributos() {
    this.ata = this.baseAta;
    this.pos = this.basePos;
    this.def = this.baseDef;
    this.usada = false;
  }

  aplicarHabilidad(equipoActivo, equipoRival) {
    if (this.tipoHabilidad === "PASIVA") {
      this._aplicarHabilidadPasiva(equipoActivo, equipoRival);
    }
  }

  _aplicarHabilidadPasiva(equipoActivo, equipoRival) {
    switch (this.condicionHabilidad || this.habilidad) {
      case "noOtroDelantero":
        if (!equipoActivo.jugadores.some(j => j !== this && j.posicion === "Delantero")) {
          this.ata += 20;
        }
        break;
      case "noOtroMediocampista":
        if (!equipoActivo.jugadores.some(j => j !== this && j.posicion === "Mediocampista")) {
          this.pos += 20;
        }
        break;
      case "noOtroDefensor":
        if (!equipoActivo.jugadores.some(j => j !== this && j.posicion === "Defensor")) {
          this.def += 20;
        }
        break;
      case "EL JUGADOR DE ENFRENTE TIENE -20 ATAQUE":
        const rival = this._obtenerJugadorEnfrente(equipoActivo, equipoRival);
        if (rival) rival.ata = Math.max(0, rival.ata - 20);
        break;
      default:
        break;
    }
  }

  _obtenerJugadorEnfrente(equipoActivo, equipoRival) {
    const idx = equipoActivo.jugadores.indexOf(this);
    return equipoRival.jugadores[idx] || null;
  }
}

export class CartaArquero {
  constructor(nombre, nacionalidad, def, caracteristica,
              habilidad, penales, tipoHabilidad = "PASIVA",
              accionGenera = null, tiempoHabilidad = 0) {
    this.nombre = nombre;
    this.nacionalidad = nacionalidad;
    this.posicion = "Arquero";
    this.def = def;
    this.caracteristica = caracteristica;
    this.habilidad = habilidad;
    this.penales = penales;
    this.tipoHabilidad = tipoHabilidad;
    this.accionGenera = accionGenera;
    this.tiempoHabilidad = tiempoHabilidad;
    this.usada = false;
    this.baseDef = def;
    this.penalAtajado = false;
  }

  resetAtributos() {
    this.def = this.baseDef;
    this.usada = false;
  }
}

export class CartaAccion {
  constructor(nombre, tiempo, condicion, resultadosi,
              resultadono, extra, cantidad, imagen) {
    this.nombre = nombre;
    this.tiempo = tiempo;
    this.condicion = condicion;
    this.resultadosi = resultadosi;
    this.resultadono = resultadono;
    this.extra = extra;
    this.cantidad = cantidad;
    this.imagen = imagen;
    this.usada = false;
  }
}

export const mazoJugadores = [
  new CartaJugador("LEANDRO MAXIMO", "AR", "Delantero", 120, 50, 10, "GOLPE AEREO", "GENERA 'PENAL A FAVOR'", "ACTIVA", null, "Penal a favor", 20, "SI VA AL MEDIO ERRA, DE LO CONTRARIO ES GOL"),
  new CartaJugador("STROM LAUFFER", "DE", "Delantero", 100, 30, 30, "GOLPE AEREO", "GENERA 'MANO A MANO' CON EL ARQUERO RIVAL", "ACTIVA", null, "Pase gol", 20, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("KANAO AMANASHI", "JP", "Delantero", 80, 60, 10, "GOLPE AEREO", "SI NO HAY OTRO DELANTERO EN TU EQUIPO +20 ATQ", "PASIVA", "noOtroDelantero", null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("NBAYE NDIABO", "SN", "Delantero", 80, 10, 60, "GOLPE AEREO", "ESTANDO EN TU MESA, LA PROXIMA CARTA DE ACCION NO GASTA TIEMPO", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("ANNA LUCIA FREITAS", "CO", "Delantero", 80, 20, 40, "GOLPE AEREO", "LA PROXIMA ACCION NO TIENE COSTO", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("SALVADOR DIAZ", "UY", "Delantero", 90, 60, 10, "GOLPE AEREO", "SE GENERA MANO A MANO AL ARQUERO RIVAL", "ACTIVA", null, "Pase gol", 20, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("NAHALI SHARMA", "IN", "Delantero", 120, 40, 20, "GOLPE AEREO", "SI HAY OTRO DELANTERO EN TU EQUIPO GENERA 'JUGADA DE GOL'", "ACTIVA", "otroDelanteroEquipo", "Jugada de gol", 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("JABARI MBUYU", "ZW", "Delantero", 100, 40, 20, "GOLPE AEREO", "LA PROXIMA HABILIDAD CUESTA 10 MENOS", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("RAHUL MAHESH", "BD", "Delantero", 90, 30, 20, "TIRO", "RESTA 5 MIN AL PARTIDO, LA PROXIMA CARTA DE ACCION NO GASTA TIEMPO", "ACTIVA", null, "ReducirTiempoYSinCosto", 10, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("LUCIANA GUERREIRO", "PT", "Mediocampista", 50, 60, 50, "FINTA", "EL EQUIPO RIVAL TIENE -10 POS Y -10 DEF ESTE TURNO", "ACTIVA", null, "Debilitar Rival", 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("FRANK LINGUS", "GB", "Mediocampista", 30, 90, 60, "FINTA", "SI HAY OTRO MEDIOCAMPISTA EN LA MEZA, GENERA 'LATERAL OFENSIVO'", "ACTIVA", "otroMediocampistaMesa", "Lateral Ofensivo", 0, "SI VA A LA DERECHA ERRA, DE LO CONTRARIO ES GOL"),
  new CartaJugador("DJIBRIL SAMBA", "FR", "Mediocampista", 30, 70, 80, "TIRO", "CAMBIA AL JUGADOR QUE TIENE ENFRENTE", "ACTIVA", null, "Cambiar Jugador Enfrentado", 10, "SI ERRA, TIRA DE NUEVO (UNA VEZ)"),
  new CartaJugador("ALESSANDRA ESTAROSSA", "IT", "Mediocampista", 10, 100, 50, "TIRO", "SI SU VALOR DE POS ES MAYOR AL VALOR DE POS DEL RIVAL DE ENFRENTE GENERA 'PASE DE GOL'", "ACTIVA", "posJugadorMayorPosRivalEnfrente", "Pase Gol", 15, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("ROSE DICKENSON", "IE", "Mediocampista", 60, 50, 40, "TIRO", "SI NO HAY OTRO MEDIOCAMPISTA EN TU EQUIPO +20 POS", "PASIVA", "noOtroMediocampista", null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("JOSE MIGUEL TORRES BLANCO", "MX", "Mediocampista", 50, 60, 40, "TIRO", "ESTANDO EN TU MESA, LOS PENALES SE TRANSFORMAN EN GOL", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("ELINA VAANANEN", "FI", "Mediocampista", 50, 60, 30, "FINTA", "CAMBIA UN JUGADOR AL AZAR DE TU EQUIPO, PUEDES PEDIR CARTA DE ACCION", "ACTIVA", null, "Cambiar Jugador Propio y Pedir Accion", 10, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("NOHEMI GUZMAN", "HN", "Mediocampista", 40, 70, 30, "FINTA", "SUMA 10 MIN AL PARTIDO", "ACTIVA", null, "SumarTiempo", 10, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("JUN-SEOK KIM", "KR", "Mediocampista", 60, 60, 20, "TIRO", "RESTA 5 MIN AL PARTIDO", "ACTIVA", null, "ReducirTiempo", 5, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("MARISSA DA SILVA", "BR", "Defensor", 20, 70, 90, "FINTA", "SI HAY OTRO MEDIOCAMPISTA EN TU MESA NO PUEDES COMETER PENALES", "PASIVA", "noOtroMediocampista", null, 0, "ES GOL SI VA A LA DERECHA"),
  new CartaJugador("LEILA EL AMRANI", "MA", "Defensor", 30, 30, 80, "FINTA", "SUMA 5 MIN AL PARTIDO", "ACTIVA", null, "SumarTiempoPequeño", 5, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("FEDERICO URSI", "IT", "Defensor", 10, 80, 90, "FINTA", "SI HAY TRES DEFENSORES EN TU EQUIPO GENERA 'CORRER OFENSIVO'", "ACTIVA", "tresDefensoresEquipo", "Corner ofensivo", 0, "ES GOL SI VA A LA IZQUIERDA"),
  new CartaJugador("JUANA ALONSO", "ES", "Defensor", 50, 10, 100, "FINTA", "SI SU VALOR DE DEF ES MAYOR AL VALOR DE DEF DEL RIVAL DE ENFRENTE GENERA 'PASE ADELANTADO'", "ACTIVA", "defJugadorMayorDefRivalEnfrente", "Pase Adelantado", 10, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("MURAT HAKKAN", "MA", "Defensor", 30, 50, 70, "FINTA", "SI NO HAY OTRO DEFENSOR EN TU EQUIPO +20 DEF", "PASIVA", "noOtroDefensor", null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("HELLA SVENSSON", "SE", "Defensor", 40, 20, 90, "FINTA", "ESTANDO EN TU MESA, NO PUEDES COMETER PENAL", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("TAKESHI ITO", "JP", "Defensor", 10, 70, 80, "FINTA", "SUMA 5 MIN AL PARTIDO", "ACTIVA", null, "SumarTiempoPequeño", 10, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("ZHIWEI CHEN", "CN", "Defensor", 20, 50, 80, "FINTA", "CAMBIA UN JUGADOR AL AZAR DE TU EQUIPO CONTRARIO, PUEDES PEDIR CARTA DE ACCION", "ACTIVA", null, "CambiarJugadorRivalYPedirAccion", 10, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("AHMAD HADDAD", "LB", "Defensor", 10, 60, 70, "FINTA", "LA PROXIMA ACCION TIENE +5 COSTO", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL"),
  new CartaJugador("VANDOR GOWTHER", "NL", "Defensor", 50, 30, 80, "FINTA", "EL JUGADOR DE ENFRENTE TIENE -20 ATAQUE", "PASIVA", null, null, 0, "NO POSEE UNA HABILIDAD ESPECIAL")
];

export const mazoArqueros = [
  new CartaArquero("GIANNI DOLCE", "IT", 120, "MANO A MANO", "Jugada de gol", "NO LE PUEDEN MARCAR A LA IZQUIERDA", "ACTIVA", "Jugada de gol", 15),
  new CartaArquero("ERICA VOGER", "DE", 100, "MANO A MANO", "Tiro libre cercano", "NO LE PUEDEN MARCAR A LA DERECHA", "ACTIVA", "Tiro libre cercano", 10),
  new CartaArquero("MARTIN ARAOZ", "AR", 110, "REFLEJOS", "Ataja el primer penal", "ATAJA PRIMER PENAL", "PASIVA", null, 0),
  new CartaArquero("ALBERTO GUIMARAES", "BR", 95, "MANO A MANO", "Jugada de gol", "NO LE PUEDEN MARCAR A LA MEDIO", "ACTIVA", "Jugada de gol", 15),
  new CartaArquero("IAN PITMAN", "GB", 80, "MANO A MANO", "Penal a favor", "-", "ACTIVA", "Penal a favor", 20),
  new CartaArquero("LUIS SALGADO", "ES", 85, "SALTO", "Tiro libre cercano", "NO LE PUEDEN MARCAR A LA DERECHA", "ACTIVA", "Tiro libre cercano", 10),
  new CartaArquero("JEAN PIERRE GUILLEN", "FR", 80, "REFLEJOS", "Penal a favor", "-", "ACTIVA", "Penal a favor", 20),
  new CartaArquero("RUT VAN BERG", "NL", 95, "REFLEJOS", "Tiro libre cercano", "NO LE PUEDEN MARCAR A LA DERECHA Y AL MEDIO", "ACTIVA", "Tiro libre cercano", 10),
  new CartaArquero("JOAO CARLO", "PT", 100, "REFLEJOS", "Centro desde la izquierda", "NO LE PUEDEN MARCAR A LA IZQUIERDA Y AL MEDIO", "ACTIVA", "Centro desde la izquierda", 10),
  new CartaArquero("KOFI BOAFO", "GH", 80, "MANO A MANO", "Jugada de gol", "NO LE PUEDEN MARCAR A LA IZQUIERDA", "ACTIVA", "Jugada de gol", 15),
  new CartaArquero("HAKIM CHERGUI", "DZ", 80, "REFLEJOS", "Ataja el primer penal", "ATAJA PRIMER PENAL", "PASIVA", null, 0),
  new CartaArquero("NATALIA SERRA LIMA", "PY", 90, "SALTO", "Centro desde la izquierda", "-", "ACTIVA", "Centro desde la izquierda", 10),
  new CartaArquero("MIRABAN WICK", "AU", 90, "MANO A MANO", "Lateral ofensivo", "-", "ACTIVA", "Lateral ofensivo", 10),
  new CartaArquero("OMAR KHALIL", "JO", 90, "MANO A MANO", "Corner ofensivo", "-", "ACTIVA", "Corner ofensivo", 10),
  new CartaArquero("MATTHEW TAUA", "NZ", 90, "SALTO", "Centro desde la derecha", "-", "ACTIVA", "Centro desde la derecha", 10),
  new CartaArquero("LUKA ZIVKOVIC", "RS", 100, "SALTO", "Jugada de gol", "-", "ACTIVA", "Jugada de gol", 15),
  new CartaArquero("EMILY GOMEZ", "US", 100, "REFLEJOS", "Pase adelantado", "-", "ACTIVA", "Pase adelantado", 10),
  new CartaArquero("ANTONIO ROSALES", "DO", 100, "REFLEJOS", "Pase gol", "-", "ACTIVA", "Pase gol", 10),
  new CartaArquero("YUSUF JABARI", "SA", 100, "REFLEJOS", "Centro desde la derecha", "-", "ACTIVA", "Centro desde la derecha", 10)
];

export const mazoAcciones = [
  new CartaAccion("Corner defensivo", 10,
    "El valor de la suma de tu DEF es igual o mayor al valor de ATA del rival",
    "Despeja el balón y se termina la acción",
    "GOL para el equipo rival",
    "1 jugador de cada equipo es suplentado por otro mazo de jugadores.",
    3,
    "img/acciones/corner-defensivo.jpg"
  ),
  new CartaAccion("Corner ofensivo", 10,
    "El valor de la suma de tu ATA es mayor al valor de la DEF del rival",
    "Es GOL",
    "Despeja el balón y se termina la acción",
    "1 jugador de cada equipo al azar es suplentado por otro mazo de jugadores.",
    3,
    "img/acciones/corner-ofensivo.jpg"
  ),
  new CartaAccion("Lateral defensivo", 5,
    "El valor de la suma de tu POS es mayor o igual al del rival",
    "Tu rival cambia un jugador al azar",
    "termina la acción",
    "",
    3,
    "img/acciones/lateral-defensivo.jpg"
  ),
  new CartaAccion("Lateral ofensivo", 10,
    "El valor de la suma tu POS es mayor al del rival",
    "Deriva en JUGADA DE GOL",
    "termina la acción",
    "",
    3,
    "img/acciones/lateral-ofensivo.jpg"
  ),
  new CartaAccion("Pase adelantado", 15,
    "El valor de ATA del jugador del medio (centro) es mayor al valor de DEF del jugador del medio (centro) rival",
    "Deriva en la accion JUGADA DE GOL",
    "termina la acción",
    "",
    2,
    "img/acciones/pase-adelantado.jpg"
  ),
  new CartaAccion("Pase gol", 20,
    "Eliges un jugador para enfrentar al arquero rival. El resultado depende de las características del jugador y el arquero.",
    "Según el resultado de las caracteristicas",
    "Según el resultado de las caracteristicas",
    "",
    1,
    "img/acciones/pase-gol.jpg"
  ),
  new CartaAccion("Tiro libre cercano", 15,
    "Eliges un jugador para patear al arco rival. El resultado depende de las características del jugador y el arquero.",
    "Según el resultado de las caracteristicas",
    "Según el resultado de las caracteristicas",
    "",
    1,
    "img/acciones/tiro-libre-cercano.jpg"
  ),
  new CartaAccion("Falta defensiva", 5,
    "SIEMPRE SE CUMPLE",
    "Cambia a uno de tus jugadores al azar",
    "",
    "",
    1,
    "img/acciones/falta-defensiva.jpg"
  ),
  new CartaAccion("Penal a favor", 20,
    "Eliges un jugador para enfrentar al arquero rival. El resultado depende del lanzamiento y las habilidades en penales del jugador y el arquero.",
    "Según el resultado del lanzamiento y las habilidades",
    "Según el resultado del lanzamiento y las habilidades",
    "",
    2,
    "img/acciones/penal-a-favor.jpg"
  ),
  new CartaAccion("Penal en contra", 20,
    "El equipo rival elige un jugador para enfrentar a tu arquero. El resultado depende del lanzamiento y las habilidades en penales del jugador y el arquero.",
    "Según el resultado del lanzamiento y las habilidades",
    "Según el resultado del lanzamiento y las habilidades",
    "",
    2,
    "img/acciones/penal-en-contra.jpg"
  ),
  new CartaAccion("Centro desde la derecha", 10,
    "Si el jugador de tu izquierda tiene mas ATA que DEF de tu rival.",
    "Deriva en JUGADA DE GOL",
    "termina la acción",
    "",
    3,
    "img/acciones/centro-desde-la-derecha.jpg"
  ),
  new CartaAccion("Centro desde la izquierda", 10,
    "Si el jugador de tu derecha tiene mas ATA que DEF de tu rival.",
    "Deriva en JUGADA DE GOL",
    "termina la acción",
    "",
    3,
    "img/acciones/centro-desde-la-izquierda.jpg"
  ),
  new CartaAccion("Jugada de gol", 0,
    "-",
    "Si la suma del valor de ATA de tu equipo es mayor que la DEF del equipo rival, ES GOL",
    "Se define la accion con el lanzamiento de acciones de gol (dado de acciones)",
    "",
    1,
    "img/acciones/jugada-de-gol.jpg"
  ),
];

export const dadosConfig = {
  acciones: {1:"GOL",2:"GOL",3:"GOL",4:"PENAL_A_FAVOR",5:"ATAJA_ARQUERO",6:"ERRA_GOL"},
  penales:  {1:"GOL_DIRECTO",2:"ATAJA_DIRECTO",3:"IZQUIERDA",4:"DERECHA",5:"MEDIO",6:"ERRA_DIRECTO"}
};

export const caracteristicasJerarquia = {
  "FINTA":       { supera:["REFLEJOS","SALTO"], pierde:["MANO_A_MANO"] },
  "TIRO":        { supera:["MANO_A_MANO","SALTO"], pierde:["REFLEJOS"] },
  "GOLPE_AEREO": { supera:["REFLEJOS","MANO_A_MANO"], pierde:["SALTO"] }
};