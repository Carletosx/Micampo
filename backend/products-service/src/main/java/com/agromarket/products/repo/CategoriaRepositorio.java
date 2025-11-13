package com.agromarket.products.repo;

import com.agromarket.products.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoriaRepositorio extends JpaRepository<Categoria, UUID> {
  Optional<Categoria> findByNombre(String nombre);
}
