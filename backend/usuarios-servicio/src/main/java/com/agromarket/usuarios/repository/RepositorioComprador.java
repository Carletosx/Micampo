package com.agromarket.usuarios.repository;

import com.agromarket.usuarios.domain.Comprador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioComprador extends JpaRepository<Comprador, Long> {
  Optional<Comprador> findByAuthUsuarioId(Long authUsuarioId);
}

