export const obtenerMensajes = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabaseAdmin
    .from('mensajes')
    .select('*, respuesta:respuesta_a(id, contenido, usuario_id)')
    .eq('viaje_id', viajeId)
    .order('created_at', { ascending: true })

  if (error) return res.status(400).json({ error: error.message })

  // Obtener perfiles de todos los usuarios únicos
  const userIds = [...new Set(data.map(m => m.usuario_id))]
  const { data: perfiles } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre')
    .in('id', userIds)

  const perfilesMap = {}
  perfiles?.forEach(p => { perfilesMap[p.id] = p.nombre })

  const mensajesConNombre = data.map(m => ({
    ...m,
    perfil: { nombre: perfilesMap[m.usuario_id] || null },
    respuesta: m.respuesta ? {
      ...m.respuesta,
      perfil: { nombre: perfilesMap[m.respuesta.usuario_id] || null }
    } : null
  }))

  res.status(200).json({ mensajes: mensajesConNombre })
}