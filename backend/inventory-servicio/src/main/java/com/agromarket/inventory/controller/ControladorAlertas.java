package com.agromarket.inventory.controller;

import com.agromarket.inventory.domain.AlertaInventario;
import com.agromarket.inventory.repository.RepositorioAlertaInventario;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventario/{productoId}/alertas")
@PreAuthorize("hasRole('AGRICULTOR')")
public class ControladorAlertas {
  private final RepositorioAlertaInventario repo;
  public ControladorAlertas(RepositorioAlertaInventario repo) { this.repo = repo; }

  @GetMapping
  public ResponseEntity<List<AlertaInventario>> listar(@PathVariable Long productoId) { return ResponseEntity.ok(repo.findByProductoId(productoId)); }

  @PostMapping("/{id}/atender")
  public ResponseEntity<AlertaInventario> atender(@PathVariable Long productoId, @PathVariable Long id) {
    AlertaInventario a = repo.findById(id).orElseThrow();
    if (!a.getProductoId().equals(productoId)) throw new IllegalArgumentException("alerta no pertenece al producto");
    a.setAtendida(true);
    return ResponseEntity.ok(repo.save(a));
  }
}

