package com.agromarket.orders.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "items_pedido", indexes = {@Index(name = "idx_items_pedido_pedidoId", columnList = "pedidoId")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItemPedido {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long pedidoId;
  @Column(nullable = false)
  private Long productoId;
  @Column(nullable = false)
  private String nombreProducto;
  @Column(nullable = false)
  private Integer cantidad;
  @Column(nullable = false)
  private BigDecimal precioUnitario;
}

