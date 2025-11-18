package com.agromarket.notifications.controller;

import com.agromarket.notifications.domain.PlantillaNotificacion;
import com.agromarket.notifications.repository.RepositorioPlantilla;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/plantillas")
public class ControladorPlantillas {
  private final RepositorioPlantilla repo;
  public ControladorPlantillas(RepositorioPlantilla repo) { this.repo = repo; }

  @GetMapping
  public ResponseEntity<List<PlantillaNotificacion>> listar() { return ResponseEntity.ok(repo.findAll()); }
  @PostMapping
  public ResponseEntity<PlantillaNotificacion> crear(@Valid @RequestBody PlantillaNotificacion p) { return ResponseEntity.ok(repo.save(p)); }
  @PutMapping("/{id}")
  public ResponseEntity<PlantillaNotificacion> actualizar(@PathVariable Long id, @Valid @RequestBody PlantillaNotificacion p) { p.setId(id); return ResponseEntity.ok(repo.save(p)); }
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long id) { repo.deleteById(id); return ResponseEntity.noContent().build(); }
}

