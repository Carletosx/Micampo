package com.agromarket.usuarios.service;

import com.agromarket.usuarios.domain.Agricultor;
import com.agromarket.usuarios.domain.Comprador;
import com.agromarket.usuarios.events.UsuarioRegistradoEvento;
import com.agromarket.usuarios.repository.RepositorioAgricultor;
import com.agromarket.usuarios.repository.RepositorioComprador;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicioPerfiles {
  private final RepositorioAgricultor repoAgricultor;
  private final RepositorioComprador repoComprador;

  public ServicioPerfiles(RepositorioAgricultor repoAgricultor, RepositorioComprador repoComprador) {
    this.repoAgricultor = repoAgricultor;
    this.repoComprador = repoComprador;
  }

  @Transactional
  public void onUsuarioRegistrado(UsuarioRegistradoEvento evento) {
    if ("AGRICULTOR".equalsIgnoreCase(evento.getRol())) {
      repoAgricultor.findByAuthUsuarioId(evento.getUsuarioId()).orElseGet(() -> repoAgricultor.save(Agricultor.builder().authUsuarioId(evento.getUsuarioId()).calificacion(0.0).ventas(0).build()));
    } else if ("COMPRADOR".equalsIgnoreCase(evento.getRol())) {
      repoComprador.findByAuthUsuarioId(evento.getUsuarioId()).orElseGet(() -> repoComprador.save(Comprador.builder().authUsuarioId(evento.getUsuarioId()).build()));
    }
  }

  public Agricultor obtenerAgricultor(Long id) { return repoAgricultor.findById(id).orElseThrow(); }
  public Agricultor obtenerAgricultorPorAuth(Long authUsuarioId) { return repoAgricultor.findByAuthUsuarioId(authUsuarioId).orElseThrow(); }
  public Agricultor actualizarAgricultor(Long id, String nombre, String telefono) {
    Agricultor a = obtenerAgricultor(id);
    a.setNombre(nombre);
    a.setTelefono(telefono);
    return repoAgricultor.save(a);
  }

  public Comprador obtenerComprador(Long id) { return repoComprador.findById(id).orElseThrow(); }
  public Comprador obtenerCompradorPorAuth(Long authUsuarioId) { return repoComprador.findByAuthUsuarioId(authUsuarioId).orElseThrow(); }
  public Comprador actualizarComprador(Long id, String nombre, String telefono, String tipo) {
    Comprador c = obtenerComprador(id);
    c.setNombre(nombre);
    c.setTelefono(telefono);
    c.setTipo(com.agromarket.usuarios.domain.TipoComprador.valueOf(tipo));
    return repoComprador.save(c);
  }
}
