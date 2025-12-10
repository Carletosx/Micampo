import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { NotificationContext } from '../../contexts/NotificationContext'
import { getPerfil } from '../../api/users.js'

const PerfilComprador = () => {
  const { user, updateProfile, updateAuthAccount } = useContext(AuthContext)
  const { addNotification } = useContext(NotificationContext)
  const [nombre, setNombre] = React.useState(user?.displayName || '')
  const [email, setEmail] = React.useState(user?.email || '')
  const [nombres, setNombres] = React.useState('')
  const [apellidos, setApellidos] = React.useState('')
  const [telefono, setTelefono] = React.useState('')
  const [dni, setDni] = React.useState('')
  const [direccion, setDireccion] = React.useState('')
  const [ciudad, setCiudad] = React.useState('')
  const [departamento, setDepartamento] = React.useState('')
  const [pais, setPais] = React.useState('')
  const [fechaNacimiento, setFechaNacimiento] = React.useState('')
  const [genero, setGenero] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const [initialNombre, setInitialNombre] = React.useState(nombre)
  const [initialEmail, setInitialEmail] = React.useState(email)
  const [initialInfo, setInitialInfo] = React.useState({ nombres: '', apellidos: '', telefono: '', dni: '', direccion: '', ciudad: '', departamento: '', pais: '', fechaNacimiento: '', genero: '' })
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').toLowerCase())
  const nombreError = !nombre ? 'Requerido' : (nombre.trim().length < 3 ? 'Mínimo 3 caracteres' : '')
  const emailError = !email ? 'Requerido' : (!isEmail(email) ? 'Correo inválido' : '')
  const dniError = dni && !/^\d{8}$/.test(dni) ? 'DNI de 8 dígitos' : ''
  const telefonoError = telefono && !/^\d{9,}$/.test(telefono) ? 'Teléfono mínimo 9 dígitos' : ''
  const credsChanged = nombre !== initialNombre || email !== initialEmail
  const infoChanged = (
    nombres !== initialInfo.nombres || apellidos !== initialInfo.apellidos || telefono !== initialInfo.telefono || dni !== initialInfo.dni || direccion !== initialInfo.direccion || ciudad !== initialInfo.ciudad || departamento !== initialInfo.departamento || pais !== initialInfo.pais || fechaNacimiento !== initialInfo.fechaNacimiento || genero !== initialInfo.genero
  )
  const onSaveCredenciales = async () => {
    setSaving(true)
    const res = await updateAuthAccount({ nombre, email })
    if (res?.success) addNotification('Perfil actualizado', 'success')
    else addNotification(res?.error || 'Error al actualizar perfil', 'error')
    setSaving(false)
  }

  const onSaveInfo = async () => {
    setSaving(true)
    const payload = { nombres, apellidos, telefono, dni, direccion, ciudad, departamento, pais, fechaNacimiento: fechaNacimiento || null, genero, email }
    const r = await import('../../api/users.js')
    const res = await r.updatePerfil(payload)
    if (res?.ok) addNotification('Información personal actualizada', 'success')
    else addNotification(res?.data?.mensaje || res?.data?.error || 'Error al actualizar información personal', 'error')
    setSaving(false)
  }

  useEffect(() => {
    const load = async () => {
      const r = await getPerfil()
      if (r.ok && r.data) {
        const nombres = (r.data.nombres || '').toString()
        const apellidos = (r.data.apellidos || '').toString()
        const full = [nombres, apellidos].filter(Boolean).join(' ').trim()
        setNombre(full || user?.displayName || '')
        setEmail(r.data.email || user?.email || '')
        setInitialNombre(full || user?.displayName || '')
        setInitialEmail(r.data.email || user?.email || '')
        setNombres(r.data.nombres || '')
        setApellidos(r.data.apellidos || '')
        setTelefono(r.data.telefono || '')
        setDni(r.data.dni || '')
        setDireccion(r.data.direccion || '')
        setCiudad(r.data.ciudad || '')
        setDepartamento(r.data.departamento || '')
        setPais(r.data.pais || '')
        setFechaNacimiento(r.data.fechaNacimiento ? String(r.data.fechaNacimiento).substring(0,10) : '')
        setGenero(r.data.genero || '')
        setInitialInfo({ nombres: r.data.nombres || '', apellidos: r.data.apellidos || '', telefono: r.data.telefono || '', dni: r.data.dni || '', direccion: r.data.direccion || '', ciudad: r.data.ciudad || '', departamento: r.data.departamento || '', pais: r.data.pais || '', fechaNacimiento: r.data.fechaNacimiento ? String(r.data.fechaNacimiento).substring(0,10) : '', genero: r.data.genero || '' })
      }
    }
    load()
  }, [])

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>
      <Card title="Credenciales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <Input label="Nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} error={nombreError} />
          <Input label="Correo" name="correo" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
        </div>
        <div className="mt-4">
          <Button onClick={onSaveCredenciales} loading={saving} disabled={!credsChanged || !!nombreError || !!emailError}>Guardar credenciales</Button>
        </div>
      </Card>
      <Card title="Información personal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <Input label="Nombres" name="nombres" value={nombres} onChange={(e)=> setNombres(e.target.value)} />
          <Input label="Apellidos" name="apellidos" value={apellidos} onChange={(e)=> setApellidos(e.target.value)} />
          <Input label="DNI" name="dni" value={dni} onChange={(e)=> setDni(e.target.value)} error={dniError} />
          <Input label="Teléfono" name="telefono" value={telefono} onChange={(e)=> setTelefono(e.target.value)} error={telefonoError} />
          <Input label="Dirección" name="direccion" value={direccion} onChange={(e)=> setDireccion(e.target.value)} />
          <Input label="Ciudad" name="ciudad" value={ciudad} onChange={(e)=> setCiudad(e.target.value)} />
          <Input label="Departamento" name="departamento" value={departamento} onChange={(e)=> setDepartamento(e.target.value)} />
          <Input label="País" name="pais" value={pais} onChange={(e)=> setPais(e.target.value)} />
          <Input label="Fecha nacimiento" name="fechaNacimiento" type="date" value={fechaNacimiento} onChange={(e)=> setFechaNacimiento(e.target.value)} />
          <Input label="Género" name="genero" value={genero} onChange={(e)=> setGenero(e.target.value)} />
        </div>
        <div className="mt-4">
          <Button onClick={onSaveInfo} loading={saving} disabled={!infoChanged || !!dniError || !!telefonoError}>Guardar información</Button>
        </div>
      </Card>
      <Card title="Resumen">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded bg-gray-50">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Pedidos</div>
          </div>
          <div className="text-center p-3 rounded bg-gray-50">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Favoritos</div>
          </div>
          <div className="text-center p-3 rounded bg-gray-50">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Carrito</div>
          </div>
        </div>
      </Card>
    </>
  )
}

export default PerfilComprador
