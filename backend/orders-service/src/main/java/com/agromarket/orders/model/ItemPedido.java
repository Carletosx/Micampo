package com.agromarket.orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "item_pedido")
@Getter
@Setter
public class ItemPedido {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "pedido_id", nullable = false)
  private Pedido pedido;

  @Column(name = "producto_id", nullable = false)
  private UUID productoId;

  @Column(nullable = false)
  private Integer cantidad;

  @Column(nullable = false)
  private BigDecimal precioUnitario;

  @Column(nullable = false)
  private BigDecimal subtotal;
}
