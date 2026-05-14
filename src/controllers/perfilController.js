import { supabaseAdmin } from '../supabaseClient.js'

export const obtenerPerfil = async (req, res) => {
  const usuario_id = req.user.id

  const { data, error } = await supabaseAdmin
    .from('perfiles')
    .select('*')
    .eq('id', usuario_id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ perfil: data || null })
}

export const guardarPerfil = async (req, res) => {
  const usuario_id = req.user.id
  const { nombre, telefono } = req.body
  let foto_url = null

  try {
    if (req.file) {
      const extension = req.file.originalname.split('.').pop()
      const nombreArchivo = `${usuario_id}.${extension}`

      const { error: errorStorage } = await supabaseAdmin.storage
        .from('avatares')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        })

      if (errorStorage) throw new Error('Error al subir la foto')

      const { data } = supabaseAdmin.storage
        .from('avatares')
        .getPublicUrl(nombreArchivo)

      foto_url = data.publicUrl
    }

    const { data: perfilExistente } = await supabaseAdmin
      .from('perfiles')
      .select('id')
      .eq('id', usuario_id)
      .single()

    let data, error

    if (perfilExistente) {
      const updates = { nombre, telefono }
      if (foto_url) updates.foto_url = foto_url

      const result = await supabaseAdmin
        .from('perfiles')
        .update(updates)
        .eq('id', usuario_id)
        .select()

      data = result.data
      error = result.error
    } else {
      const insert = { id: usuario_id, nombre, telefono }
      if (foto_url) insert.foto_url = foto_url

      const result = await supabaseAdmin
        .from('perfiles')
        .insert([insert])
        .select()

      data = result.data
      error = result.error
    }

    if (error) return res.status(400).json({ error: error.message })

    res.status(200).json({ mensaje: 'Perfil guardado', perfil: data[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}