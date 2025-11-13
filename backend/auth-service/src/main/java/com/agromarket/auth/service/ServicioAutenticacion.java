package com.agromarket.auth.service;

import com.agromarket.auth.dto.SolicitudOlvidoContrasena;
import com.agromarket.auth.dto.SolicitudInicioSesion;
import com.agromarket.auth.dto.SolicitudRegistro;
import com.agromarket.auth.dto.RespuestaToken;
import com.agromarket.auth.events.EventoBandejaSalida;
import com.agromarket.auth.events.EventoUsuarioRegistrado;
import com.agromarket.auth.model.TokenRefresco;
import com.agromarket.auth.model.Rol;
import com.agromarket.auth.model.Usuario;
import com.agromarket.auth.repo.TokenRefrescoRepositorio;
import com.agromarket.auth.repo.BandejaSalidaRepositorio;
import com.agromarket.auth.repo.UsuarioRepositorio;
import com.agromarket.auth.security.ServicioJwt;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ServicioAutenticacion {

  private final UsuarioRepositorio usuarioRepositorio;
  private final TokenRefrescoRepositorio tokenRefrescoRepositorio;
  private final PasswordEncoder passwordEncoder;
  private final ServicioJwt jwtService;
  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;
  private final BandejaSalidaRepositorio outboxRepository;
  private final ObjectMapper objectMapper;

  public ServicioAutenticacion(UsuarioRepositorio usuarioRepositorio, TokenRefrescoRepositorio tokenRefrescoRepositorio, PasswordEncoder passwordEncoder, ServicioJwt jwtService, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, BandejaSalidaRepositorio outboxRepository, ObjectMapper objectMapper) {
    this.usuarioRepositorio = usuarioRepositorio;
    this.tokenRefrescoRepositorio = tokenRefrescoRepositorio;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
    this.userDetailsService = userDetailsService;
    this.outboxRepository = outboxRepository;
    this.objectMapper = objectMapper;
  }

  public RespuestaToken registrar(SolicitudRegistro request) {
    if (usuarioRepositorio.existsByEmail(request.email())) throw new IllegalStateException("email_ocupado");
    Usuario user = new Usuario();
    user.setEmail(request.email());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(request.role() == null ? Rol.COMPRADOR : request.role());
    usuarioRepositorio.save(user);
    String access = jwtService.generarToken(user.getEmail(), Map.of("roles", new String[]{"ROLE_" + user.getRole().name()}));
    TokenRefresco rt = crearTokenRefresco(user);
    encolarUsuarioRegistrado(user);
    return new RespuestaToken(access, rt.getToken());
  }

  public RespuestaToken iniciarSesion(SolicitudInicioSesion request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
    String access = jwtService.generarToken(userDetails.getUsername(), Map.of("roles", userDetails.getAuthorities().stream().map(a -> a.getAuthority()).toArray()));
    Usuario user = usuarioRepositorio.findByEmail(request.email()).orElseThrow();
    TokenRefresco rt = crearTokenRefresco(user);
    return new RespuestaToken(access, rt.getToken());
  }

  public RespuestaToken refrescar(String refreshToken) {
    TokenRefresco rt = tokenRefrescoRepositorio.findByToken(refreshToken).orElseThrow();
    if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) throw new IllegalStateException("token_refresco_invalido");
    String access = jwtService.generarToken(rt.getUser().getEmail(), Map.of("roles", new String[]{"ROLE_" + rt.getUser().getRole().name()}));
    return new RespuestaToken(access, rt.getToken());
  }

  public boolean validar(String accessToken) {
    return jwtService.esTokenValido(accessToken);
  }

  public void olvidar(SolicitudOlvidoContrasena request) {
  }

  private TokenRefresco crearTokenRefresco(Usuario user) {
    TokenRefresco rt = new TokenRefresco();
    rt.setUser(user);
    rt.setToken(UUID.randomUUID().toString());
    rt.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
    tokenRefrescoRepositorio.save(rt);
    return rt;
  }

  private void encolarUsuarioRegistrado(Usuario user) {
    try {
      EventoUsuarioRegistrado evt = new EventoUsuarioRegistrado(user.getId(), user.getEmail(), user.getRole().name());
      String payload = objectMapper.writeValueAsString(evt);
      EventoBandejaSalida out = new EventoBandejaSalida();
      out.setType("user.registered");
      out.setRoutingKey("user.registered");
      out.setPayload(payload);
      outboxRepository.save(out);
    } catch (Exception e) {
      throw new IllegalStateException("no_se_pudo_encolar_evento");
    }
  }
}
