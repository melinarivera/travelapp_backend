import { supabaseAdmin } from '../supabaseClient.js'

export const obtenerDependientes = async (req, res) => {
  const usuario_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('perfiles_dependientes')
    .select('*')
    .eq('usuario_id', usuario_id)
    .order('created_at', { ascending: true })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ dependientes: data })
}

export const crearDependiente = async (req, res) => {
  const usuario_id = req.user.id
  const { nombre, tipo, fecha_nacimiento } = req.body

  if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es obligatorio' })
  if (!tipo) return res.status(400).json({ error: 'El tipo es obligatorio' })

  const { data, error } = await supabaseAdmin
    .from('perfiles_dependientes')
    .insert([{ usuario_id, nombre, tipo, fecha_nacimiento: fecha_nacimiento || null }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ dependiente: data[0] })
}

export const eliminarDependiente = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.user.id

  const { error } = await supabaseAdmin
    .from('perfiles_dependientes')
    .delete()
    .eq('id', id)
    .eq('usuario_id', usuario_id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Perfil eliminado' })
}