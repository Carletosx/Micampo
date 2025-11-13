CREATE DATABASE IF NOT EXISTS products_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE products_db;

CREATE TABLE IF NOT EXISTS categoria (
  id CHAR(36) PRIMARY KEY,
  nombre VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS producto (
  id CHAR(36) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL,
  categoria_id CHAR(36) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE IF NOT EXISTS imagen_producto (
  id CHAR(36) PRIMARY KEY,
  producto_id CHAR(36) NOT NULL,
  url VARCHAR(512) NOT NULL,
  CONSTRAINT fk_imagen_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

CREATE TABLE IF NOT EXISTS resena_producto (
  id CHAR(36) PRIMARY KEY,
  producto_id CHAR(36) NOT NULL,
  calificacion INT NOT NULL,
  comentario TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_resena_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

CREATE TABLE IF NOT EXISTS outbox (
  id CHAR(36) PRIMARY KEY,
  type VARCHAR(128) NOT NULL,
  routing_key VARCHAR(256) NOT NULL,
  payload TEXT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  publicado TINYINT(1) NOT NULL DEFAULT 0,
  publicado_en TIMESTAMP NULL
);

CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_producto_categoria ON producto(categoria_id);
