package com.agromarket.auth.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
public class TokenRefresco {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private Usuario user;

  @Column(nullable = false, unique = true, length = 512)
  private String token;

  @Column(nullable = false)
  private Instant expiresAt;

  @Column(nullable = false)
  private boolean revoked = false;

  @Column(nullable = false)
  private Instant createdAt = Instant.now();
}
