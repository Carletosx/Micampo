package com.agromarket.auth.repo;

import com.agromarket.auth.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepositorio extends JpaRepository<Usuario, UUID> {
  Optional<Usuario> findByEmail(String email);
  boolean existsByEmail(String email);
}
