import { supabaseAdmin } from '../supabaseClient.js'

export const obtenerNotas = async (req, res) => {
  const { viajeId } = req.params
  const user_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('notas')
    .select('*')
    .eq('viaje_id', viajeId)
    .eq('usuario_id', user_id)

  if (error) return res.status(400).json({ error: error.message })

  const orden = { alta: 1, media: 2, baja: 3 }
  const ordenadas = data.sort((a, b) => {
    if (orden[a.prioridad] !== orden[b.prioridad]) {
      return orden[a.prioridad] - orden[b.prioridad]
    }
    if (a.fecha && b.fecha) return new Date(a.fecha) - new Date(b.fecha)
    if (a.fecha) return -1
    if (b.fecha) return 1
    return new Date(b.created_at) - new Date(a.created_at)
  })

  res.status(200).json({ notas: ordenadas })
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