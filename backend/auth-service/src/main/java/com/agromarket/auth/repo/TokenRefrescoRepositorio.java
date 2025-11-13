package com.agromarket.auth.repo;

import com.agromarket.auth.model.TokenRefresco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TokenRefrescoRepositorio extends JpaRepository<TokenRefresco, UUID> {
  Optional<TokenRefresco> findByToken(String token);
}
