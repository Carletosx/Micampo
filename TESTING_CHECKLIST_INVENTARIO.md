# ✅ Testing Checklist - INVENTARIO

## 1️⃣ CREAR PRODUCTO CON STOCK MÍNIMO ESPECÍFICO
**Paso:**
- Ve a **MisProductos** (Mis Productos)
- Click **"Crear Producto"**
- Llena el formulario con:
  - **Nombre:** `Tomate Premium Test`
  - **Descripción:** `Test de stock mínimo`
  - **Precio:** `15000`
  - **Stock Inicial:** `100`
  - **Stock Mínimo:** `35` ⚠️ (IMPORTANTE: no 20%)
  - **Categoría:** `Hortalizas`
- Click **"Guardar"**
- **Espera confirmación:** "Producto creado exitosamente"

**Validación:** 
- ✅ El producto aparece en la tabla
- ✅ El toast muestra "Inventario inicializado"

---

## 2️⃣ VERIFICAR STOCK MÍNIMO EN INVENTARIO
**Paso:**
- Ve a **Inventario**
- Busca el producto `Tomate Premium Test`
- Verifica las columnas:

| Campo | Valor Esperado |
|-------|----------------|
| **Nombre Producto** | Tomate Premium Test |
| **Stock Actual** | 100 kg |
| **Stock Mínimo** | **35 kg** (NO 20) |
| **Stock Reservado** | 0 kg |
| **Valor Total** | 1.500.000 (100 × 15000) |
| **Estado** | `disponible` (verde) |

**Validación:**
- ✅ Stock Mínimo es **exactamente 35** (no 20)
- ✅ Valor Total se calcula correctamente
- ✅ Estado es verde (stock > mínimo)

---

## 3️⃣ VERIFICAR EN BASE DE DATOS
**En MySQL Workbench:**

```sql
-- Ver el producto creado
SELECT id, nombre, precio, stock, stock_min FROM products_db.productos 
WHERE nombre = 'Tomate Premium Test';

-- Ver el inventario creado
SELECT productoId, stockActual, stockMinimo, stockReservado, estado 
FROM inventory_db.inventario 
WHERE productoId = [ID_DEL_PRODUCTO];
```

**Validación:**
- ✅ products_db.productos: `stock_min = 35`
- ✅ inventory_db.inventario: `stockMinimo = 35`

---

## 4️⃣ ACTUALIZAR STOCK (REDUCIR)
**Paso:**
- En **Inventario**, busca `Tomate Premium Test`
- Click en el botón **"Actualizar Stock"** (ícono de edición)
- Cambia:
  - **Stock Actual:** `100` → `30`
  - **Stock Mínimo:** `35` (déjalo igual)
- Click **"Guardar Cambios"**

**Validación:**
- ✅ Stock Actual ahora es **30 kg**
- ✅ Estado cambió a **`bajo`** (amarillo) porque 30 < 35 (mínimo)
- ✅ Valor Total actualizado a `450.000` (30 × 15000)

---

## 5️⃣ CREAR MOVIMIENTO
**Paso:**
- En **Inventario**, busca `Tomate Premium Test`
- Click **"Registrar Movimiento"** (ícono de documento)
- Llena:
  - **Tipo:** `Entrada`
  - **Cantidad:** `40`
  - **Descripción:** `Recolección de cosecha`
- Click **"Guardar"**

**Validación:**
- ✅ Stock Actual cambió de 30 → 70
- ✅ Estado volvió a **`disponible`** (verde) porque 70 > 35
- ✅ Valor Total ahora es `1.050.000` (70 × 15000)
- ✅ En **Alertas**, desapareció la alerta de stock bajo

---

## 6️⃣ RESERVAR STOCK
**Paso:**
- En **Inventario**, busca `Tomate Premium Test`
- Click **"Reservar Stock"** (ícono de candado)
- **Cantidad a Reservar:** `45`
- Click **"Reservar"**

**Validación:**
- ✅ Stock Actual: **70 kg** (igual)
- ✅ Stock Reservado: **45 kg** (nuevo)
- ✅ Stock Disponible (teórico): 70 - 45 = **25 kg**
- ✅ La reserva aparece en **Movimientos** con tipo `Reserva`

---

## 7️⃣ CONFIRMAR VENTA (Liberar Reserva)
**Paso:**
- En **Inventario**, busca `Tomate Premium Test`
- Click **"Confirmar Venta"** (ícono de check)
- **Cantidad a Confirmar:** `45`
- Click **"Confirmar"**

**Validación:**
- ✅ Stock Actual: **25 kg** (70 - 45)
- ✅ Stock Reservado: **0 kg** (se liberó)
- ✅ Estado: **`bajo`** (amarillo) porque 25 < 35 (mínimo)
- ✅ Aparece alerta en **Alertas** de stock bajo
- ✅ Movimiento registrado como `Confirmación`

---

## 8️⃣ EXPORTAR INVENTARIO
**Paso:**
- En **Inventario**, click **"Exportar CSV"** o **"Exportar JSON"**

**Validación:**
- ✅ El archivo se descarga correctamente
- ✅ Contiene la fila con `Tomate Premium Test`
- ✅ Stock Mínimo = 35 (NO 20) en el archivo
- ✅ Todas las columnas se exportan sin errores

---

## 9️⃣ CREAR SEGUNDO PRODUCTO SIN ESPECIFICAR STOCK MÍNIMO
**Paso:**
- Click **"Crear Producto"**
- Llena:
  - **Nombre:** `Lechuga Fresca`
  - **Stock Inicial:** `80`
  - **Stock Mínimo:** `0` (déjalo vacío o 0)
  - Otros campos como antes
- Click **"Guardar"**

**Validación:**
- ✅ El sistema calcula automáticamente 20% de 80 = 16
- ✅ En Inventario aparece `Stock Mínimo = 16 kg` (comportamiento por defecto)
- ✅ NO debería ser 20, debería ser 20% del stock (16)

---

## 🔟 BÚSQUEDA Y FILTROS
**Paso:**
- En **Inventario**, escribe `Tomate` en la búsqueda
- Filtra por **Estado:** `bajo`
- Cambia **Productos por página:** `5`

**Validación:**
- ✅ Solo aparecen productos que coinciden con la búsqueda
- ✅ Solo aparecen productos con estado `bajo`
- ✅ La paginación funciona correctamente

---

## 📊 RESULTADO FINAL

Si **TODOS los pasos pasan**, significa que:

✅ **Inventario está 100% funcional:**
- ✅ Stock mínimo se captura del formulario (NO recalculado)
- ✅ Se guarda en base de datos correctamente
- ✅ Se muestra sin alteraciones en la UI
- ✅ Actualizar stock funciona
- ✅ Crear movimientos funciona
- ✅ Reservar y liberar stock funciona
- ✅ Alertas de stock bajo funcionan
- ✅ Exportar datos funciona
- ✅ Búsqueda y filtros funcionan

---

## ⚠️ POSIBLES PROBLEMAS Y SOLUCIONES

| Problema | Solución |
|----------|----------|
| Stock Mínimo muestra 20 (no 35) | Recarga frontend: `npm run dev` |
| Error 401 en inventario | Asegúrate que estés logeado como AGRICULTOR |
| Inventario vacío | El producto se creó pero el backend no se ejecutó |
| BD no actualiza | Recarga la página: `F5` |

