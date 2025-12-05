package com.agromarket.productos.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "producto_detalle", uniqueConstraints = {@UniqueConstraint(name = "uk_detalle_producto", columnNames = {"producto_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDetalle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "producto_id", nullable = false)
  private Producto producto;

  @Column(name = "descripcion_larga", columnDefinition = "TEXT")
  private String descripcionLarga;

  @Column(name = "info_adicional", columnDefinition = "TEXT")
  private String informacionAdicional;

  @Column(name = "video_url", length = 512)
  private String videoUrl;

  @Column(name = "actualizado_en", nullable = false)
  private Instant actualizadoEn;
}
