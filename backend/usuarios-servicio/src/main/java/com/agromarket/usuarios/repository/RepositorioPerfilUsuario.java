package com.agromarket.usuarios.repository;

import com.agromarket.usuarios.domain.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioPerfilUsuario extends JpaRepository<PerfilUsuario, Long> {
  Optional<PerfilUsuario> findByAuthUsuarioId(Long authUsuarioId);
}
