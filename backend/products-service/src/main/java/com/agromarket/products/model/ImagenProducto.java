package com.agromarket.products.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "imagen_producto")
@Getter
@Setter
public class ImagenProducto {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "producto_id", nullable = false)
  private Producto producto;

  @Column(nullable = false)
  private String url;
}
