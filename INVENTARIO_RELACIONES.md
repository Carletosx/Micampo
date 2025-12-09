# 🔗 RELACIONES DE INVENTARIO CON OTRAS PARTES DE LA APP

## 1️⃣ INVENTARIO ↔ MIS PRODUCTOS (AGRICULTOR)

**Relación DIRECTA:**
- Cuando creas un producto en **MisProductos** → se inicializa automáticamente en **Inventario**
- Cuando editas stock en **Inventario** → el stock se refleja en **MisProductos**
- Cuando eliminas un producto en **MisProductos** → también se elimina su inventario

**Flujo:**
```
MisProductos (crear)
    ↓
Backend guarda producto en products_db
    ↓
Backend genera evento product.created
    ↓
RabbitMQ dispara evento
    ↓
Inventory Service crea inventario automáticamente
    ↓
Inventario muestra el producto
```

**Código que lo hace:**
- `frontend/src/pages/agricultor/MisProductos.jsx` línea 128-139
- Función `inicializarInventario(productoId, stock, stockMin)`

---

## 2️⃣ INVENTARIO ↔ PRODUCTOS (CATÁLOGO PÚBLICO)

**Relación INDIRECTA:**
- Los productos en el catálogo público muestran **disponibilidad** basada en inventario
- Si stock = 0 → botón "Comprar" deshabilitado
- Si stock bajo (< mínimo) → badge "Pocas unidades"

**NO hay integración directa aún** (esto se implementaría después)

---

## 3️⃣ INVENTARIO ↔ ORDENES (COMPRADOR)

**Relación DIRECTA:**
- Cuando un COMPRADOR hace una orden → se **RESERVA** stock en inventario
- La orden no deduce stock inmediatamente, solo lo **bloquea**

**Flujo:**
```
Orden creada (COMPRADOR)
    ↓
OrderService emite orden.created
    ↓
InventoryService escucha el evento
    ↓
Ejecuta reservarStock(productoId, cantidad)
    ↓
Stock Reservado aumenta
    ↓
Inventario muestra el stock como "bloqueado"
```

**Estados en Inventario:**
- **Stock Actual:** unidades totales disponibles
- **Stock Reservado:** unidades en órdenes pendientes
- **Stock Disponible (teórico):** Stock Actual - Stock Reservado

---

## 4️⃣ INVENTARIO ↔ PAGOS (TRANSACCIONES)

**Relación DIRECTA:**
- Cuando un COMPRADOR **CONFIRMA EL PAGO** de una orden → se ejecuta `confirmarVenta()`
- Esto **DEDUCE** el stock reservado del stock actual

**Flujo:**
```
Pago confirmado (COMPRADOR)
    ↓
PaymentService emite pago.confirmado
    ↓
OrderService actualiza estado a "CONFIRMADO"
    ↓
InventoryService escucha el evento
    ↓
Ejecuta confirmarVenta(productoId, cantidad)
    ↓
Stock Actual se REDUCE
    ↓
Stock Reservado se LIBERA
    ↓
Alertas de stock bajo se generan
```

**Ejemplo:**
- Producto tiene: Stock Actual = 100, Stock Mínimo = 35
- Orden 1: Reserva 45 unidades → Stock Reservado = 45, Stock Disponible = 55
- Pago confirmado → Stock Actual = 55 (100 - 45)
- Si 55 < 35? NO → Estado "disponible"

---

## 5️⃣ INVENTARIO ↔ ALERTAS (NOTIFICACIONES)

**Relación DIRECTA:**
- Cuando stock cae **por debajo del mínimo** → se genera una **ALERTA**
- Las alertas aparecen en:
  - **Inventario** → pestana "Alertas"
  - **Dashboard** → widget de "Alertas Activas"
  - **Notificaciones** → si está integrado el servicio

**Flujo:**
```
Stock se reduce (por confirmación de venta, por movimiento negativo, etc)
    ↓
InventoryService valida: ¿Stock < Mínimo?
    ↓
SÍ → Genera AlertaStockBajo
    ↓
Guarda en BD: alerts_db.alertas
    ↓
NotificationsService envía notificación al AGRICULTOR
    ↓
AGRICULTOR ve alerta en Inventario/Dashboard
```

**Estados de Alerta:**
- 🔴 **CRÍTICO:** Stock < 10 unidades
- 🟡 **BAJO:** 10 < Stock < Mínimo
- 🟢 **DISPONIBLE:** Stock ≥ Mínimo

---

## 6️⃣ INVENTARIO ↔ DASHBOARD (AGRICULTOR)

**Relación:**

| Widget | Obtiene datos de | Acción |
|--------|-----------------|--------|
| **Stock Total** | inventory_db.inventario (SUM stockActual) | Lee |
| **Productos Bajos** | inventory_db.inventario (WHERE stockActual < stockMinimo) | Lee |
| **Alertas Activas** | alerts_db.alertas (WHERE estado = ACTIVA) | Lee |
| **Últimos Movimientos** | inventory_db.movimientos (ORDER BY fecha DESC LIMIT 5) | Lee |
| **Valor Total de Inventario** | SUM(stockActual × precio) | Lee |

**Ejemplo de datos que vería el Dashboard:**
```
Stock Total: 450 kg
Productos Bajos: 3 (lechuga, tomate, cebolla)
Alertas Activas: 1 (Tomate stock crítico)
Últimos Movimientos: 
  - Entrada 40 kg Tomate (hoy 10:30)
  - Salida 30 kg Lechuga (hoy 09:15)
  - Confirmación 45 kg Zanahoria (ayer 14:20)
Valor Total Inventario: $2.850.000
```

---

## 7️⃣ INVENTARIO ↔ REPORTES (ESTADÍSTICAS)

**Relación INDIRECTA:**
- Los reportes de "Productos Vendidos", "Ingresos" se basan en **movimientos de inventario**
- Los reportes de "Stock Histórico" se basan en **inventario.stockActual a través del tiempo**

**Datos que usa:**
- `inventory_db.movimientos` → para gráficos de entrada/salida
- `inventory_db.inventario` → para estado actual del stock
- `orders_db.ordenes` → para correlacionar con ventas

---

## 8️⃣ INVENTARIO ↔ USUARIOS/PERFIL (AGRICULTOR)

**Relación INDIRECTA:**
- El AGRICULTOR ve sus productos en **MisProductos**
- El AGRICULTOR maneja el inventario de esos productos en **Inventario**
- El perfil muestra si es AGRICULTOR (rol) para habilitar estas funciones

**Seguridad:**
```
@PreAuthorize("hasRole('AGRICULTOR')")
GET /api/inventory/{productoId} → Solo el AGRICULTOR propietario
PUT /api/inventory/{productoId} → Solo el AGRICULTOR propietario
```

---

## 📊 DIAGRAMA COMPLETO DE RELACIONES

```
┌─────────────────────────────────────────────────────────────────┐
│                     AGRICULTOR (Portal)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MisProductos (crear/editar)  ←→  Inventario (gestionar stock) │
│        ↓                                      ↑                  │
│        └──→ inicializarInventario()──────────┘                  │
│                                                                  │
│  Dashboard ←──── (lee) ────── Alertas de Inventario             │
│    (Stock total, Bajos,                                          │
│     Alertas activas, etc)                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Eventos RabbitMQ)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ProductosService ──[product.created]──→ InventoryService      │
│       (crea producto)                    (inicializa stock)     │
│                                                                  │
│  OrderService ───[orden.created]───→ InventoryService           │
│   (orden creada)                     (reserva stock)            │
│                                                                  │
│  PaymentService ──[pago.confirmado]──→ InventoryService        │
│  (pago procesado)                      (confirma venta)         │
│                                                                  │
│  InventoryService ──[alerta.generada]──→ NotificationsService  │
│  (stock bajo)                           (envía notificación)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                        BASES DE DATOS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  products_db.productos ──[stockMin, stock]──→ inventory_db     │
│                                               .inventario        │
│                                                                  │
│  inventory_db.movimientos ──[registra]──→ inventory_db          │
│  (entrada, salida, reserva, confirmación)    .alertas           │
│                                                                  │
│  orders_db.ordenes ←──[referencias]──→ inventory_db             │
│                                        .reservas                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                      COMPRADOR (Portal)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Ver Productos (con disponibilidad) ←── Inventario (stock)      │
│         ↓                                                        │
│  Hacer Orden ──[reserva stock]──→ InventoryService             │
│         ↓                                                        │
│  Pagar ──[confirma venta]──→ InventoryService                  │
│         ↓                                                        │
│  Stock se deduce del AGRICULTOR                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ ACCIONES QUE SÍ ESTÁN RELACIONADAS CON INVENTARIO

1. ✅ **Crear Producto** (MisProductos) → Inicializa inventario
2. ✅ **Editar Producto** (MisProductos) → Puede actualizar precio (afecta valor de inventario)
3. ✅ **Actualizar Stock** (Inventario) → Manualmente
4. ✅ **Registrar Movimiento** (Inventario) → Entrada/Salida manual
5. ✅ **Reservar Stock** (Inventario automático) → Cuando COMPRADOR crea orden
6. ✅ **Confirmar Venta** (Inventario automático) → Cuando COMPRADOR paga
7. ✅ **Generar Alertas** (Inventario automático) → Cuando stock < mínimo
8. ✅ **Ver Dashboard** (AGRICULTOR) → Lee datos de inventario
9. ✅ **Exportar Inventario** (Inventario) → CSV/JSON con todos los datos
10. ✅ **Ver Reportes** (Estadísticas) → Analiza movimientos de inventario

---

## ⚠️ ACCIONES QUE NO ESTÁN RELACIONADAS DIRECTAMENTE

- ❌ **Chat/Mensajes** → No afecta inventario
- ❌ **Calificaciones** → No afecta inventario
- ❌ **Editar Perfil** → No afecta inventario (salvo si afecta rol)
- ❌ **Ver Favoritos** → No afecta inventario (aunque se mostraría disponibilidad)

---

## 🎯 EN RESUMEN

**Inventario es el CORAZÓN de la aplicación:**
- El AGRICULTOR lo usa para gestionar su stock
- El COMPRADOR depende de él para saber qué comprar
- El Dashboard lo resume para visibility
- Las Alertas se generan basadas en él
- Los Reportes se basan en sus datos históricos

**Si Inventario falla → toda la cadena de vendedor → comprador → pago se rompe**

