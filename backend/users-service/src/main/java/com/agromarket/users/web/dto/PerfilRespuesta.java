package com.agromarket.users.web.dto;

import com.agromarket.users.model.Agricultor;
import com.agromarket.users.model.Comprador;
import com.agromarket.users.model.FincaInfo;

public record PerfilRespuesta(
    String tipo,
    String email,
    String nombres,
    String apellidos,
    String telefono,
    Double calificacion,
    Integer ventas,
    FincaInfo finca,
    String compradorTipo
) {
  public static PerfilRespuesta deAgricultor(Agricultor a) {
    return new PerfilRespuesta("AGRICULTOR", a.getEmail(), a.getNombres(), a.getApellidos(), a.getTelefono(), a.getCalificacion(), a.getVentas(), a.getFincaInfo(), null);
  }
  public static PerfilRespuesta deComprador(Comprador c) {
    return new PerfilRespuesta("COMPRADOR", c.getEmail(), c.getNombres(), c.getApellidos(), c.getTelefono(), null, null, null, c.getTipo());
  }
}
