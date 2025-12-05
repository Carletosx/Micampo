-- Agregar columna stock_min a la tabla productos
ALTER TABLE productos ADD COLUMN stock_min INT NOT NULL DEFAULT 0;

-- Opcional: inicializar stock_min según alguna lógica (aquí se mantiene en 0)
UPDATE productos SET stock_min = 0 WHERE stock_min IS NULL;

-- Verificar resultado
SELECT id, nombre, stock, stock_min FROM productos LIMIT 20;
