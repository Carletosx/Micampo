package com.agromarket.orders.events;

public final class EventosConfig {
  public static final String EXCHANGE_ORDEN = "order-ex";
  public static final String RK_ORDER_CREATED = "order.created";
  public static final String RK_ORDER_CONFIRMED = "order.confirmed";
  public static final String RK_ORDER_STATUS_CHANGED = "order.status-changed";
  public static final String EXCHANGE_PAYMENT = "payment-ex";
  public static final String RK_PAYMENT_APPROVED = "payment.approved";
  public static final String RK_PAYMENT_FAILED = "payment.failed";
  private EventosConfig() {}
}

