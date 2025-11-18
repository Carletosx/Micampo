package com.agromarket.autenticacion.repository;

import com.agromarket.autenticacion.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositorioUsuario extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByCorreo(String correo);
}
