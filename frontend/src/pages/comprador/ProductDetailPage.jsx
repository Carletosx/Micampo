import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHome, FaChevronRight, FaHeart, FaPlay } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { getProduct } from '../../api/products.js';
import { getFincasPublicByAuth } from '../../api/users.js';
import { getProductDetail } from '../../api/productDetails.js';
import { listReviews, createReview, updateReview, deleteReview, fetchAuthorName } from '../../api/reviews.js';
import { API_ORIGIN } from '../../api/config.js';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../context/AuthContext';
import ModalEditarResena from '../../components/productos/ModalEditarResena.jsx'
import Tabs from '../../components/ui/Tabs';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/600x400?text=Sin+imagen';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [product, setProduct] = useState(null);
  const [detail, setDetail] = useState({ descripcionLarga: '', informacionAdicional: '', videoUrl: '' });
  const [fincaInfo, setFincaInfo] = useState(null);
  const [avgRating, setAvgRating] = useState(0)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [reviews, setReviews] = useState([])
  const { user } = useContext(AuthContext)
  const [newAuthorName, setNewAuthorName] = useState('')
  const [editingOpen, setEditingOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const getFromInfoRows = (labels = []) => {
    try {
      const parsed = detail?.informacionAdicional ? JSON.parse(detail.informacionAdicional) : []
      if (!Array.isArray(parsed)) return ''
      const lower = labels.map(l => l.toLowerCase())
      const r = parsed.find(x => lower.includes((x.etiqueta || '').toLowerCase()))
      return r?.valor || ''
    } catch { return '' }
  }
  const toEmbed = (url) => {
    if (!url) return ''
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        let id = ''
        if (u.hostname.includes('youtu.be')) id = u.pathname.replace('/', '')
        else id = u.searchParams.get('v') || ''
        return id ? `https://www.youtube.com/embed/${id}` : ''
      }
      if (u.hostname.includes('vimeo.com')) {
        const parts = u.pathname.split('/').filter(Boolean)
        const id = parts.pop()
        return id ? `https://player.vimeo.com/video/${id}` : ''
      }
      return ''
    } catch { return '' }
  }

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await getProduct(productId);
      if (ok && data && data.activo) {
        setProduct(data);
        if (data.vendedorAuthId) {
          const fp = await getFincasPublicByAuth(data.vendedorAuthId);
          if (fp.ok && Array.isArray(fp.data) && fp.data.length) {
            const f = fp.data[0];
            setFincaInfo({ nombre: f.nombre || '', ubicacion: f.ubicacion || '', descripcion: f.descripcion || '' });
          }
        }
      }
      const r = await getProductDetail(productId);
      if (r.ok && r.data) setDetail(r.data);
      const rv = await listReviews(productId)
      if (rv.ok && Array.isArray(rv.data)) {
        const avg = rv.data.length ? Math.round(rv.data.reduce((s,it)=> s+(it.calificacion||0),0)/rv.data.length) : 0
        setAvgRating(avg)
        // Enriquecer nombres si faltan
        const enriched = await Promise.all(rv.data.map(async (r)=> {
          if (!r.autorNombre && r.autorAuthId) {
            const n = await fetchAuthorName(r.autorAuthId)
            return { ...r, autorNombre: n || null }
          }
          return r
        }))
        setReviews(enriched)
      }
    };
    load();
  }, [productId]);

  // Función para decrementar la cantidad
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Función para incrementar la cantidad
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Función para añadir al carrito
  const handleAddToCart = () => {
    const productToAdd = {
      id: product?.id || productId,
      name: product?.nombre || 'Producto',
      price: Number(product?.precio || 0),
      image: product?.imagenUrl ? (product?.imagenUrl.startsWith('/uploads/') ? `${API_ORIGIN}${product?.imagenUrl}` : product?.imagenUrl) : PLACEHOLDER_IMG,
      quantity: quantity
    };
    
    addToCart(productToAdd);
    
    // Mostrar notificación
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner con título */}
      <div className="bg-green-600 bg-opacity-80 py-12 relative">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/src/assets/images/products/fruits-bg.jpg')",
            opacity: 0.3
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold text-white text-center">DETALLES DEL PRODUCTO</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center mt-2 text-white">
            <Link to="/" className="flex items-center">
              <FaHome className="mr-1" />
              Hogar
            </Link>
            <FaChevronRight className="mx-2" />
            <span>Detalles Del Producto</span>
          </div>
        </div>
      </div>
      
      {/* Toast de notificación */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-white text-green-600 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center transform transition-all duration-500 ease-in-out animate-bounce">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">¡Producto añadido!</p>
            <p className="text-xs text-gray-500">Se ha agregado al carrito correctamente</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Columna izquierda - Imágenes */}
            <div className="md:w-1/2 p-6">
              <div className="relative bg-gray-50 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: '400px' }}>
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Orgánico</span>
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Producto Local</span>
                <img 
                  src={product?.imagenUrl ? (product?.imagenUrl.startsWith('/uploads/') ? `${API_ORIGIN}${product?.imagenUrl}` : product?.imagenUrl) : PLACEHOLDER_IMG} 
                  alt={product?.nombre || ''} 
                  className="w-full h-auto max-h-80 object-contain rounded-lg transition-all duration-300 transform hover:scale-105"
                />
              </div>
              
              {/* Miniaturas */}
              <div className="mt-6" />
            </div>
            
            {/* Columna derecha - Información */}
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold text-gray-800">{product?.nombre || ''}</h2>
              
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span>Stock: {product?.stock ?? 0}</span>
                <span className="mx-2">•</span>
                <span>Categoría: {product?.categoria || ''}</span>
              </div>
              {product && (product.stockMin ?? 0) > 0 && (product.stock ?? 0) <= (product.stockMin ?? 0) && (
                <div className="mt-2">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-700">Stock Bajo</span>
                </div>
              )}
              
              {/* Estrellas de calificación */}
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < avgRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">({avgRating} promedio)</span>
              </div>
              
              {/* Precios */}
              <div className="mt-4 flex items-center">
                <span className="text-xl font-bold text-red-500">S/ {Number(product?.precio || 0).toFixed(2)}</span>
              </div>
              
              {/* Descripción corta */}
              <p className="mt-4 text-gray-600">{product?.descripcion || ''}</p>
              
              {/* Etiquetas */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">Etiquetas:</span>
                <div className="flex flex-wrap mt-1">
                  {(product?.categoria ? [product.categoria] : []).map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Stock */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">En Stock:</span>
                <span className="ml-2 text-green-600">{(product?.stock ?? 0) > 0 ? 'Disponible' : 'Sin stock'}</span>
              </div>
              
              {/* Cantidad */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <div className="flex items-center mt-1">
                  <button 
                    onClick={decrementQuantity}
                    className="bg-gray-200 px-3 py-1 rounded-l"
                  >
                    −
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly
                    className="w-12 text-center border-t border-b border-gray-200 py-1"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="bg-gray-200 px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="md" className="w-full sm:w-auto" onClick={handleAddToCart}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Añadir a la cesta
                </Button>
                <Button variant="secondary" size="md" className="w-full sm:w-auto">
                  <FaHeart className="mr-2" />
                  Añadir a los deseos
                </Button>
              </div>
            </div>
          </div>
          
          {/* Pestañas */}
          <div className="border-t border-gray-200 mt-8">
            <Tabs items={[{ key: 'descripcion', label: 'DESCRIPCIONES' }, { key: 'informacion', label: 'INFORMACIÓN ADICIONAL' }, { key: 'resenas', label: `RESEÑAS (${reviews.length})` }]} active={activeTab} onChange={setActiveTab} />
            
            {/* Contenido de las pestañas */}
            <div className="p-6">
              {activeTab === 'descripcion' && (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/3 pr-6">
                    <p className="text-gray-700 whitespace-pre-line">{detail?.descripcionLarga || ''}</p>
                  </div>
                  <div className="md:w-1/3 mt-4 md:mt-0">
                    <div className="relative rounded-lg overflow-hidden">
                      {detail?.videoUrl ? (
                        detail.videoUrl.endsWith('.mp4') || detail.videoUrl.startsWith('/uploads/') ? (
                          <video className="w-full h-64 md:h-80 rounded" src={detail.videoUrl.startsWith('/uploads/') ? `${API_ORIGIN}${detail.videoUrl}` : detail.videoUrl} controls />
                        ) : (
                          toEmbed(detail.videoUrl) ? (
                            <iframe title="video" className="w-full h-64 md:h-80 rounded" src={toEmbed(detail.videoUrl)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                          ) : (
                            <div className="w-full h-64 md:h-80 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded">Enlace inválido para reproducir</div>
                          )
                        )
                      ) : (
                        <div className="w-full h-64 md:h-80 bg-gray-100 rounded" />
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'informacion' && (
                <div>
                  <h3 className="font-medium text-lg mb-3">Información Adicional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <table className="w-full border-collapse">
                        <tbody>
                          {(() => {
                            let rows = []
                            try {
                              const parsed = detail?.informacionAdicional ? JSON.parse(detail.informacionAdicional) : []
                              if (Array.isArray(parsed)) rows = parsed
                            } catch {}
                            return rows.map((r, i) => (
                              <tr key={i} className="border-b border-gray-200">
                                <td className="py-3 px-3 text-gray-700 font-medium align-top text-left">{r.etiqueta}</td>
                                <td className="py-3 px-3 text-gray-700 align-top text-left">{r.valor}</td>
                              </tr>
                            ))
                          })()}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-md mb-3 text-green-700">Información del Agricultor</h4>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="py-2 px-3 text-gray-700 font-medium text-left">Finca (Marca)</td>
                            <td className="py-2 px-3 text-gray-700 text-left">{(fincaInfo?.nombre || getFromInfoRows(['Marca','Finca'])) || '—'}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-gray-700 font-medium text-left">Ubicación</td>
                            <td className="py-2 px-3 text-gray-700 text-left">{(fincaInfo?.ubicacion || getFromInfoRows(['Ubicación','Ubicacion'])) || '—'}</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-gray-700 font-medium text-left">Descripción de la finca</td>
                            <td className="py-2 px-3 text-gray-700 text-left">{(fincaInfo?.descripcion || getFromInfoRows(['Descripción de la finca','Descripcion de la finca'])) || '—'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'resenas' && (
                <div>
                  <h3 className="font-medium text-lg mb-3">Reseñas de Clientes</h3>
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    {reviews.length === 0 ? (
                      <p className="text-gray-600">Aún no hay reseñas.</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((r, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                <div className="text-sm text-gray-800 font-medium">{r.autorNombre || (r.autorAuthId ? `Usuario ${r.autorAuthId}` : 'Invitado')}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < (r.calificacion||0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                                {user && user.id === r.autorAuthId && (
                                  <div className="flex items-center gap-2">
                                    <button className="text-xs text-green-700" onClick={()=>{ setEditingReview(r); setEditingOpen(true) }}>Editar</button>
                                    <button className="text-xs text-red-600" onClick={async ()=>{
                                      if (!confirm('¿Eliminar esta reseña?')) return
                                      const del = await deleteReview(r.id)
                                      if (del.ok) {
                                        const rv = await listReviews(productId)
                                        if (rv.ok) setReviews(rv.data)
                                      }
                                    }}>Eliminar</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">{r.comentario || ''}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Añadir una reseña</h3>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Tu calificación</label>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} onClick={()=> setNewRating(i+1)} className={`w-6 h-6 cursor-pointer ${i < newRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2" htmlFor="review">Tu reseña</label>
                      <textarea id="review" className="w-full border border-gray-300 rounded-md p-2 h-32" placeholder="Escribe tu opinión sobre este producto..." value={newComment} onChange={(e)=> setNewComment(e.target.value)} />
                    </div>
                    {!user && (
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="author">Tu nombre</label>
                        <input id="author" className="w-full border border-gray-300 rounded-md p-2" placeholder="Tu nombre" value={newAuthorName} onChange={(e)=> setNewAuthorName(e.target.value)} />
                      </div>
                    )}
                    <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors" onClick={async ()=> {
                      if (newRating<=0) return
                      let res
                      if (user) {
                        res = await createReview(productId, { calificacion: newRating, comentario: newComment })
                        if (!res.ok) return
                      } else {
                        const autorNombre = (newAuthorName && newAuthorName.trim().length ? newAuthorName.trim() : 'Invitado')
                        res = await createReview(productId, { calificacion: newRating, comentario: newComment, autorNombre })
                        if (!res.ok) return
                      }
                      if (res.ok) {
                        const rv = await listReviews(productId)
                        if (rv.ok && Array.isArray(rv.data)) {
                          const avg = rv.data.length ? Math.round(rv.data.reduce((s,it)=> s+(it.calificacion||0),0)/rv.data.length) : 0
                          setAvgRating(avg)
                          const enriched2 = await Promise.all(rv.data.map(async (r)=> {
                            if (!r.autorNombre && r.autorAuthId) {
                              const n = await fetchAuthorName(r.autorAuthId)
                              return { ...r, autorNombre: n || null }
                            }
                            return r
                          }))
                          setReviews(enriched2)
                          setNewRating(0); setNewComment(''); setNewAuthorName('')
                        }
                      }
                    }}>ENVIAR</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalEditarResena
        open={editingOpen}
        review={editingReview}
        onClose={()=> setEditingOpen(false)}
        onSave={async ({ calificacion, comentario })=>{
          if (!editingReview) return
          const up = await updateReview(editingReview.id, { calificacion, comentario })
          setEditingOpen(false); setEditingReview(null)
          if (up.ok) {
            const rv = await listReviews(productId)
            if (rv.ok) setReviews(rv.data)
          }
        }}
      />
    </div>
  );
};

export default ProductDetailPage;
