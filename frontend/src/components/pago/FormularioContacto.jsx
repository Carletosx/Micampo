import React from 'react';

const Input = ({ label, value, onChange, name, type = 'text', error, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))}
      placeholder={placeholder}
      className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${error ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const FormularioContacto = ({ values, onChange, errors }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre" name="nombre" value={values.nombre} onChange={onChange} error={errors?.nombre} placeholder="Ej. María" />
        <Input label="Apellido" name="apellido" value={values.apellido} onChange={onChange} error={errors?.apellido} placeholder="Ej. García" />
        <Input label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors?.email} placeholder="nombre@correo.com" />
        <Input label="Teléfono" name="telefono" value={values.telefono} onChange={onChange} error={errors?.telefono} placeholder="+51 987 654 321" />
      </div>
    </section>
  );
};

export default FormularioContacto;