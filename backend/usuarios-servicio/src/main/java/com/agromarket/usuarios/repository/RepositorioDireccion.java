package com.agromarket.usuarios.repository;

import com.agromarket.usuarios.domain.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioDireccion extends JpaRepository<Direccion, Long> {
  List<Direccion> findByAuthUsuarioId(Long authUsuarioId);
}

