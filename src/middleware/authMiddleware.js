import supabase from '../supabaseClient.js'

export const verifySession = async (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ error: 'No hay token de sesión' })
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' })
  }

  req.user = data.user
  next()
}