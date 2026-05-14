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
  const user_id = req.user.id

  const { data: viajesComoTitular, error: error1 } = await supabase
    .from('viajes')
    .select('*')
    .eq('titular_id', user_id)

  if (error1) return res.status(400).json({ error: error1.message })

  const { data: integrantes, error: error2 } = await supabaseAdmin
    .from('integrantes')
    .select('viaje_id')
    .eq('usuario_id', user_id)

  if (error2) return res.status(400).json({ error: error2.message })

  let viajesComoIntegrante = []

  if (integrantes.length > 0) {
    const ids = integrantes.map(i => i.viaje_id)
    const { data, error: error3 } = await supabaseAdmin
      .from('viajes')
      .select('*')
      .in('id', ids)

    if (error3) return res.status(400).json({ error: error3.message })
    viajesComoIntegrante = data
  }

  const todos = [...viajesComoTitular, ...viajesComoIntegrante]
  const unicos = todos.filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i)
  const ordenados = unicos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  res.status(200).json({ viajes: ordenados })
}

export const obtenerViaje = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabaseAdmin
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

