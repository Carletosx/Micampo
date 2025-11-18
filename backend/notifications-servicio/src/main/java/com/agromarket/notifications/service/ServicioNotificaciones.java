package com.agromarket.notifications.service;

import com.agromarket.notifications.domain.*;
import com.agromarket.notifications.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
public class ServicioNotificaciones {
  private final RepositorioNotificacion repoNotif;
  private final RepositorioPlantilla repoPlantilla;

  public ServicioNotificaciones(RepositorioNotificacion repoNotif, RepositorioPlantilla repoPlantilla) {
    this.repoNotif = repoNotif;
    this.repoPlantilla = repoPlantilla;
  }

  @Transactional
  public Notificacion enviar(TipoNotificacion tipo, String destinatario, String asunto, String contenido) {
    String mensaje = tipo == TipoNotificacion.EMAIL && asunto != null ? (asunto + ": " + contenido) : contenido;
    Notificacion n = Notificacion.builder().tipo(tipo).destinatario(destinatario).mensaje(mensaje).estado(EstadoNotificacion.ENVIADA).creadoEn(Instant.now()).build();
    return repoNotif.save(n);
  }

  @Transactional
  public Notificacion enviarConPlantilla(TipoNotificacion tipo, String destinatario, Long plantillaId) {
    PlantillaNotificacion p = repoPlantilla.findById(plantillaId).orElseThrow();
    if ((tipo == TipoNotificacion.EMAIL && p.getCanal() != CanalPlantilla.EMAIL) || (tipo == TipoNotificacion.SMS && p.getCanal() != CanalPlantilla.SMS) || (tipo == TipoNotificacion.INAPP && p.getCanal() != CanalPlantilla.INAPP)) throw new IllegalArgumentException("canal_incompatible");
    return enviar(tipo, destinatario, p.getAsunto(), p.getContenido());
  }
}

