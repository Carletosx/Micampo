package com.agromarket.usuarios.repository;

import com.agromarket.usuarios.domain.Agricultor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioAgricultor extends JpaRepository<Agricultor, Long> {
  Optional<Agricultor> findByAuthUsuarioId(Long authUsuarioId);
}

