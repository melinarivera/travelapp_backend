import supabase, { supabaseAdmin } from '../supabaseClient.js'

export const crearViaje = async (req, res) => {
  const { titulo, destino, fecha_inicio, fecha_fin } = req.body
  const titular_id = req.user.id
  let imagen_url = null

  try {
    if (req.file) {
      const extension = req.file.originalname.split('.').pop()
      const nombreArchivo = `${Date.now()}.${extension}`

      const { error: errorStorage } = await supabaseAdmin.storage
        .from('imagenes-viajes')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (errorStorage) throw new Error('Error al subir la imagen')

      const { data } = supabase.storage
        .from('imagenes-viajes')
        .getPublicUrl(nombreArchivo)

      imagen_url = data.publicUrl
    }

    const { data, error } = await supabase
      .from('viajes')
      .insert([{ titulo, destino, fecha_inicio, fecha_fin, imagen_url, titular_id, estado: 'planificacion' }])
      .select()

    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ message: 'Viaje creado correctamente', viaje: data[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const obtenerViajes = async (req, res) => {
  const titular_id = req.user.id

  const { data, error } = await supabase
    .from('viajes')
    .select('*')
    .eq('titular_id', titular_id)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ viajes: data })
}

export const obtenerViaje = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('viajes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ viaje: data })
}

export const actualizarViaje = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body
  const titular_id = req.user.id

  const { data, error } = await supabase
    .from('viajes')
    .update({ estado })
    .eq('id', id)
    .eq('titular_id', titular_id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  if (!data.length) return res.status(404).json({ error: 'Viaje no encontrado' })
  res.status(200).json({ message: 'Viaje actualizado', viaje: data[0] })
}