package com.agromarket.autenticacion.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "tokens_refresco")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenRefresco {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long usuarioId;
  @Column(nullable = false, unique = true)
  private String token;
  @Column(nullable = false)
  private Instant expiraEn;
}
