import { supabaseAdmin } from '../supabaseClient.js'

export const obtenerMensajes = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabaseAdmin
    .from('mensajes')
    .select('*, perfil:usuario_id(nombre), respuesta:respuesta_a(id, contenido, perfil:usuario_id(nombre))')
    .eq('viaje_id', viajeId)
    .order('created_at', { ascending: true })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensajes: data })
}

export const enviarMensaje = async (req, res) => {
  const { viajeId } = req.params
  const { contenido, respuesta_a } = req.body
  const usuario_id = req.user.id

  if (!contenido?.trim()) return res.status(400).json({ error: 'El mensaje no puede estar vacío' })

  const { data, error } = await supabaseAdmin
    .from('mensajes')
    .insert([{
      viaje_id: viajeId,
      usuario_id,
      contenido,
      respuesta_a: respuesta_a || null
    }])
    .select('*, perfil:usuario_id(nombre)')

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ mensaje: data[0] })
}

export const eliminarMensaje = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.user.id

  const { error } = await supabaseAdmin
    .from('mensajes')
    .delete()
    .eq('id', id)
    .eq('usuario_id', usuario_id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Mensaje eliminado' })
}