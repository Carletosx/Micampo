package com.agromarket.autenticacion.service;

import com.agromarket.autenticacion.domain.TokenRefresco;
import com.agromarket.autenticacion.domain.Usuario;
import com.agromarket.autenticacion.events.EventosConfig;
import com.agromarket.autenticacion.events.PublicadorEventos;
import com.agromarket.autenticacion.events.UsuarioRegistradoEvento;
import com.agromarket.autenticacion.repository.RepositorioTokenRefresco;
import com.agromarket.autenticacion.repository.RepositorioUsuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class ServicioAutenticacion {
  private final RepositorioUsuario repositorioUsuario;
  private final RepositorioTokenRefresco repositorioToken;
  private final PasswordEncoder encriptador;
  private final ServicioJwt servicioJwt;
  private final PublicadorEventos publicadorEventos;

  public ServicioAutenticacion(RepositorioUsuario repositorioUsuario, RepositorioTokenRefresco repositorioToken, PasswordEncoder encriptador, ServicioJwt servicioJwt, PublicadorEventos publicadorEventos) {
    this.repositorioUsuario = repositorioUsuario;
    this.repositorioToken = repositorioToken;
    this.encriptador = encriptador;
    this.servicioJwt = servicioJwt;
    this.publicadorEventos = publicadorEventos;
  }

  @Transactional
  public Usuario registrar(String correo, String contrasenia, String rol) {
    Optional<Usuario> existente = repositorioUsuario.findByCorreo(correo);
    if (existente.isPresent()) throw new IllegalArgumentException("Correo ya registrado");
    if (!("AGRICULTOR".equalsIgnoreCase(rol) || "COMPRADOR".equalsIgnoreCase(rol))) throw new IllegalArgumentException("Rol inválido");
    Usuario u = Usuario.builder().correo(correo).contrasenia(encriptador.encode(contrasenia)).rol(rol).activo(true).build();
    Usuario guardado = repositorioUsuario.save(u);
    UsuarioRegistradoEvento ev = new UsuarioRegistradoEvento();
    ev.setUsuarioId(guardado.getId());
    ev.setCorreo(guardado.getCorreo());
    ev.setRol(guardado.getRol());
    ev.setIdEvento(UUID.randomUUID().toString());
    ev.setFecha(Instant.now());
    ev.setClaveEnrutamiento(EventosConfig.RK_USUARIO_REGISTRADO);
    publicadorEventos.publicarUsuarioRegistrado(ev);
    return guardado;
  }

  public String ingresar(String correo, String contrasenia) {
    Usuario u = repositorioUsuario.findByCorreo(correo).orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
    if (!encriptador.matches(contrasenia, u.getContrasenia())) throw new IllegalArgumentException("Credenciales inválidas");
    return servicioJwt.generarAccessToken(u.getCorreo(), u.getRol(), 15);
  }

  @Transactional
  public String crearTokenRefresco(String correo) {
    Usuario u = repositorioUsuario.findByCorreo(correo).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    repositorioToken.deleteByUsuarioId(u.getId());
    String token = UUID.randomUUID().toString();
    TokenRefresco tr = TokenRefresco.builder().usuarioId(u.getId()).token(token).expiraEn(Instant.now().plusSeconds(30L * 24L * 60L * 60L)).build();
    repositorioToken.save(tr);
    return token;
  }

  public String refrescar(String token) {
    TokenRefresco tr = repositorioToken.findByToken(token).orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));
    if (tr.getExpiraEn().isBefore(Instant.now())) throw new IllegalArgumentException("Refresh token expirado");
    Usuario u = repositorioUsuario.findById(tr.getUsuarioId()).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    return servicioJwt.generarAccessToken(u.getCorreo(), u.getRol(), 15);
  }

  public boolean validar(String accessToken) {
    return servicioJwt.esValido(accessToken);
  }
}
