package com.agromarket.notifications.web;

import com.agromarket.notifications.model.EstadoNotificacion;
import com.agromarket.notifications.model.Notificacion;
import com.agromarket.notifications.model.PlantillaNotificacion;
import com.agromarket.notifications.repo.NotificacionRepositorio;
import com.agromarket.notifications.repo.PlantillaNotificacionRepositorio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class ControladorNotificaciones {

  private final NotificacionRepositorio notificacionRepositorio;
  private final PlantillaNotificacionRepositorio plantillaRepositorio;

  public ControladorNotificaciones(NotificacionRepositorio notificacionRepositorio, PlantillaNotificacionRepositorio plantillaRepositorio) {
    this.notificacionRepositorio = notificacionRepositorio;
    this.plantillaRepositorio = plantillaRepositorio;
  }

  @PostMapping("/email")
  public ResponseEntity<Notificacion> enviarEmail(@RequestParam String destinatario, @RequestParam String mensaje) {
    Notificacion n = new Notificacion();
    n.setTipo("EMAIL");
    n.setDestinatario(destinatario);
    n.setMensaje(mensaje);
    n.setEstado(EstadoNotificacion.ENVIADA);
    return ResponseEntity.ok(notificacionRepositorio.save(n));
  }

  @PostMapping("/sms")
  public ResponseEntity<Notificacion> enviarSms(@RequestParam String destinatario, @RequestParam String mensaje) {
    Notificacion n = new Notificacion();
    n.setTipo("SMS");
    n.setDestinatario(destinatario);
    n.setMensaje(mensaje);
    n.setEstado(EstadoNotificacion.ENVIADA);
    return ResponseEntity.ok(notificacionRepositorio.save(n));
  }

  @PostMapping("/inapp")
  public ResponseEntity<Notificacion> enviarInApp(@RequestParam String destinatario, @RequestParam String mensaje) {
    Notificacion n = new Notificacion();
    n.setTipo("INAPP");
    n.setDestinatario(destinatario);
    n.setMensaje(mensaje);
    n.setEstado(EstadoNotificacion.ENVIADA);
    return ResponseEntity.ok(notificacionRepositorio.save(n));
  }

  @GetMapping("/templates")
  public ResponseEntity<List<PlantillaNotificacion>> listarTemplates() {
    return ResponseEntity.ok(plantillaRepositorio.findAll());
  }

  @PostMapping("/templates")
  public ResponseEntity<PlantillaNotificacion> crearTemplate(@Valid @RequestBody PlantillaNotificacion plantilla) {
    return ResponseEntity.ok(plantillaRepositorio.save(plantilla));
  }
}
