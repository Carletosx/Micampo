package com.agromarket.orders.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pedidos", indexes = {@Index(name = "idx_pedidos_usuario", columnList = "usuarioAuthId"), @Index(name = "idx_pedidos_estado", columnList = "estado")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pedido {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String numero;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoPedido estado;
  private String metodoPago;
  private String metodoEnvio;
  @Column(nullable = false)
  private Long usuarioAuthId;
  private Long agricultorAuthId;
  private Long direccionEntregaId;
  @Column(nullable = false)
  private BigDecimal subtotal;
  @Column(nullable = false)
  private BigDecimal envio;
  @Column(nullable = false)
  private BigDecimal descuento;
  @Column(nullable = false)
  private BigDecimal total;
  @Column(nullable = false)
  private Instant creadoEn;
}
