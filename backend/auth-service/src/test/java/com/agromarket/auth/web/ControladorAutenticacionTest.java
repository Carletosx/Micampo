package com.agromarket.auth.web;

import com.agromarket.auth.dto.SolicitudInicioSesion;
import com.agromarket.auth.dto.SolicitudRegistro;
import com.agromarket.auth.dto.RespuestaToken;
import com.agromarket.auth.model.Rol;
import com.agromarket.auth.service.ServicioAutenticacion;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ControladorAutenticacionTest {

  private MockMvc mvc;
  private ObjectMapper mapper;
  private ServicioAutenticacion authService;

  @BeforeEach
  void setup() {
    authService = Mockito.mock(ServicioAutenticacion.class);
    mapper = new ObjectMapper();
    mvc = MockMvcBuilders.standaloneSetup(new ControladorAutenticacion(authService)).build();
  }

  @Test
  void registerOk() throws Exception {
    Mockito.when(authService.registrar(Mockito.any())).thenReturn(new RespuestaToken("a","r"));
    SolicitudRegistro req = new SolicitudRegistro("user@example.com","Passw0rd!", Rol.COMPRADOR);
    mvc.perform(post("/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(mapper.writeValueAsString(req)))
        .andExpect(status().isOk());
  }

  @Test
  void loginOk() throws Exception {
    Mockito.when(authService.iniciarSesion(Mockito.any())).thenReturn(new RespuestaToken("a","r"));
    SolicitudInicioSesion req = new SolicitudInicioSesion("user@example.com","Passw0rd!");
    mvc.perform(post("/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(mapper.writeValueAsString(req)))
        .andExpect(status().isOk());
  }
}
