package com.agromarket.inventory.repository;

import com.agromarket.inventory.domain.AlertaInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositorioAlertaInventario extends JpaRepository<AlertaInventario, Long> {
  List<AlertaInventario> findByProductoId(Long productoId);
}

