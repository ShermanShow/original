// src/text.js

export const narrativas = {
  "Corner defensivo": {
    intro: `El equipo rival tiene un corner... Viene en lanzamiento!...`,
    win:   `Despeja, tu defensa debido a que valor de la suma de la defensa es mejor a el valor de ataque de tu rival.`,
    lose:  `Cabezaso... ¡Goool! El central se quedo clavado al piso y el delantero del equipo rival asesta un terrible golpe de cabeza!`,
    extra: `Piden cambio ambos equipos, hubo un golpe de cabeza en el area y salen dos jugadores reemplazados.`
  },

  "Corner ofensivo": {
    intro: `El equipo avanza en el campo y gana un corner... va el lanzamiento al segundo palo!...`,
    win:   `Golazooooo! Tremenda volea del delantero, el arquero rival se quedo mirando la pelota mientras ingreso en el arco!  Gran jugada!`,
    lose:  `Se nota la jerarquia del central del equipo rival despejando el balon sin problemas.`,
    extra: `Piden cambio ambos equipos, hubo un golpe de cabeza en el area y salen dos jugadores reemplazados.`
  },

  "Lateral defensivo": {
    intro: `Lateral para tu equipo en la parte defensiva..veamos que ocurre...`,
    win:   `La posesion de tus jugadores es superior a la del rival, el entrenador rival debe cambiar a un jugador por desgaste fisico.`,
    lose:  `La presion y la posesion del rival hace que despejes la pelota más allá de la mitad de la cancha y la entregues al rival.`,
    extra: ``
  },

  "Lateral ofensivo": {
    intro: `Lateral ofensivo para tu equipo, vamos a ver si pueden sacar ventaja...`,
    win:   `Al parecer tu equipo maneja mejor la posicion... el 10 de tu equipo mete un pase entre lineas... es JUGADA DE GOL!`,
    lose:  `El equipo rival maneja mejor la posicion... intentan un pase filtrado... pero con una cortina del central, el arquero se queda con el balon.`,
    extra: ``
  },

  "Pase adelantado": {
    intro: `Agarra la pelota el numero 10 en la mitad de la cancha, lo encara al rival que tiene enfrente...`,
    win:   `...y lo deja desparramado al borde del area! ¡Es JUGADA DE GOL!`,
    lose:  `...pero defensa rival es superior y lo tumba, no pudo prosperar.`,
    extra: ``
  },

  "Pase gol": {
    intro: `Pase de frente al jugador mas alto de tu equipo, que cabecea y deja al 9 solo para convertir! es un MANO A MANO!`,
    outcomes: {
      // FINTA vs MANO A MANO
      "FINTA_MANO_A_MANO_ATA_GT_DEF":
        `...el 9 gambetea al arquero... defineee gooool! golazooo!!!`,
      "FINTA_MANO_A_MANO_ATA_LE_DEF":
        `...el 9 intenta gambetear al arquero rival pero este logra quedarse con el balon! rechaza el peligro.`,
      // FINTA vs REFLEJOS/SALTO
      "FINTA_REFLEJOS_SALTO":
        `...el 9 gambetea... defineee gooool! golazooo!!!`,
      // TIRO vs REFLEJOS
      "TIRO_REFLEJOS_ATA_GT_DEF":
        `...el 9 hace un disparo razanteeee... gooool! golazooo!!!`,
      "TIRO_REFLEJOS_ATA_LE_DEF":
        `...el 9 disparaaa... ataja el arquero! rechaza el peligro.`,
      // TIRO vs SALTO/MANO_A_MANO
      "TIRO_SALTO_MANO_A_MANO":
        `...el 9 dispara al primer palo... gooool! golazooo!!!`,
      // GOLPE_AEREO vs SALTO
      "GOLPE_AEREO_SALTO_ATA_GT_DEF":
        `...el 9 cabecea por arriba... gooool! golazooo!!!`,
      "GOLPE_AEREO_SALTO_ATA_LE_DEF":
        `...el 9 cabecea... el arquero se queda con el balon...`,
      // GOLPE_AEREO vs TIRO/MANO_A_MANO
      "GOLPE_AEREO_TIJO_MANO_A_MANO":
        `...el 9 cabecea por arriba... gooool! golazooo!!!`
    },
    extra: ``
  },

  "Tiro libre cercano": {
    intro: `Tiro libre para tu equipo al borde del area, es una gran oportunidad para marcar! se prepara para disparar el 10 de tu equipo...`,
    outcomes: {
      "FINTA_MANO_A_MANO":      `...Pateaaaa ¡Ataja el arquero!, no fue bien ejecutado.`,
      "FINTA_REFLEJOS_SALTO":   `...Pateaaa gooool! golazooo!!!, pegada al palo entro la pelota!`,
      "TIRO_REFLEJOS":          `...Pateaaaa ¡Ataja el arquero!, no fue bien ejecutado.`,
      "TIRO_SALTO_MANO_A_MANO": `...Pateaaa gooool! golazooo!!!, pegada al palo entro la pelota!`,
      "GOLPE_AEREO_SALTO":      `...Pateaaaa ¡Ataja el arquero!, no fue bien ejecutado.`,
      "GOLPE_AEREO_TIJO_MANO_A_MANO": `Pateaaa gooool! golazooo!!!, pegada al palo entro la pelota!`,
    },
    extra: ``
  },

  "Falta defensiva": {
    intro: `El equipo rival encara a la defensa de tu equipo...`,
    win:   `...cortas con falta, el entrenador decide que va a cambiar un jugador...`,
    lose:  `...cortas con falta, el entrenador decide que va a cambiar un jugador...`,
    extra: ``
  },

  "Penal a favor": {
    intro: `El 9 de tu equipo encara, pasa a uno, pasa a otro... lo tocan dentro del area...¡El abrito ve una falta y es penal a favor!`,
    outcomes: {
      1: `...pateaaa... gooool! buena definicion!`,
      2: `...pateaa... ataja el arquerooo!`,
      3: `...bombazo a la izquierda!!!... goool! bien definido!`,
      4: `...patea razante a la derecha... goool! bien definido!`,
      5: `...la pica al medio... goool! bien definido!`,
      6: `...pateaaa... arriba del travesaño! Muy mal ejecutado!`
    },
    extra: ``
  },

  "Penal en contra": {
    intro: `El 9 del rival encara... lo tocan dentro del area...y es penal! ¡Penal para el equipo rival!`,
    outcomes: {
      1: `...pateaaa gooool! buena definicion!`,
      2: `...pateaa... ataja el arquero, se queda con el balon!`,
      3: `...patea a la izquierda... goool! bien definido!`,
      4: `...patea a la derecha... goool! bien definido!`,
      5: `...patea al medio... goool! bien definido!`,
      6: `...pateaaa... afueraaa! muy mal ejecutado!`
    },
    extra: ``
  },

  "Centro desde la derecha": {
    intro: `Centro desde la derecha al segundo palo...`,
    win:   `...tu jugador de banda izquierda la para de pecho...ATENTOS ES JUGADA DE GOL!`,
    lose:  `...tu jugador de banda izquierda se pasa de largo y despejan de cabeza y se acaba el peligro.`,
    extra: ``
  },

  "Centro desde la izquierda": {
    intro: `Centro desde la izquierda al segundo palo...`,
    win:   `...tu jugador de banda derecha salta para cabezear ...ATENTOS ES JUGADA DE GOL!`,
    lose:  `...tu jugador de banda derecha no puede superar la defensa, despejan de cabeza y se acaba el peligro.`,
    extra: ``
  },

  "Jugada de gol": {
    intro: `Pase filtrado para el 9 de tu equipo, lo encara al arquero rival en un mano a mano...`,
    win:   `Que ataque potente! Ahi estaaa!....¡GOOOL!!! Golazooo!!!!`,
    outcomes: {
      1: `...el defensor bloquea, pero le queda el rebote!... Goooool!!!`,
      2: `...el arquero ataja! pero le queda muy larga y el delantero patea de nuevo... Gooool!`,
      3: `...el delantero patea, pega en el palo y entra! Goooool!!!`,
      4: `...lo tocan dentro del area... PENAL! Cobra el juez!`,
      5: `...intenta definir, pero ataja el arquerooo!`,
      6: `...pateaaa....afueraaa! besa el palo!`
    },
    extra: ``
  }
};
