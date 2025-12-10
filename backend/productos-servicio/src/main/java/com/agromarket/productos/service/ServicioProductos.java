package com.agromarket.productos.service;

import com.agromarket.productos.domain.Categoria;
import com.agromarket.productos.domain.Producto;
import com.agromarket.productos.domain.ProductoDetalle;
import com.agromarket.productos.dto.SolicitudCrearProducto;
import com.agromarket.productos.dto.SolicitudActualizarProducto;
import com.agromarket.productos.dto.DetalleProductoDTO;
import com.agromarket.productos.events.ProductoCreadoEvento;
import com.agromarket.productos.events.EventosConfig;
import com.agromarket.productos.events.PublicadorEventos;
import com.agromarket.productos.repository.RepositorioProducto;
import com.agromarket.productos.repository.RepositorioProductoDetalle;
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
  private final RepositorioProductoDetalle repoDetalle;

  public ServicioProductos(RepositorioProducto repoProducto, PublicadorEventos publicadorEventos, RepositorioProductoDetalle repoDetalle) {
    this.repoProducto = repoProducto;
    this.publicadorEventos = publicadorEventos;
    this.repoDetalle = repoDetalle;
  }

  public Page<Producto> listar(String q, String categoria, Double minPrecio, Double maxPrecio, Integer page, Integer size, Boolean includeInactive) {
    PageRequest pr = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
    Page<Producto> base;
    boolean all = Boolean.TRUE.equals(includeInactive);
    if (q != null && !q.isBlank() && categoria != null && !categoria.isBlank()) {
      base = all ? repoProducto.findByCategoriaAndNombreContainingIgnoreCase(Categoria.valueOf(categoria), q, pr) : repoProducto.findByActivoTrueAndCategoriaAndNombreContainingIgnoreCase(Categoria.valueOf(categoria), q, pr);
    } else if (q != null && !q.isBlank()) {
      base = all ? repoProducto.findByNombreContainingIgnoreCase(q, pr) : repoProducto.findByActivoTrueAndNombreContainingIgnoreCase(q, pr);
    } else if (categoria != null && !categoria.isBlank()) {
      base = all ? repoProducto.findByCategoria(Categoria.valueOf(categoria), pr) : repoProducto.findByActivoTrueAndCategoria(Categoria.valueOf(categoria), pr);
    } else {
      base = all ? repoProducto.findAllBy(pr) : repoProducto.findByActivoTrue(pr);
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
  public Producto crear(SolicitudCrearProducto req, Long vendedorAuthId) {
    Producto p = Producto.builder().nombre(req.getNombre()).descripcion(req.getDescripcion()).precio(req.getPrecio()).stock(req.getStock()).stockMin(req.getStockMin()).categoria(Categoria.valueOf(req.getCategoria())).imagenUrl(req.getImagenUrl()).activo(true).creadoEn(Instant.now()).vendedorAuthId(vendedorAuthId).build();
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
    p.setStockMin(req.getStockMin());
    p.setCategoria(Categoria.valueOf(req.getCategoria()));
    p.setImagenUrl(req.getImagenUrl());
    return repoProducto.save(p);
  }

  @Transactional
  public void eliminar(Long id) {
    repoDetalle.findByProductoId(id).ifPresent(d -> repoDetalle.deleteById(d.getId()));
    repoProducto.deleteById(id);
  }

  @Transactional
  public Producto pausar(Long id) {
    Producto p = obtener(id);
    p.setActivo(false);
    return repoProducto.save(p);
  }

  @Transactional
  public Producto activar(Long id) {
    Producto p = obtener(id);
    p.setActivo(true);
    return repoProducto.save(p);
  }

  public ProductoDetalle obtenerDetalle(Long productoId) {
    return repoDetalle.findByProductoId(productoId).orElseGet(() -> {
      Producto producto = obtener(productoId);
      ProductoDetalle d = ProductoDetalle.builder().producto(producto).actualizadoEn(Instant.now()).build();
      return repoDetalle.save(d);
    });
  }

  @Transactional
  public ProductoDetalle actualizarDetalle(Long productoId, DetalleProductoDTO dto, Long authId) {
    ProductoDetalle det = repoDetalle.findByProductoId(productoId).orElseGet(() -> {
      Producto p = obtener(productoId);
      return ProductoDetalle.builder().producto(p).actualizadoEn(Instant.now()).build();
    });
    if (authId != null) {
      Producto p = det.getProducto();
      if (p.getVendedorAuthId() == null) {
        p.setVendedorAuthId(authId);
        repoProducto.save(p);
      }
    }
    det.setDescripcionLarga(dto.getDescripcionLarga());
    det.setInformacionAdicional(dto.getInformacionAdicional());
    det.setVideoUrl(dto.getVideoUrl());
    det.setActualizadoEn(Instant.now());
    return repoDetalle.save(det);
  }

  @Transactional
  public int asignarVendedorAFaltantes(Long authId) {
    var list = repoProducto.findByVendedorAuthIdIsNull();
    for (Producto p : list) {
      p.setVendedorAuthId(authId);
    }
    repoProducto.saveAll(list);
    return list.size();
  }
}
