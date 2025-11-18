package com.agromarket.usuarios.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventoBase {
  private String idEvento;
  private Instant fecha;
  private String claveEnrutamiento;
}

