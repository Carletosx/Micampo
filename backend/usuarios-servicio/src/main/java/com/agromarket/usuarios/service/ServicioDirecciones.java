package com.agromarket.usuarios.service;

import com.agromarket.usuarios.domain.Direccion;
import com.agromarket.usuarios.repository.RepositorioDireccion;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ServicioDirecciones {
  private final RepositorioDireccion repoDireccion;

  public ServicioDirecciones(RepositorioDireccion repoDireccion) { this.repoDireccion = repoDireccion; }

  public List<Direccion> listar(Long authUsuarioId) { return repoDireccion.findByAuthUsuarioId(authUsuarioId); }

  @Transactional
  public Direccion crear(Long authUsuarioId, Direccion d) {
    d.setAuthUsuarioId(authUsuarioId);
    return repoDireccion.save(d);
  }

  @Transactional
  public Direccion actualizar(Long authUsuarioId, Long id, Direccion d) {
    Direccion actual = repoDireccion.findById(id).orElseThrow();
    if (!actual.getAuthUsuarioId().equals(authUsuarioId)) throw new IllegalArgumentException("La dirección no pertenece al usuario");
    actual.setTipo(d.getTipo());
    actual.setLinea1(d.getLinea1());
    actual.setLinea2(d.getLinea2());
    actual.setDistrito(d.getDistrito());
    actual.setProvincia(d.getProvincia());
    actual.setDepartamento(d.getDepartamento());
    actual.setReferencia(d.getReferencia());
    actual.setLatitud(d.getLatitud());
    actual.setLongitud(d.getLongitud());
    return repoDireccion.save(actual);
  }

  @Transactional
  public void eliminar(Long authUsuarioId, Long id) {
    Direccion actual = repoDireccion.findById(id).orElseThrow();
    if (!actual.getAuthUsuarioId().equals(authUsuarioId)) throw new IllegalArgumentException("La dirección no pertenece al usuario");
    repoDireccion.deleteById(id);
  }
}
