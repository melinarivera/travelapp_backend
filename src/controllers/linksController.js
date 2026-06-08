import { supabaseAdmin } from '../supabaseClient.js'
 
export const obtenerLinks = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('viaje_id', viajeId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  // Busca os nomes dos criadores
  const ids = [...new Set(data.map(l => l.creador_id).filter(Boolean))]
  const { data: perfis } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre')
    .in('id', ids)

  const linksComNome = data.map(link => ({
    ...link,
    criador_nombre: perfis?.find(p => p.id === link.creador_id)?.nombre || 'Alguien'
  }))

  res.status(200).json({ links: linksComNome })
}

export const crearLink = async (req, res) => {
  const { viajeId } = req.params
  const { url, descripcion } = req.body
  const creador_id = req.user.id
 
  if (!url?.trim()) return res.status(400).json({ error: 'La URL es obligatoria' })
 
  const { data, error } = await supabaseAdmin
    .from('links')
    .insert([{ viaje_id: viajeId, creador_id, url, descripcion: descripcion || null }])
    .select()
 
  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ link: data[0] })
}
 
export const eliminarLink = async (req, res) => {
  const { id } = req.params
 
  const { error } = await supabaseAdmin
    .from('links')
    .delete()
    .eq('id', id)
 
  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Link eliminado' })
}
 