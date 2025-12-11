package com.agromarket.usuarios.service;

import com.agromarket.usuarios.domain.PerfilUsuario;
import com.agromarket.usuarios.domain.Finca;
import com.agromarket.usuarios.domain.Agricultor;
import com.agromarket.usuarios.dto.PerfilUsuarioDTO;
import com.agromarket.usuarios.dto.FincaDTO;
import com.agromarket.usuarios.repository.RepositorioPerfilUsuario;
import com.agromarket.usuarios.repository.RepositorioFinca;
import com.agromarket.usuarios.repository.RepositorioAgricultor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
public class ServicioUsuarios {
  private final RepositorioPerfilUsuario repoPerfil;
  private final RepositorioFinca repoFinca;
  private final RepositorioAgricultor repoAgricultor;

  public ServicioUsuarios(RepositorioPerfilUsuario repoPerfil, RepositorioFinca repoFinca, RepositorioAgricultor repoAgricultor) {
    this.repoPerfil = repoPerfil;
    this.repoFinca = repoFinca;
    this.repoAgricultor = repoAgricultor;
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
    if (dto.getNombres() != null) p.setNombres(dto.getNombres());
    if (dto.getApellidos() != null) p.setApellidos(dto.getApellidos());
    if (dto.getDni() != null) p.setDni(dto.getDni());
    if (dto.getTelefono() != null) p.setTelefono(dto.getTelefono());
    if (dto.getEmail() != null) p.setEmail(dto.getEmail());
    if (dto.getDireccion() != null) p.setDireccion(dto.getDireccion());
    if (dto.getCiudad() != null) p.setCiudad(dto.getCiudad());
    if (dto.getDepartamento() != null) p.setDepartamento(dto.getDepartamento());
    if (dto.getPais() != null) p.setPais(dto.getPais());
    if (dto.getFechaNacimiento() != null) p.setFechaNacimiento(dto.getFechaNacimiento());
    if (dto.getGenero() != null) p.setGenero(dto.getGenero());
    if (dto.getAvatarUrl() != null) p.setAvatarUrl(dto.getAvatarUrl());
    p.setActualizadoEn(Instant.now());
    return repoPerfil.save(p);
  }

  public Page<Finca> listarFincas(Long authUsuarioId, Integer page, Integer size) {
    PageRequest pr = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
    Agricultor a = repoAgricultor.findByAuthUsuarioId(authUsuarioId).orElseGet(() -> repoAgricultor.save(Agricultor.builder().authUsuarioId(authUsuarioId).build()));
    return repoFinca.findByAgricultorId(a.getId(), pr);
  }

  @Transactional
  public Finca crearFinca(Long authUsuarioId, FincaDTO dto) {
    Agricultor a = repoAgricultor.findByAuthUsuarioId(authUsuarioId).orElseGet(() -> repoAgricultor.save(Agricultor.builder().authUsuarioId(authUsuarioId).build()));
    Finca f = Finca.builder().agricultorId(a.getId()).nombre(dto.getNombre()).ubicacion(dto.getUbicacion()).areaHa(dto.getAreaHa()).certificacion(dto.getCertificacion()).fotoUrl(dto.getFotoUrl()).videoUrl(dto.getVideoUrl()).descripcion(dto.getDescripcion()).actualizadoEn(Instant.now()).build();
    return repoFinca.save(f);
  }

  @Transactional
  public Finca actualizarFinca(Long fincaId, Long authUsuarioId, FincaDTO dto) {
    Finca f = repoFinca.findById(fincaId).orElseThrow();
    Agricultor a = repoAgricultor.findByAuthUsuarioId(authUsuarioId).orElseThrow();
    if (!f.getAgricultorId().equals(a.getId())) throw new RuntimeException("No autorizado");
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
    Agricultor a = repoAgricultor.findByAuthUsuarioId(authUsuarioId).orElseThrow();
    if (!f.getAgricultorId().equals(a.getId())) throw new RuntimeException("No autorizado");
    repoFinca.deleteById(fincaId);
  }
}
