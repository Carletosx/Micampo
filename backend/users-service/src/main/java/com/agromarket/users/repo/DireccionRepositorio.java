package com.agromarket.users.repo;

import com.agromarket.users.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DireccionRepositorio extends JpaRepository<Direccion, UUID> {
  List<Direccion> findByAuthUserId(UUID authUserId);
}
