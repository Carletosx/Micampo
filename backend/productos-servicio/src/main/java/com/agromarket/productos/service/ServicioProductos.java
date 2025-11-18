package com.agromarket.productos.service;

import com.agromarket.productos.domain.Categoria;
import com.agromarket.productos.domain.Producto;
import com.agromarket.productos.dto.SolicitudCrearProducto;
import com.agromarket.productos.dto.SolicitudActualizarProducto;
import com.agromarket.productos.events.ProductoCreadoEvento;
import com.agromarket.productos.events.EventosConfig;
import com.agromarket.productos.events.PublicadorEventos;
import com.agromarket.productos.repository.RepositorioProducto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.PageImpl;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioProductos {
  private final RepositorioProducto repoProducto;
  private final PublicadorEventos publicadorEventos;

  public ServicioProductos(RepositorioProducto repoProducto, PublicadorEventos publicadorEventos) {
    this.repoProducto = repoProducto;
    this.publicadorEventos = publicadorEventos;
  }

  public Page<Producto> listar(String q, String categoria, Double minPrecio, Double maxPrecio, Integer page, Integer size) {
    PageRequest pr = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
    Page<Producto> base;
    if (q != null && !q.isBlank() && categoria != null && !categoria.isBlank()) {
      base = repoProducto.findByActivoTrueAndCategoriaAndNombreContainingIgnoreCase(Categoria.valueOf(categoria), q, pr);
    } else if (q != null && !q.isBlank()) {
      base = repoProducto.findByActivoTrueAndNombreContainingIgnoreCase(q, pr);
    } else if (categoria != null && !categoria.isBlank()) {
      base = repoProducto.findByActivoTrueAndCategoria(Categoria.valueOf(categoria), pr);
    } else {
      base = repoProducto.findByActivoTrue(pr);
    }
    if (minPrecio != null || maxPrecio != null) {
      List<Producto> filtrados = base.getContent().stream().filter(p -> {
        boolean ok = true;
        if (minPrecio != null) ok = ok && p.getPrecio().doubleValue() >= minPrecio;
        if (maxPrecio != null) ok = ok && p.getPrecio().doubleValue() <= maxPrecio;
        return ok;
      }).collect(Collectors.toList());
      return new PageImpl<>(filtrados, pr, filtrados.size());
    }
    return base;
  }

  public Producto obtener(Long id) { return repoProducto.findById(id).orElseThrow(); }

  @Transactional
  public Producto crear(SolicitudCrearProducto req) {
    Producto p = Producto.builder().nombre(req.getNombre()).descripcion(req.getDescripcion()).precio(req.getPrecio()).stock(req.getStock()).categoria(Categoria.valueOf(req.getCategoria())).imagenUrl(req.getImagenUrl()).activo(true).creadoEn(Instant.now()).build();
    Producto saved = repoProducto.save(p);
    ProductoCreadoEvento ev = new ProductoCreadoEvento();
    ev.setProductoId(saved.getId());
    ev.setNombre(saved.getNombre());
    ev.setCategoria(saved.getCategoria().name());
    ev.setStock(saved.getStock());
    ev.setIdEvento(UUID.randomUUID().toString());
    ev.setFecha(Instant.now());
    ev.setClaveEnrutamiento(EventosConfig.RK_PRODUCTO_CREADO);
    publicadorEventos.publicarProductoCreado(ev);
    return saved;
  }

  @Transactional
  public Producto actualizar(Long id, SolicitudActualizarProducto req) {
    Producto p = obtener(id);
    p.setNombre(req.getNombre());
    p.setDescripcion(req.getDescripcion());
    p.setPrecio(req.getPrecio());
    p.setStock(req.getStock());
    p.setCategoria(Categoria.valueOf(req.getCategoria()));
    p.setImagenUrl(req.getImagenUrl());
    return repoProducto.save(p);
  }

  @Transactional
  public void eliminar(Long id) {
    Producto p = obtener(id);
    p.setActivo(false);
    repoProducto.save(p);
  }
}
