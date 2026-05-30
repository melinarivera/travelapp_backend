import { supabaseAdmin } from '../supabaseClient.js'

export const obtenerNotas = async (req, res) => {
  const { viajeId } = req.params
  const user_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('notas')
    .select('*')
    .eq('viaje_id', viajeId)
    .eq('usuario_id', user_id)
    .order('prioridad', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ notas: data })
}

export const crearNota = async (req, res) => {
  const { viajeId } = req.params
  const { titulo, contenido, prioridad } = req.body
  const usuario_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('notas')
    .insert([{ viaje_id: viajeId, usuario_id, titulo, contenido, prioridad: prioridad || 'media' }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ nota: data[0] })
}

export const actualizarNota = async (req, res) => {
  const { id } = req.params
  const { titulo, contenido, prioridad } = req.body
  const user_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('notas')
    .update({ titulo, contenido, prioridad })
    .eq('id', id)
    .eq('usuario_id', user_id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  if (!data.length) return res.status(404).json({ error: 'Nota no encontrada' })
  res.status(200).json({ nota: data[0] })
}

export const eliminarNota = async (req, res) => {
  const { id } = req.params
  const user_id = req.user.id

  const { error } = await supabaseAdmin
    .from('notas')
    .delete()
    .eq('id', id)
    .eq('usuario_id', user_id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Nota eliminada' })
}