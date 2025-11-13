package com.agromarket.orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedido")
@Getter
@Setter
public class Pedido {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true)
  private String numero;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoPedido estado = EstadoPedido.PENDIENTE;

  @Column(nullable = false)
  private BigDecimal subtotal = BigDecimal.ZERO;

  @Column(nullable = false)
  private BigDecimal costoEnvio = BigDecimal.ZERO;

  @Column(nullable = false)
  private BigDecimal descuento = BigDecimal.ZERO;

  @Column(nullable = false)
  private BigDecimal total = BigDecimal.ZERO;

  private String metodoPago;
  private String metodoEnvio;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ItemPedido> items;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<HistorialEstado> historial;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() {
    actualizadoEn = Instant.now();
  }
}
