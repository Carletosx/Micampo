package com.agromarket.productos.service;

import com.agromarket.productos.domain.ResenaProducto;
import com.agromarket.productos.dto.SolicitudCrearResena;
import com.agromarket.productos.repository.RepositorioResenaProducto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Service
public class ServicioResenas {
  private final RepositorioResenaProducto repoResena;

  public ServicioResenas(RepositorioResenaProducto repoResena) { this.repoResena = repoResena; }

  public List<ResenaProducto> listar(Long productoId) { return repoResena.findByProductoId(productoId); }

  @Transactional
  public ResenaProducto crear(Long productoId, SolicitudCrearResena req) {
    ResenaProducto r = ResenaProducto.builder().productoId(productoId).autorAuthId(req.getAutorAuthId()).calificacion(req.getCalificacion()).comentario(req.getComentario()).creadoEn(Instant.now()).build();
    return repoResena.save(r);
  }
}

