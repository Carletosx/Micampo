package com.agromarket.notifications.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "plantillas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlantillaNotificacion {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String nombre;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private CanalPlantilla canal;
  private String asunto;
  @Column(nullable = false, length = 1000)
  private String contenido;
}

