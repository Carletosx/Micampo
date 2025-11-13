package com.agromarket.notifications.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notificacion")
@Getter
@Setter
public class Notificacion {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String tipo;

  @Column(nullable = false)
  private String destinatario;

  @Column(columnDefinition = "TEXT")
  private String mensaje;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoNotificacion estado = EstadoNotificacion.PENDIENTE;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();
}
