package com.agromarket.notifications.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "plantilla_notificacion")
@Getter
@Setter
public class PlantillaNotificacion {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true)
  private String nombre;

  @Column(nullable = false)
  private String tipo;

  @Column(columnDefinition = "TEXT")
  private String contenido;
}
