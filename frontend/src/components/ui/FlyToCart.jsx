import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FlyToCart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { src, rect } = e.detail || {};
      if (!src || !rect) return;
      const id = Date.now() + Math.random();
      setItems((s) => [...s, { id, src, rect }]);
    };

    window.addEventListener('fly-to-cart', handler);
    return () => window.removeEventListener('fly-to-cart', handler);
  }, []);

  const onComplete = (id) => {
    setItems((s) => s.filter(i => i.id !== id));
  };

  if (!items.length) return null;

  return createPortal(
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        {items.map(item => (
          <FlyItem key={item.id} item={item} onDone={() => onComplete(item.id)} />
        ))}
      </AnimatePresence>
    </div>, document.body
  );
};

const FlyItem = ({ item, onDone }) => {
  const cartEl = document.getElementById('cart-icon');
  const endRect = cartEl ? cartEl.getBoundingClientRect() : { x: window.innerWidth - 60, y: 20, width: 40, height: 40 };

  const start = { x: item.rect.left, y: item.rect.top, w: item.rect.width, h: item.rect.height };
  const end = { x: endRect.left + endRect.width / 2 - start.w / 2, y: endRect.top + endRect.height / 2 - start.h / 2, scale: 0.2 };

  return (
    <motion.img
      src={item.src}
      initial={{ x: start.x, y: start.y, width: start.w, height: start.h, opacity: 1 }}
      animate={{ x: end.x, y: end.y, width: start.w * end.scale, height: start.h * end.scale, opacity: 0.9 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999, borderRadius: 8 }}
      onAnimationComplete={onDone}
    />
  );
};

export default FlyToCart;
