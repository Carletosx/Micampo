package com.agromarket.orders.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentApprovedEvento extends EventoBase {
  private Long pedidoId;
}

