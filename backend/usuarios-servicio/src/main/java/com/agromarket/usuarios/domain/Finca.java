package com.agromarket.usuarios.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "fincas", indexes = {@Index(name = "idx_fincas_usuario", columnList = "auth_usuario_id")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Finca {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "auth_usuario_id", nullable = false)
  private Long authUsuarioId;

  @Column(length = 160)
  private String nombre;

  @Column(length = 160)
  private String ubicacion;

  @Column(name = "area_ha")
  private Double areaHa;

  @Column(length = 160)
  private String certificacion;

  @Column(name = "foto_url", length = 512)
  private String fotoUrl;

  @Column(name = "video_url", length = 512)
  private String videoUrl;

  @Column(columnDefinition = "TEXT")
  private String descripcion;

  @Column(name = "actualizado_en", nullable = false)
  private Instant actualizadoEn;
}
