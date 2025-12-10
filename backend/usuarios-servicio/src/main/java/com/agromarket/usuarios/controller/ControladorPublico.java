package com.agromarket.usuarios.controller;

import com.agromarket.usuarios.domain.Agricultor;
import com.agromarket.usuarios.domain.Finca;
import com.agromarket.usuarios.repository.RepositorioAgricultor;
import com.agromarket.usuarios.repository.RepositorioPerfilUsuario;
import com.agromarket.usuarios.domain.PerfilUsuario;
import com.agromarket.usuarios.repository.RepositorioFinca;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/public")
public class ControladorPublico {
  private final RepositorioAgricultor repoAgricultor;
  private final RepositorioFinca repoFinca;
  private final RepositorioPerfilUsuario repoPerfil;
  private final RestTemplate http;
  @Value("${gateway.base-url:http://localhost:8080}")
  private String gatewayBase;
  public ControladorPublico(RepositorioAgricultor repoAgricultor, RepositorioFinca repoFinca, RepositorioPerfilUsuario repoPerfil, RestTemplate http) { this.repoAgricultor = repoAgricultor; this.repoFinca = repoFinca; this.repoPerfil = repoPerfil; this.http = http; }

  @GetMapping("/fincas/by-auth/{authUsuarioId}")
  public ResponseEntity<List<Finca>> fincasPorAuth(@PathVariable Long authUsuarioId) {
    Agricultor a = repoAgricultor.findByAuthUsuarioId(authUsuarioId).orElse(null);
    if (a == null) return ResponseEntity.ok(List.of());
    return ResponseEntity.ok(repoFinca.findByAgricultorId(a.getId(), org.springframework.data.domain.PageRequest.of(0, 10)).getContent());
  }

  @GetMapping("/fincas/by-agricultor/{agricultorId}")
  public ResponseEntity<List<Finca>> fincasPorAgricultor(@PathVariable Long agricultorId) {
    return ResponseEntity.ok(repoFinca.findByAgricultorId(agricultorId, org.springframework.data.domain.PageRequest.of(0, 10)).getContent());
  }

  @GetMapping("/tiendas")
  public ResponseEntity<List<Agricultor>> listarTiendas() {
    // Devuelve hasta 100 agricultores con tiendaNombre no nulo
    var all = repoAgricultor.findAll();
    var res = all.stream().filter(a -> a.getTiendaNombre() != null && !a.getTiendaNombre().isBlank()).limit(100).toList();
    return ResponseEntity.ok(res);
  }

  @GetMapping("/perfil/by-auth/{authUsuarioId}")
  public ResponseEntity<PerfilUsuario> perfilPublico(@PathVariable Long authUsuarioId) {
    return repoPerfil.findByAuthUsuarioId(authUsuarioId)
      .map(ResponseEntity::ok)
      .orElseGet(() -> {
        try {
          var url = gatewayBase + "/api/auth/public/usuarios/" + authUsuarioId;
          var resp = http.getForEntity(url, java.util.Map.class);
          if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) return ResponseEntity.notFound().build();
          var body = resp.getBody();
          String nombre = String.valueOf(body.getOrDefault("nombre", ""));
          String correo = String.valueOf(body.getOrDefault("correo", ""));
          PerfilUsuario p = PerfilUsuario.builder().authUsuarioId(authUsuarioId).nombres(nombre).apellidos("")
            .email(correo).actualizadoEn(java.time.Instant.now()).build();
          PerfilUsuario guardado = repoPerfil.save(p);
          return ResponseEntity.ok(guardado);
        } catch (Exception e) {
          return ResponseEntity.notFound().build();
        }
      });
  }
}
