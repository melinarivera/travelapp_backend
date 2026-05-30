import { supabaseAdmin } from '../supabaseClient.js'

export const obtenerChecklists = async (req, res) => {
  const { viajeId } = req.params
  const user_id = req.user.id

  // Checklists propios
  const { data: propios, error: e1 } = await supabaseAdmin
    .from('checklists')
    .select('*, checklist_items(*)')
    .eq('viaje_id', viajeId)
    .eq('creador_id', user_id)

  if (e1) return res.status(400).json({ error: e1.message })

  // Checklists del grupo compartidos con todos
  const { data: grupales, error: e2 } = await supabaseAdmin
    .from('checklists')
    .select('*, checklist_items(*)')
    .eq('viaje_id', viajeId)
    .eq('visibilidad', 'grupo')
    .neq('creador_id', user_id)

  if (e2) return res.status(400).json({ error: e2.message })

  // Checklists compartidos específicamente con este usuario
  const { data: compartidos, error: e3 } = await supabaseAdmin
    .from('checklist_compartidos')
    .select('checklist_id')
    .eq('usuario_id', user_id)

  if (e3) return res.status(400).json({ error: e3.message })

  let checklistsCompartidos = []
  if (compartidos.length > 0) {
    const ids = compartidos.map(c => c.checklist_id)
    const { data, error: e4 } = await supabaseAdmin
      .from('checklists')
      .select('*, checklist_items(*)')
      .in('id', ids)
      .eq('viaje_id', viajeId)

    if (e4) return res.status(400).json({ error: e4.message })
    checklistsCompartidos = data
  }

  const todos = [...propios, ...grupales, ...checklistsCompartidos]
  const unicos = todos.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i)

  res.status(200).json({ checklists: unicos })
}

export const crearChecklist = async (req, res) => {
  const { viajeId } = req.params
  const { titulo, visibilidad, usuarios_compartidos } = req.body
  const creador_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('checklists')
    .insert([{ viaje_id: viajeId, creador_id, titulo, visibilidad: visibilidad || 'personal' }])
    .select()

  if (error) return res.status(400).json({ error: error.message })

  // Si visibilidad es 'seleccionados', insertar en checklist_compartidos
  if (visibilidad === 'seleccionados' && usuarios_compartidos?.length > 0) {
    const compartidos = usuarios_compartidos.map(uid => ({
      checklist_id: data[0].id,
      usuario_id: uid
    }))
    await supabaseAdmin.from('checklist_compartidos').insert(compartidos)
  }

  res.status(201).json({ checklist: data[0] })
}

export const eliminarChecklist = async (req, res) => {
  const { id } = req.params
  const user_id = req.user.id

  const { error } = await supabaseAdmin
    .from('checklists')
    .delete()
    .eq('id', id)
    .eq('creador_id', user_id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Checklist eliminado' })
}

export const agregarItem = async (req, res) => {
  const { checklistId } = req.params
  const { texto } = req.body

  const { data, error } = await supabaseAdmin
    .from('checklist_items')
    .insert([{ checklist_id: checklistId, texto }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ item: data[0] })
}

export const toggleItem = async (req, res) => {
  const { itemId } = req.params
  const { completado } = req.body

  const { data, error } = await supabaseAdmin
    .from('checklist_items')
    .update({ completado })
    .eq('id', itemId)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ item: data[0] })
}

export const eliminarItem = async (req, res) => {
  const { itemId } = req.params

  const { error } = await supabaseAdmin
    .from('checklist_items')
    .delete()
    .eq('id', itemId)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Item eliminado' })
}