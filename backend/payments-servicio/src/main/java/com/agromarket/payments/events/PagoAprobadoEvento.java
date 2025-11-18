package com.agromarket.payments.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PagoAprobadoEvento {
  private String idEvento;
  private Instant fecha;
  private String claveEnrutamiento;
  private Long pedidoId;
  private Long pagoId;
  private String monto;
}

