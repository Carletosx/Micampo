package com.agromarket.products.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resena_producto")
@Getter
@Setter
public class ResenaProducto {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "producto_id", nullable = false)
  private Producto producto;

  @Column(nullable = false)
  private Integer calificacion;

  @Column(length = 2000)
  private String comentario;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();
}
