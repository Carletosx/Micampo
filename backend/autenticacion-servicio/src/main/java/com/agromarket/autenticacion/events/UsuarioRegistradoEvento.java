package com.agromarket.autenticacion.events;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRegistradoEvento extends EventoBase {
  private Long usuarioId;
  private String correo;
  private String rol;
}

