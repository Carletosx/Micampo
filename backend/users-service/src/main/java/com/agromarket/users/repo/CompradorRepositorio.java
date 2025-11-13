package com.agromarket.users.repo;

import com.agromarket.users.model.Comprador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompradorRepositorio extends JpaRepository<Comprador, UUID> {
  Optional<Comprador> findByAuthUserId(UUID authUserId);
  Optional<Comprador> findByEmail(String email);
}
