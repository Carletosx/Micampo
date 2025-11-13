package com.agromarket.users.web;
import com.agromarket.users.model.Agricultor;
import com.agromarket.users.model.Comprador;
import com.agromarket.users.model.Direccion;
import com.agromarket.users.model.FincaInfo;
import com.agromarket.users.repo.AgricultorRepositorio;
import com.agromarket.users.repo.CompradorRepositorio;
import com.agromarket.users.repo.DireccionRepositorio;
import com.agromarket.users.web.dto.PerfilRespuesta;
import com.agromarket.users.web.dto.SolicitudActualizarPerfil;
import com.agromarket.users.web.dto.SolicitudDireccion;
import com.agromarket.users.web.dto.SolicitudFinca;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class ControladorUsuarios {

  private final AgricultorRepositorio agricultorRepositorio;
  private final CompradorRepositorio compradorRepositorio;
  private final DireccionRepositorio direccionRepositorio;

  public ControladorUsuarios(AgricultorRepositorio agricultorRepositorio, CompradorRepositorio compradorRepositorio, DireccionRepositorio direccionRepositorio) {
    this.agricultorRepositorio = agricultorRepositorio;
    this.compradorRepositorio = compradorRepositorio;
    this.direccionRepositorio = direccionRepositorio;
  }

  @GetMapping("/profile")
  public ResponseEntity<PerfilRespuesta> obtenerPerfil(@RequestHeader("X-Usuario-Email") String email) {
    return agricultorRepositorio.findByEmail(email)
        .map(PerfilRespuesta::deAgricultor)
        .map(ResponseEntity::ok)
        .or(() -> compradorRepositorio.findByEmail(email).map(PerfilRespuesta::deComprador).map(ResponseEntity::ok))
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/profile")
  public ResponseEntity<Void> actualizarPerfil(@RequestHeader("X-Usuario-Email") String email, @Valid @RequestBody SolicitudActualizarPerfil req) {
    var agric = agricultorRepositorio.findByEmail(email);
    if (agric.isPresent()) {
      Agricultor a = agric.get();
      a.setNombres(req.nombres());
      a.setApellidos(req.apellidos());
      a.setTelefono(req.telefono());
      agricultorRepositorio.save(a);
      return ResponseEntity.noContent().build();
    }
    var comp = compradorRepositorio.findByEmail(email);
    if (comp.isPresent()) {
      Comprador c = comp.get();
      c.setNombres(req.nombres());
      c.setApellidos(req.apellidos());
      c.setTelefono(req.telefono());
      c.setTipo(req.compradorTipo());
      compradorRepositorio.save(c);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/addresses")
  public ResponseEntity<List<Direccion>> listarDirecciones(@RequestHeader("X-Usuario-Email") String email) {
    UUID authId = agricultorRepositorio.findByEmail(email).map(Agricultor::getAuthUserId)
        .or(() -> compradorRepositorio.findByEmail(email).map(Comprador::getAuthUserId)).orElse(null);
    if (authId == null) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(direccionRepositorio.findByAuthUserId(authId));
  }

  @PostMapping("/addresses")
  public ResponseEntity<Direccion> crearDireccion(@RequestHeader("X-Usuario-Email") String email, @Valid @RequestBody SolicitudDireccion req) {
    UUID authId = agricultorRepositorio.findByEmail(email).map(Agricultor::getAuthUserId)
        .or(() -> compradorRepositorio.findByEmail(email).map(Comprador::getAuthUserId)).orElse(null);
    if (authId == null) return ResponseEntity.notFound().build();
    Direccion d = new Direccion();
    d.setAuthUserId(authId);
    d.setEtiqueta(req.etiqueta());
    d.setDireccionCompleta(req.direccionCompleta());
    d.setCiudad(req.ciudad());
    d.setDepartamento(req.departamento());
    d.setDistrito(req.distrito());
    d.setReferencia(req.referencia());
    return ResponseEntity.ok(direccionRepositorio.save(d));
  }

  @PutMapping("/addresses/{id}")
  public ResponseEntity<Void> actualizarDireccion(@PathVariable("id") UUID id, @Valid @RequestBody SolicitudDireccion req) {
    var opt = direccionRepositorio.findById(id);
    if (opt.isEmpty()) return ResponseEntity.status(404).build();
    Direccion d = opt.get();
    d.setEtiqueta(req.etiqueta());
    d.setDireccionCompleta(req.direccionCompleta());
    d.setCiudad(req.ciudad());
    d.setDepartamento(req.departamento());
    d.setDistrito(req.distrito());
    d.setReferencia(req.referencia());
    direccionRepositorio.save(d);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/addresses/{id}")
  public ResponseEntity<Void> eliminarDireccion(@PathVariable("id") UUID id) {
    if (direccionRepositorio.existsById(id)) {
      direccionRepositorio.deleteById(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/farm")
  public ResponseEntity<FincaInfo> obtenerFinca(@RequestHeader("X-Usuario-Email") String email) {
    return agricultorRepositorio.findByEmail(email).map(Agricultor::getFincaInfo)
        .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/farm")
  public ResponseEntity<FincaInfo> actualizarFinca(@RequestHeader("X-Usuario-Email") String email, @Valid @RequestBody SolicitudFinca req) {
    return agricultorRepositorio.findByEmail(email).map(a -> {
      FincaInfo f = a.getFincaInfo();
      if (f == null) {
        f = new FincaInfo();
        f.setAgricultor(a);
      }
      f.setNombre(req.nombre());
      f.setUbicacion(req.ubicacion());
      f.setDescripcion(req.descripcion());
      a.setFincaInfo(f);
      agricultorRepositorio.save(a);
      return ResponseEntity.ok(f);
    }).orElse(ResponseEntity.status(403).<FincaInfo>build());
  }
}
