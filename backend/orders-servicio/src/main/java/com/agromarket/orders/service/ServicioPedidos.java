package com.agromarket.orders.service;

import com.agromarket.orders.domain.*;
import com.agromarket.orders.dto.*;
import com.agromarket.orders.events.*;
import com.agromarket.orders.repository.*;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class ServicioPedidos {
  private final RepositorioPedido repoPedido;
  private final RepositorioItemPedido repoItem;
  private final RepositorioHistorialEstado repoHist;
  private final RabbitTemplate rabbitTemplate;
  private final TopicExchange intercambioOrden;

  public ServicioPedidos(RepositorioPedido repoPedido, RepositorioItemPedido repoItem, RepositorioHistorialEstado repoHist, RabbitTemplate rabbitTemplate, TopicExchange intercambioOrden) {
    this.repoPedido = repoPedido;
    this.repoItem = repoItem;
    this.repoHist = repoHist;
    this.rabbitTemplate = rabbitTemplate;
    this.intercambioOrden = intercambioOrden;
  }

  public Page<Pedido> listar(Long usuarioAuthId, Long agricultorAuthId, String estado, Integer page, Integer size) {
    PageRequest pr = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
    if (usuarioAuthId != null) return repoPedido.findByUsuarioAuthId(usuarioAuthId, pr);
    if (agricultorAuthId != null) return repoPedido.findByAgricultorAuthId(agricultorAuthId, pr);
    if (estado != null && !estado.isBlank()) return repoPedido.findByEstado(EstadoPedido.valueOf(estado), pr);
    return repoPedido.findAll(pr);
  }

  public Pedido obtener(Long id) { return repoPedido.findById(id).orElseThrow(); }

  @Transactional
  public Pedido crear(SolicitudCrearPedido req) {
    String numero = UUID.randomUUID().toString();
    Pedido p = Pedido.builder().numero(numero).estado(EstadoPedido.PENDIENTE).metodoPago(req.getMetodoPago()).metodoEnvio(req.getMetodoEnvio()).usuarioAuthId(req.getUsuarioAuthId()).agricultorAuthId(req.getAgricultorAuthId()).subtotal(BigDecimal.ZERO).envio(BigDecimal.ZERO).descuento(BigDecimal.ZERO).total(BigDecimal.ZERO).creadoEn(Instant.now()).build();
    Pedido saved = repoPedido.save(p);
    BigDecimal subtotal = BigDecimal.ZERO;
    List<ItemPedido> items = new ArrayList<>();
    for (SolicitudCrearPedido.Item it : req.getItems()) {
      ItemPedido item = ItemPedido.builder().pedidoId(saved.getId()).productoId(it.getProductoId()).nombreProducto(it.getNombreProducto()).cantidad(it.getCantidad()).precioUnitario(it.getPrecioUnitario()).build();
      items.add(repoItem.save(item));
      subtotal = subtotal.add(it.getPrecioUnitario().multiply(BigDecimal.valueOf(it.getCantidad())));
    }
    BigDecimal envio = BigDecimal.valueOf(10);
    BigDecimal descuento = BigDecimal.ZERO;
    BigDecimal total = subtotal.add(envio).subtract(descuento);
    saved.setSubtotal(subtotal);
    saved.setEnvio(envio);
    saved.setDescuento(descuento);
    saved.setTotal(total);
    repoPedido.save(saved);
    repoHist.save(HistorialEstado.builder().pedidoId(saved.getId()).estado(EstadoPedido.PENDIENTE).timestamp(Instant.now()).build());
    try {
      PedidoCreadoEvento ev = new PedidoCreadoEvento();
      ev.setPedidoId(saved.getId());
      ev.setUsuarioAuthId(saved.getUsuarioAuthId());
      List<PedidoCreadoEvento.Item> evItems = new ArrayList<>();
      for (ItemPedido ip : items) { PedidoCreadoEvento.Item e = new PedidoCreadoEvento.Item(); e.productoId = ip.getProductoId(); e.cantidad = ip.getCantidad(); evItems.add(e); }
      ev.setItems(evItems);
      ev.setIdEvento(UUID.randomUUID().toString());
      ev.setFecha(Instant.now());
      ev.setClaveEnrutamiento(EventosConfig.RK_ORDER_CREATED);
      rabbitTemplate.convertAndSend(intercambioOrden.getName(), EventosConfig.RK_ORDER_CREATED, ev);
    } catch (Exception ignored) {}
    return saved;
  }

  @Transactional
  public Pedido agregarItem(Long pedidoId, SolicitudItem req) {
    Pedido p = obtener(pedidoId);
    ItemPedido item = repoItem.save(ItemPedido.builder().pedidoId(pedidoId).productoId(req.getProductoId()).nombreProducto(req.getNombreProducto()).cantidad(req.getCantidad()).precioUnitario(req.getPrecioUnitario()).build());
    recalcularTotales(pedidoId);
    return obtener(pedidoId);
  }

  @Transactional
  public void eliminarItem(Long pedidoId, Long itemId) {
    ItemPedido it = repoItem.findById(itemId).orElseThrow();
    if (!it.getPedidoId().equals(pedidoId)) throw new IllegalArgumentException("item no pertenece al pedido");
    repoItem.deleteById(itemId);
    recalcularTotales(pedidoId);
  }

  public Map<String, BigDecimal> totales(Long pedidoId) {
    Pedido p = obtener(pedidoId);
    Map<String, BigDecimal> map = new HashMap<>();
    map.put("subtotal", p.getSubtotal());
    map.put("envio", p.getEnvio());
    map.put("descuento", p.getDescuento());
    map.put("total", p.getTotal());
    return map;
  }

  @Transactional
  public Pedido cambiarEstado(Long pedidoId, String estado, String nota) {
    Pedido p = obtener(pedidoId);
    EstadoPedido nuevo = EstadoPedido.valueOf(estado);
    if (p.getEstado() == EstadoPedido.PENDIENTE && (nuevo == EstadoPedido.CONFIRMADO || nuevo == EstadoPedido.CANCELADO)) {}
    else if (p.getEstado() == EstadoPedido.CONFIRMADO && nuevo == EstadoPedido.EN_PREPARACION) {}
    else if (p.getEstado() == EstadoPedido.EN_PREPARACION && nuevo == EstadoPedido.EN_CAMINO) {}
    else if (p.getEstado() == EstadoPedido.EN_CAMINO && nuevo == EstadoPedido.ENTREGADO) {}
    else throw new IllegalArgumentException("transicion invalida");
    p.setEstado(nuevo);
    repoPedido.save(p);
    repoHist.save(HistorialEstado.builder().pedidoId(pedidoId).estado(nuevo).timestamp(Instant.now()).nota(nota).build());
    try {
      CambioEstadoEvento ev = new CambioEstadoEvento();
      ev.setPedidoId(pedidoId);
      ev.setEstado(nuevo.name());
      ev.setIdEvento(UUID.randomUUID().toString());
      ev.setFecha(Instant.now());
      ev.setClaveEnrutamiento(EventosConfig.RK_ORDER_STATUS_CHANGED);
      rabbitTemplate.convertAndSend(intercambioOrden.getName(), EventosConfig.RK_ORDER_STATUS_CHANGED, ev);
      if (nuevo == EstadoPedido.CONFIRMADO) {
        PedidoConfirmadoEvento cv = new PedidoConfirmadoEvento();
        cv.setPedidoId(pedidoId);
        cv.setIdEvento(UUID.randomUUID().toString());
        cv.setFecha(Instant.now());
        cv.setClaveEnrutamiento(EventosConfig.RK_ORDER_CONFIRMED);
        rabbitTemplate.convertAndSend(intercambioOrden.getName(), EventosConfig.RK_ORDER_CONFIRMED, cv);
      }
    } catch (Exception ignored) {}
    return p;
  }

  @Transactional
  public void onPaymentApproved(Long pedidoId) {
    Pedido p = obtener(pedidoId);
    if (p.getEstado() == EstadoPedido.PENDIENTE) cambiarEstado(pedidoId, EstadoPedido.CONFIRMADO.name(), "pago aprobado");
  }

  @Transactional
  public void onPaymentFailed(Long pedidoId) {
    Pedido p = obtener(pedidoId);
    if (p.getEstado() == EstadoPedido.PENDIENTE) cambiarEstado(pedidoId, EstadoPedido.CANCELADO.name(), "pago fallido");
  }

  private void recalcularTotales(Long pedidoId) {
    Pedido p = obtener(pedidoId);
    List<ItemPedido> items = repoItem.findByPedidoId(pedidoId);
    BigDecimal subtotal = BigDecimal.ZERO;
    for (ItemPedido it : items) subtotal = subtotal.add(it.getPrecioUnitario().multiply(BigDecimal.valueOf(it.getCantidad())));
    BigDecimal envio = BigDecimal.valueOf(10);
    BigDecimal descuento = BigDecimal.ZERO;
    BigDecimal total = subtotal.add(envio).subtract(descuento);
    p.setSubtotal(subtotal); p.setEnvio(envio); p.setDescuento(descuento); p.setTotal(total);
    repoPedido.save(p);
  }
}

