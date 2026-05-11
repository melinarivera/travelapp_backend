import supabase, { supabaseAdmin } from '../supabaseClient.js'

export const obtenerIntegrantes = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabase
    .from('integrantes')
    .select('*')
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  const integrantesConEmail = await Promise.all(
    data.map(async (integrante) => {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(integrante.usuario_id)
      return { ...integrante, email: user?.email }
    })
  )

  res.status(200).json({ integrantes: integrantesConEmail })
}

export const agregarIntegrante = async (req, res) => {
  const { viajeId } = req.params
  const { email } = req.body
  const titular_id = req.user.id

  // verificar que quien pide es el titular
  const { data: viaje, error: errorViaje } = await supabase
    .from('viajes')
    .select('titular_id')
    .eq('id', viajeId)
    .single()

  if (errorViaje || viaje.titular_id !== titular_id) {
    return res.status(403).json({ error: 'Solo el titular puede añadir integrantes' })
  }

  // buscar usuario por email
  const { data: { users }, error: errorUsuario } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000
  })

  const usuario = users.find(u => u.email === email)

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  // añadir integrante
  const { data, error } = await supabase
    .from('integrantes')
    .insert([{
      viaje_id: viajeId,
      usuario_id: usuario.id,
      rol: 'integrante'
    }])
    .select()

  if (error) return res.status(400).json({ error: error.message })

  res.status(201).json({ message: 'Integrante añadido', integrante: data[0] })
}

export const eliminarIntegrante = async (req, res) => {
  const { viajeId, integranteId } = req.params
  const titular_id = req.user.id

  // verificar que quien pide es el titular
  const { data: viaje, error: errorViaje } = await supabase
    .from('viajes')
    .select('titular_id')
    .eq('id', viajeId)
    .single()

  if (errorViaje || viaje.titular_id !== titular_id) {
    return res.status(403).json({ error: 'Solo el titular puede eliminar integrantes' })
  }

  const { error } = await supabase
    .from('integrantes')
    .delete()
    .eq('id', integranteId)
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ message: 'Integrante eliminado' })
}
