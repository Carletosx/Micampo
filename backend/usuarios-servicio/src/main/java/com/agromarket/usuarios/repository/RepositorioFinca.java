package com.agromarket.usuarios.repository;

import com.agromarket.usuarios.domain.Finca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RepositorioFinca extends JpaRepository<Finca, Long> {
  Page<Finca> findByAuthUsuarioId(Long authUsuarioId, Pageable pageable);
}
