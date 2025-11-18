package com.agromarket.notifications.controller;

import com.agromarket.notifications.domain.Notificacion;
import com.agromarket.notifications.domain.TipoNotificacion;
import com.agromarket.notifications.dto.*;
import com.agromarket.notifications.repository.RepositorioNotificacion;
import com.agromarket.notifications.service.ServicioNotificaciones;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notificaciones")
public class ControladorNotificaciones {
  private final ServicioNotificaciones servicio;
  private final RepositorioNotificacion repo;
  public ControladorNotificaciones(ServicioNotificaciones servicio, RepositorioNotificacion repo) { this.servicio = servicio; this.repo = repo; }

  @PostMapping("/email")
  public ResponseEntity<Notificacion> email(@Valid @RequestBody SolicitudEmail req) { return ResponseEntity.ok(req.getPlantillaId() != null ? servicio.enviarConPlantilla(TipoNotificacion.EMAIL, req.getDestinatario(), req.getPlantillaId()) : servicio.enviar(TipoNotificacion.EMAIL, req.getDestinatario(), req.getAsunto(), req.getContenido())); }

  @PostMapping("/sms")
  public ResponseEntity<Notificacion> sms(@Valid @RequestBody SolicitudSMS req) { return ResponseEntity.ok(req.getPlantillaId() != null ? servicio.enviarConPlantilla(TipoNotificacion.SMS, req.getDestinatario(), req.getPlantillaId()) : servicio.enviar(TipoNotificacion.SMS, req.getDestinatario(), null, req.getContenido())); }

  @PostMapping("/inapp")
  public ResponseEntity<Notificacion> inapp(@Valid @RequestBody SolicitudInApp req) { return ResponseEntity.ok(req.getPlantillaId() != null ? servicio.enviarConPlantilla(TipoNotificacion.INAPP, req.getDestinatario(), req.getPlantillaId()) : servicio.enviar(TipoNotificacion.INAPP, req.getDestinatario(), null, req.getContenido())); }

  @GetMapping
  public ResponseEntity<List<Notificacion>> listar(@RequestParam(required = false) String destinatario) { return ResponseEntity.ok(destinatario != null ? repo.findByDestinatario(destinatario) : repo.findAll()); }
}

