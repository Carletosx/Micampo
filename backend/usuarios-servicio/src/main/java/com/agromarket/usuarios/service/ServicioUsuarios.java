package com.agromarket.usuarios.service;

import com.agromarket.usuarios.domain.PerfilUsuario;
import com.agromarket.usuarios.domain.Finca;
import com.agromarket.usuarios.dto.PerfilUsuarioDTO;
import com.agromarket.usuarios.dto.FincaDTO;
import com.agromarket.usuarios.repository.RepositorioPerfilUsuario;
import com.agromarket.usuarios.repository.RepositorioFinca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
public class ServicioUsuarios {
  private final RepositorioPerfilUsuario repoPerfil;
  private final RepositorioFinca repoFinca;

  public ServicioUsuarios(RepositorioPerfilUsuario repoPerfil, RepositorioFinca repoFinca) {
    this.repoPerfil = repoPerfil;
    this.repoFinca = repoFinca;
  }

  public PerfilUsuario obtenerPerfil(Long authUsuarioId) {
    return repoPerfil.findByAuthUsuarioId(authUsuarioId).orElseGet(() -> {
      PerfilUsuario p = new PerfilUsuario();
      p.setAuthUsuarioId(authUsuarioId);
      p.setActualizadoEn(Instant.now());
      return repoPerfil.save(p);
    });
  }

  @Transactional
  public PerfilUsuario actualizarPerfil(Long authUsuarioId, PerfilUsuarioDTO dto) {
    PerfilUsuario p = obtenerPerfil(authUsuarioId);
    p.setNombres(dto.getNombres());
    p.setApellidos(dto.getApellidos());
    p.setDni(dto.getDni());
    p.setTelefono(dto.getTelefono());
    p.setEmail(dto.getEmail());
    p.setDireccion(dto.getDireccion());
    p.setCiudad(dto.getCiudad());
    p.setDepartamento(dto.getDepartamento());
    p.setPais(dto.getPais());
    p.setFechaNacimiento(dto.getFechaNacimiento());
    p.setGenero(dto.getGenero());
    p.setAvatarUrl(dto.getAvatarUrl());
    p.setActualizadoEn(Instant.now());
    return repoPerfil.save(p);
  }

  public Page<Finca> listarFincas(Long authUsuarioId, Integer page, Integer size) {
    PageRequest pr = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
    return repoFinca.findByAuthUsuarioId(authUsuarioId, pr);
  }

  @Transactional
  public Finca crearFinca(Long authUsuarioId, FincaDTO dto) {
    Finca f = Finca.builder().authUsuarioId(authUsuarioId).nombre(dto.getNombre()).ubicacion(dto.getUbicacion()).areaHa(dto.getAreaHa()).certificacion(dto.getCertificacion()).fotoUrl(dto.getFotoUrl()).videoUrl(dto.getVideoUrl()).descripcion(dto.getDescripcion()).actualizadoEn(Instant.now()).build();
    return repoFinca.save(f);
  }

  @Transactional
  public Finca actualizarFinca(Long fincaId, Long authUsuarioId, FincaDTO dto) {
    Finca f = repoFinca.findById(fincaId).orElseThrow();
    if (!f.getAuthUsuarioId().equals(authUsuarioId)) throw new RuntimeException("No autorizado");
    f.setNombre(dto.getNombre());
    f.setUbicacion(dto.getUbicacion());
    f.setAreaHa(dto.getAreaHa());
    f.setCertificacion(dto.getCertificacion());
    f.setFotoUrl(dto.getFotoUrl());
    f.setVideoUrl(dto.getVideoUrl());
    f.setDescripcion(dto.getDescripcion());
    f.setActualizadoEn(Instant.now());
    return repoFinca.save(f);
  }

  @Transactional
  public void eliminarFinca(Long fincaId, Long authUsuarioId) {
    Finca f = repoFinca.findById(fincaId).orElseThrow();
    if (!f.getAuthUsuarioId().equals(authUsuarioId)) throw new RuntimeException("No autorizado");
    repoFinca.deleteById(fincaId);
  }
}
