import supabase from '../supabaseClient.js'

export const crearViaje = async (req, res) => {
  const { titulo, destino, fecha_inicio, fecha_fin, imagen_url } = req.body
  const titular_id = req.user.id

  const { data, error } = await supabase
    .from('viajes')
    .insert([{
      titulo,
      destino,
      fecha_inicio,
      fecha_fin,
      imagen_url: imagen_url || null,
      titular_id,
      estado: 'planificacion'
    }])
    .select()

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(201).json({
    message: 'Viaje creado correctamente',
    viaje: data[0]
  })
}

export const obtenerViajes = async (req, res) => {
  const titular_id = req.user.id

  const { data, error } = await supabase
    .from('viajes')
    .select('*')
    .eq('titular_id', titular_id)
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ viajes: data })
}