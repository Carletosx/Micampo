package com.agromarket.productos.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "productos", indexes = {@Index(name = "idx_productos_categoria", columnList = "categoria"), @Index(name = "idx_productos_activo", columnList = "activo")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, length = 120)
  private String nombre;
  @Column(length = 500)
  private String descripcion;
  @Column(nullable = false)
  private BigDecimal precio;
  @Column(nullable = false)
  private Integer stock;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Categoria categoria;
  private String imagenUrl;
  @Column(nullable = false)
  private Boolean activo;
  @Column(nullable = false)
  private Instant creadoEn;
}

