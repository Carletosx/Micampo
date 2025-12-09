package com.agromarket.usuarios.dto;

import lombok.Getter;
import lombok.Setter;
import java.sql.Date;

@Getter
@Setter
public class PerfilUsuarioDTO {
  private String nombres;
  private String apellidos;
  private String dni;
  private String telefono;
  private String email;
  private String direccion;
  private String ciudad;
  private String departamento;
  private String pais;
  private Date fechaNacimiento;
  private String genero;
  private String avatarUrl;
}
