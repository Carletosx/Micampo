import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../context/AuthContext';

import FormularioContacto from '../../components/pago/FormularioContacto';
import SeccionDireccion from '../../components/pago/SeccionDireccion';
import ConfirmModal from '../../components/ui/ConfirmModal';
import MetodoEnvio from '../../components/pago/MetodoEnvio';
import MetodoPago from '../../components/pago/MetodoPago';
import ResumenPedido from '../../components/pago/ResumenPedido';
import { createPaymentIntent } from '../../api/payments.js'
import { createOrder } from '../../api/orders.js'

const PagoEnLinea = () => {
  const navigate = useNavigate();
  const { totalPrice, cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Estado del formulario (controlado por el contenedor para arquitectura limpia)
  const [contacto, setContacto] = useState({ nombre: '', apellido: '', email: '', telefono: '' });
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [envio, setEnvio] = useState({ metodo: 'estandar', costo: 10 });
  const [pago, setPago] = useState({ metodo: 'tarjeta', tarjeta: { numero: '', nombre: '', vencimiento: '', cvv: '' } });
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Validaciones sencillas en tiempo real
  const errores = useMemo(() => {
    const errs = {};
    if (!contacto.nombre) errs.nombre = 'Requerido';
    if (!contacto.apellido) errs.apellido = 'Requerido';
    if (!contacto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email)) errs.email = 'Email inválido';
    if (!contacto.telefono || contacto.telefono.length < 9) errs.telefono = 'Teléfono inválido';

    // Validación de tarjeta delegada a Stripe Elements
    return errs;
  }, [contacto, pago]);

  const subtotal = totalPrice || 0;
  const total = useMemo(() => (subtotal + (envio?.costo || 0)), [subtotal, envio]);

  const puedePagar = useMemo(() => aceptaTerminos && Object.keys(errores).length === 0, [aceptaTerminos, errores]);

  React.useEffect(() => {
    const setupStripe = async () => {
      if (pago.metodo !== 'tarjeta') return;
      if (!window.Stripe || !import.meta.env.VITE_STRIPE_PUBLIC_KEY) return;
      const s = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const elements = s.elements({ appearance: { theme: 'stripe' } });
      const ce = elements.create('card', { style: { base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' } } } });
      ce.mount('#stripe-card-element');
      setStripe(s);
      setCardElement(ce);
    };
    setupStripe();
    return () => {
      if (cardElement) try { cardElement.destroy(); } catch {}
      setCardElement(null);
    };
  }, [pago.metodo]);

  const [errorModal, setErrorModal] = useState({ open: false, title: '', message: '' })
  const showError = (msg) => setErrorModal({ open: true, title: 'Error de pago', message: msg || 'No se pudo procesar el pago' })

  const confirmarPago = async () => {
    if (!puedePagar) return;
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    const token = localStorage.getItem('accessToken');
    const metodoPagoReq = pago?.metodo === 'tarjeta' ? 'TARJETA' : pago?.metodo || 'OTRO';
    const metodoEnvioReq = envio?.metodo === 'estandar' ? 'ESTANDAR' : envio?.metodo || 'OTRO';
    const items = cart.map(it => ({
      productoId: it.id,
      nombreProducto: it.name,
      cantidad: it.quantity,
      precioUnitario: it.price
    }));
    const body = {
      metodoPago: metodoPagoReq,
      metodoEnvio: metodoEnvioReq,
      items,
      direccionEntregaId: (direccionSeleccionada && !isNaN(Number(direccionSeleccionada))) ? Number(direccionSeleccionada) : null
    };
    if (!body.items || body.items.length === 0) { showError('Tu carrito está vacío'); return }
    console.log('POST /api/orders/pedidos body:', body, 'token presente:', !!token);
    try {
      if (pago.metodo === 'tarjeta') {
        const intent = await createPaymentIntent({ amount: Math.round(total * 100), currency: 'pen' })
        if (!intent.ok || !intent.data?.clientSecret) { showError('No se pudo iniciar el pago con tarjeta.'); return; }
        if (!stripe || !cardElement) { showError('Stripe no está configurado.'); return; }
        console.log('confirmCardPayment clientSecret:', intent.data.clientSecret)
        const result = await stripe.confirmCardPayment(intent.data.clientSecret, { payment_method: { card: cardElement } })
        console.log('confirmCardPayment result:', result)
        if (result.error) { showError(result.error.message || 'Error de pago'); return; }
      }
      const resp = await createOrder(body)
      if (!resp.ok) { showError(resp?.data?.mensaje || 'Error al crear pedido'); return }
      clearCart();
      const oid = resp?.data?.id
      if (direccionSeleccionada) { try { sessionStorage.setItem('lastAddressId', String(direccionSeleccionada)) } catch {} }
      if (oid) navigate(`/comprador/confirmacion-pedido?id=${oid}`)
      else navigate('/comprador/confirmacion-pedido')
    } catch (e) {
      console.log('Error creando pedido:', e);
      showError('Error de red al crear pedido');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-6 text-sm">
        <Link to="/cart" className="flex items-center text-gray-600 hover:text-green-600"><FaShoppingCart className="mr-2"/>Carrito</Link>
        <span className="mx-3 text-gray-400">→</span>
        <div className="flex items-center text-green-700 font-semibold"><FaCreditCard className="mr-2"/>Pago</div>
        <span className="mx-3 text-gray-400">→</span>
        <div className="flex items-center text-gray-500"><FaCheckCircle className="mr-2"/>Confirmación</div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Finalizar Compra</h1>

      {/* Grid principal: formulario + resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: formulario */}
        <div className="lg:col-span-2 space-y-6">
          <FormularioContacto values={contacto} onChange={setContacto} errors={errores} />
          <SeccionDireccion selected={direccionSeleccionada} onSelect={setDireccionSeleccionada} />
          <MetodoEnvio value={envio} onChange={setEnvio} />
          <MetodoPago value={pago} onChange={setPago} errors={errores} />
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <label className="flex items-center space-x-3 text-sm">
              <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)} />
              <span>Acepto los términos y condiciones y la política de privacidad</span>
            </label>
            <button onClick={confirmarPago} disabled={!puedePagar} className={`px-5 py-3 rounded-md text-white font-medium ${puedePagar ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}>Confirmar y Pagar</button>
          </div>
        </div>

        {/* Columna derecha: resumen */}
        <div className="lg:col-span-1">
          <ResumenPedido envioCosto={envio?.costo || 0} subtotal={subtotal} total={total} />
        </div>
      </div>
      <ConfirmModal isOpen={errorModal.open} title={errorModal.title} message={errorModal.message} confirmText="Cerrar" cancelText="" onConfirm={()=> setErrorModal({ open:false, title:'', message:'' })} onCancel={()=> setErrorModal({ open:false, title:'', message:'' })} />
    </div>
  );
};

export default PagoEnLinea;
