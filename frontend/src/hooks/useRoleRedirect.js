import { useNavigate } from 'react-router-dom'

const useRoleRedirect = () => {
  const navigate = useNavigate()
  const redirect = (role) => {
    const r = (role || '').toUpperCase()
    if (r === 'AGRICULTOR') navigate('/agricultor/dashboard')
    else if (r === 'ADMIN') navigate('/admin/dashboard')
    else navigate('/')
  }
  return { redirect }
}

export default useRoleRedirect
