package com.agromarket.users.repo;

import com.agromarket.users.model.Agricultor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AgricultorRepositorio extends JpaRepository<Agricultor, UUID> {
  Optional<Agricultor> findByAuthUserId(UUID authUserId);
  Optional<Agricultor> findByEmail(String email);
}
