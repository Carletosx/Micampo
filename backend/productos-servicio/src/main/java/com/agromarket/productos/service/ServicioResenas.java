package com.agromarket.productos.service;

import com.agromarket.productos.domain.ResenaProducto;
import com.agromarket.productos.dto.SolicitudCrearResena;
import com.agromarket.productos.repository.RepositorioProducto;
import com.agromarket.productos.dto.ResenaVendedorDTO;
import com.agromarket.productos.repository.RepositorioResenaProducto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Service
public class ServicioResenas {
  private final RepositorioResenaProducto repoResena;
  private final RepositorioProducto repoProducto;

  public ServicioResenas(RepositorioResenaProducto repoResena, RepositorioProducto repoProducto) { this.repoResena = repoResena; this.repoProducto = repoProducto; }

  public List<ResenaProducto> listar(Long productoId) { return repoResena.findByProductoId(productoId); }

  @Transactional
  public ResenaProducto crear(Long productoId, SolicitudCrearResena req, Long authId, String authName) {
    ResenaProducto r = new ResenaProducto();
    r.setProductoId(productoId);
    if (authId != null) {
      r.setAutorAuthId(authId);
      r.setAutorNombre(authName != null ? authName : null);
    } else {
      r.setAutorAuthId(req.getAutorAuthId());
      r.setAutorNombre((req.getAutorNombre() != null && !req.getAutorNombre().isBlank()) ? req.getAutorNombre() : "Invitado");
    }
    r.setCalificacion(req.getCalificacion());
    r.setComentario(req.getComentario());
    r.setCreadoEn(Instant.now());
    return repoResena.save(r);
  }

  public List<ResenaVendedorDTO> listarPorVendedor(Long authUsuarioId) {
    var list = repoResena.findByVendedorAuthId(authUsuarioId);
    java.util.ArrayList<ResenaVendedorDTO> out = new java.util.ArrayList<>();
    for (ResenaProducto r : list) {
      String nombre = null;
      var p = repoProducto.findById(r.getProductoId()).orElse(null);
      if (p != null) nombre = p.getNombre();
      out.add(new ResenaVendedorDTO(r.getId(), r.getProductoId(), nombre, r.getCalificacion(), r.getComentario(), r.getAutorAuthId(), r.getAutorNombre()));
    }
    return out;
  }

  @Transactional
  public ResenaProducto actualizar(Long resenaId, Long authId, Integer nuevaCalificacion, String nuevoComentario) {
    ResenaProducto r = repoResena.findById(resenaId).orElseThrow();
    if (authId == null) throw new IllegalArgumentException("no_autorizado");
    boolean esAutor = r.getAutorAuthId() != null && r.getAutorAuthId().equals(authId);
    boolean esVendedor = false;
    try {
      var p = repoProducto.findById(r.getProductoId()).orElse(null);
      esVendedor = (p != null && p.getVendedorAuthId() != null && p.getVendedorAuthId().equals(authId));
    } catch (Exception ignored) {}
    if (!esAutor && !esVendedor) throw new IllegalArgumentException("no_autorizado");
    if (nuevaCalificacion != null) r.setCalificacion(nuevaCalificacion);
    if (nuevoComentario != null) r.setComentario(nuevoComentario);
    return repoResena.save(r);
  }

  @Transactional
  public void eliminar(Long resenaId, Long authId) {
    ResenaProducto r = repoResena.findById(resenaId).orElseThrow();
    if (authId == null) throw new IllegalArgumentException("no_autorizado");
    boolean esAutor = r.getAutorAuthId() != null && r.getAutorAuthId().equals(authId);
    boolean esVendedor = false;
    try {
      var p = repoProducto.findById(r.getProductoId()).orElse(null);
      esVendedor = (p != null && p.getVendedorAuthId() != null && p.getVendedorAuthId().equals(authId));
    } catch (Exception ignored) {}
    if (!esAutor && !esVendedor) throw new IllegalArgumentException("no_autorizado");
    repoResena.deleteById(resenaId);
  }
}
