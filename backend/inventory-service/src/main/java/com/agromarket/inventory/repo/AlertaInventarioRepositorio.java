package com.agromarket.inventory.repo;

import com.agromarket.inventory.model.AlertaInventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AlertaInventarioRepositorio extends JpaRepository<AlertaInventario, UUID> {}
