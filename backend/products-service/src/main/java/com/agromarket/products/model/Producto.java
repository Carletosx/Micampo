package com.agromarket.products.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "producto")
@Getter
@Setter
public class Producto {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String nombre;

  @Column(length = 2000)
  private String descripcion;

  @Column(nullable = false)
  private BigDecimal precio;

  @Column(nullable = false)
  private Integer stock;

  @ManyToOne
  @JoinColumn(name = "categoria_id", nullable = false)
  private Categoria categoria;

  @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ImagenProducto> imagenes;

  @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ResenaProducto> resenas;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() {
    actualizadoEn = Instant.now();
  }
}
