-- Crear tabla para información adicional del producto y video
CREATE TABLE IF NOT EXISTS producto_detalle (
  id BIGINT NOT NULL AUTO_INCREMENT,
  producto_id BIGINT NOT NULL,
  descripcion_larga TEXT NULL,
  info_adicional TEXT NULL,
  video_url VARCHAR(512) NULL,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_detalle_producto (producto_id),
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
