package com.agromarket.autenticacion.repository;

import com.agromarket.autenticacion.domain.TokenRefresco;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioTokenRefresco extends JpaRepository<TokenRefresco, Long> {
  Optional<TokenRefresco> findByToken(String token);
  void deleteByUsuarioId(Long usuarioId);
}
