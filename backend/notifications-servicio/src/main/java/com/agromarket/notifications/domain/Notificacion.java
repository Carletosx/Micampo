package com.agromarket.notifications.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "notificaciones", indexes = {@Index(name = "idx_notif_dest", columnList = "destinatario")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notificacion {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoNotificacion tipo;
  @Column(nullable = false)
  private String mensaje;
  @Column(nullable = false)
  private String destinatario;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoNotificacion estado;
  @Column(nullable = false)
  private Instant creadoEn;
}

