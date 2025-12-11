package com.agromarket.autenticacion.service;

import com.agromarket.autenticacion.domain.TokenRefresco;
import com.agromarket.autenticacion.domain.Usuario;
import com.agromarket.autenticacion.events.EventosConfig;
import com.agromarket.autenticacion.events.PublicadorEventos;
import com.agromarket.autenticacion.events.UsuarioRegistradoEvento;
import com.agromarket.autenticacion.repository.RepositorioTokenRefresco;
import com.agromarket.autenticacion.repository.RepositorioUsuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  private static final Logger log = LoggerFactory.getLogger(ServicioAutenticacion.class);

  public ServicioAutenticacion(RepositorioUsuario repositorioUsuario, RepositorioTokenRefresco repositorioToken, PasswordEncoder encriptador, ServicioJwt servicioJwt, PublicadorEventos publicadorEventos) {
    this.repositorioUsuario = repositorioUsuario;
    this.repositorioToken = repositorioToken;
    this.encriptador = encriptador;
    this.servicioJwt = servicioJwt;
    this.publicadorEventos = publicadorEventos;
  }

  @Transactional
  public Usuario registrar(String correo, String nombre, String contrasenia, String rol) {
    long t0 = System.nanoTime();
    Optional<Usuario> existente = repositorioUsuario.findByCorreo(correo);
    if (existente.isPresent()) throw new IllegalArgumentException("Correo ya registrado");
    if (!("AGRICULTOR".equalsIgnoreCase(rol) || "COMPRADOR".equalsIgnoreCase(rol) || "ADMIN".equalsIgnoreCase(rol))) throw new IllegalArgumentException("Rol inválido");
    long t1 = System.nanoTime();
    String hash = encriptador.encode(contrasenia);
    long t2 = System.nanoTime();
    Usuario u = Usuario.builder().correo(correo).nombre(nombre).contrasenia(hash).rol(rol).activo(true).build();
    Usuario guardado = repositorioUsuario.save(u);
    long t3 = System.nanoTime();
    UsuarioRegistradoEvento ev = new UsuarioRegistradoEvento();
    ev.setUsuarioId(guardado.getId());
    ev.setCorreo(guardado.getCorreo());
    ev.setRol(guardado.getRol());
    ev.setIdEvento(UUID.randomUUID().toString());
    ev.setFecha(Instant.now());
    ev.setClaveEnrutamiento(EventosConfig.RK_USUARIO_REGISTRADO);
    publicadorEventos.publicarUsuarioRegistrado(ev);
    long t4 = System.nanoTime();
    log.info("registro etapas ms find:{} hash:{} save:{} event:{}", Math.round((t1 - t0)/1_000_000.0), Math.round((t2 - t1)/1_000_000.0), Math.round((t3 - t2)/1_000_000.0), Math.round((t4 - t3)/1_000_000.0));
    return guardado;
  }

  public String ingresar(String correo, String contrasenia) {
    long t0 = System.nanoTime();
    Usuario u = repositorioUsuario.findByCorreo(correo).orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
    long t1 = System.nanoTime();
    boolean ok = encriptador.matches(contrasenia, u.getContrasenia());
    long t2 = System.nanoTime();
    if (!ok) throw new IllegalArgumentException("Credenciales inválidas");
    String token = servicioJwt.generarAccessToken(u.getCorreo(), u.getRol(), u.getId(), u.getNombre(), 15);
    long t3 = System.nanoTime();
    log.info("ingreso etapas ms find:{} match:{} jwt:{}", Math.round((t1 - t0)/1_000_000.0), Math.round((t2 - t1)/1_000_000.0), Math.round((t3 - t2)/1_000_000.0));
    return token;
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
    return servicioJwt.generarAccessToken(u.getCorreo(), u.getRol(), u.getId(), u.getNombre(), 15);
  }

  public boolean validar(String accessToken) {
    return servicioJwt.esValido(accessToken);
  }

  public Usuario obtenerPorId(Long id) {
    return repositorioUsuario.findById(id).orElse(null);
  }

  @Transactional
  public Usuario actualizarPerfil(String correo, String nombre, String avatarUrl) {
    Usuario u = repositorioUsuario.findByCorreo(correo).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    if (nombre != null && !nombre.isBlank()) u.setNombre(nombre);
    if (avatarUrl != null && !avatarUrl.isBlank()) u.setAvatarUrl(avatarUrl);
    return repositorioUsuario.save(u);
  }
}
