import supabase, { supabaseAdmin } from '../supabaseClient.js'

export const subirDocumento = async (req, res) => {
  const { viajeId } = req.params
  const { titulo, lugar, fecha } = req.body
  const usuario_id = req.user.id

  try {
    const extension = req.file.originalname.split('.').pop()
    const nombreArchivo = `${Date.now()}.${extension}`

    const { error: errorStorage } = await supabaseAdmin.storage
      .from('documentos')
      .upload(nombreArchivo, req.file.buffer, {
        contentType: req.file.mimetype
      })

    if (errorStorage) throw new Error('Error al subir el archivo')

    const { data: urlData } = supabaseAdmin.storage
      .from('documentos')
      .getPublicUrl(nombreArchivo)

    const { data, error } = await supabaseAdmin
      .from('documentos')
      .insert([{
        viaje_id: viajeId,
        usuario_id,
        titulo,
        lugar,
        fecha,
        archivo_url: urlData.publicUrl,
        tipo: req.file.mimetype
      }])
      .select()

    if (error) return res.status(400).json({ error: error.message })

    res.status(201).json({ message: 'Documento subido correctamente', documento: data[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const obtenerDocumentos = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabaseAdmin
    .from('documentos')
    .select('*')
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ documentos: data })
}

export const eliminarDocumento = async (req, res) => {
  const { id } = req.params

  const { error } = await supabaseAdmin
    .from('documentos')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ message: 'Documento eliminado' })
}
