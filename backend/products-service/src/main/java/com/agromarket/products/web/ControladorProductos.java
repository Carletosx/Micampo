package com.agromarket.products.web;

import com.agromarket.products.events.EventoBandejaSalida;
import com.agromarket.products.events.EventoProductoCreado;
import com.agromarket.products.model.Categoria;
import com.agromarket.products.model.ImagenProducto;
import com.agromarket.products.model.Producto;
import com.agromarket.products.model.ResenaProducto;
import com.agromarket.products.repo.BandejaSalidaRepositorio;
import com.agromarket.products.repo.CategoriaRepositorio;
import com.agromarket.products.repo.ImagenProductoRepositorio;
import com.agromarket.products.repo.ProductoRepositorio;
import com.agromarket.products.repo.ResenaProductoRepositorio;
import com.agromarket.products.web.dto.SolicitudImagen;
import com.agromarket.products.web.dto.SolicitudProducto;
import com.agromarket.products.web.dto.SolicitudResena;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ControladorProductos {

  private final ProductoRepositorio productoRepositorio;
  private final CategoriaRepositorio categoriaRepositorio;
  private final ImagenProductoRepositorio imagenRepositorio;
  private final ResenaProductoRepositorio resenaRepositorio;
  private final BandejaSalidaRepositorio outboxRepositorio;
  private final ObjectMapper mapper;

  public ControladorProductos(ProductoRepositorio productoRepositorio, CategoriaRepositorio categoriaRepositorio, ImagenProductoRepositorio imagenRepositorio, ResenaProductoRepositorio resenaRepositorio, BandejaSalidaRepositorio outboxRepositorio, ObjectMapper mapper) {
    this.productoRepositorio = productoRepositorio;
    this.categoriaRepositorio = categoriaRepositorio;
    this.imagenRepositorio = imagenRepositorio;
    this.resenaRepositorio = resenaRepositorio;
    this.outboxRepositorio = outboxRepositorio;
    this.mapper = mapper;
  }

  @GetMapping
  public ResponseEntity<List<Producto>> listar(@RequestParam(value = "q", required = false) String q,
                                               @RequestParam(value = "categoriaId", required = false) UUID categoriaId,
                                               @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
                                               @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice) {
    return ResponseEntity.ok(productoRepositorio.buscar(q, categoriaId, minPrice, maxPrice));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Producto> obtener(@PathVariable("id") UUID id) {
    return productoRepositorio.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Producto> crear(@Valid @RequestBody SolicitudProducto req) throws Exception {
    Categoria cat = categoriaRepositorio.findByNombre(req.categoria()).orElseGet(() -> {
      Categoria c = new Categoria();
      c.setNombre(req.categoria());
      return categoriaRepositorio.save(c);
    });
    Producto p = new Producto();
    p.setNombre(req.nombre());
    p.setDescripcion(req.descripcion());
    p.setPrecio(req.precio());
    p.setStock(req.stock());
    p.setCategoria(cat);
    p = productoRepositorio.save(p);
    EventoProductoCreado evt = new EventoProductoCreado(p.getId(), p.getNombre(), p.getPrecio(), p.getStock(), p.getCategoria().getNombre());
    EventoBandejaSalida out = new EventoBandejaSalida();
    out.setType("product.created");
    out.setRoutingKey("product.created");
    out.setPayload(mapper.writeValueAsString(evt));
    outboxRepositorio.save(out);
    return ResponseEntity.ok(p);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Producto> actualizar(@PathVariable("id") UUID id, @Valid @RequestBody SolicitudProducto req) {
    return productoRepositorio.findById(id).map(p -> {
      Categoria cat = categoriaRepositorio.findByNombre(req.categoria()).orElseGet(() -> {
        Categoria c = new Categoria();
        c.setNombre(req.categoria());
        return categoriaRepositorio.save(c);
      });
      p.setNombre(req.nombre());
      p.setDescripcion(req.descripcion());
      p.setPrecio(req.precio());
      p.setStock(req.stock());
      p.setCategoria(cat);
      return ResponseEntity.ok(productoRepositorio.save(p));
    }).orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable("id") UUID id) {
    if (productoRepositorio.existsById(id)) {
      productoRepositorio.deleteById(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/categories")
  public ResponseEntity<List<Categoria>> categorias() {
    return ResponseEntity.ok(categoriaRepositorio.findAll());
  }

  @PostMapping("/{id}/images")
  public ResponseEntity<ImagenProducto> agregarImagen(@PathVariable("id") UUID id, @Valid @RequestBody SolicitudImagen req) {
    return productoRepositorio.findById(id).map(p -> {
      ImagenProducto img = new ImagenProducto();
      img.setProducto(p);
      img.setUrl(req.url());
      return ResponseEntity.ok(imagenRepositorio.save(img));
    }).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/{id}/reviews")
  public ResponseEntity<ResenaProducto> agregarResena(@PathVariable("id") UUID id, @Valid @RequestBody SolicitudResena req) {
    return productoRepositorio.findById(id).map(p -> {
      ResenaProducto r = new ResenaProducto();
      r.setProducto(p);
      r.setCalificacion(req.calificacion());
      r.setComentario(req.comentario());
      return ResponseEntity.ok(resenaRepositorio.save(r));
    }).orElse(ResponseEntity.notFound().build());
  }
}
