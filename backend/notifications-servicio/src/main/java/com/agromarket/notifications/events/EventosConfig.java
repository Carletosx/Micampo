package com.agromarket.notifications.events;

public final class EventosConfig {
  public static final String EXCHANGE_ORDEN = "order-ex";
  public static final String EXCHANGE_PAGO = "payment-ex";
  public static final String EXCHANGE_INVENTARIO = "inventory-ex";
  public static final String EXCHANGE_USUARIO = "usuario-ex";
  public static final String RK_ORDER_CREATED = "order.created";
  public static final String RK_ORDER_CONFIRMED = "order.confirmed";
  public static final String RK_ORDER_STATUS_CHANGED = "order.status-changed";
  public static final String RK_PAYMENT_APPROVED = "payment.approved";
  public static final String RK_PAYMENT_FAILED = "payment.failed";
  public static final String RK_STOCK_BAJO = "inventory.stock-low";
  public static final String RK_USUARIO_REGISTRADO = "usuario.registrado";
  private EventosConfig() {}
}

