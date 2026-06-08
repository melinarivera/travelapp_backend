import { supabaseAdmin } from '../supabaseClient.js'

// Busca integrantes da viagem com nome do perfil
export const obtenerIntegrantes = async (req, res) => {
  const { viajeId } = req.params

  const { data: ints, error } = await supabaseAdmin
    .from('integrantes')
    .select('usuario_id, rol')
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  const ids = ints.map(i => i.usuario_id)
  const { data: perfis } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre, foto_url')
    .in('id', ids)

  const integrantes = ints.map(i => ({
    ...i,
    perfiles: perfis?.find(p => p.id === i.usuario_id) || null
  }))

  res.status(200).json({ integrantes })
}

// Busca todos os gastos da viagem
export const obtenerGastos = async (req, res) => {
  const { viajeId } = req.params

  const { data, error } = await supabaseAdmin
    .from('gastos')
    .select('*')
    .eq('viaje_id', viajeId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ gastos: data })
}

// Cria um novo gasto com comprovante opcional
export const crearGasto = async (req, res) => {
  const { viajeId } = req.params
  const { descripcion, valor, pagador_id, dividido_entre } = req.body

  if (!descripcion?.trim()) return res.status(400).json({ error: 'La descripción es obligatoria' })
  if (!valor || isNaN(valor) || Number(valor) <= 0) return res.status(400).json({ error: 'El valor debe ser mayor que 0' })
  if (!pagador_id) return res.status(400).json({ error: 'El pagador es obligatorio' })

  // dividido_entre viene como string JSON desde FormData
  let divididoArray = []
   try {
    divididoArray = typeof dividido_entre === 'string' ? JSON.parse(dividido_entre) : dividido_entre
  } catch (e) {
    return res.status(400).json({ error: 'Error en dividido_entre' })
  }

  if (!divididoArray?.length) return res.status(400).json({ error: 'Selecciona al menos una persona' })

  // Upload do comprovante se existir
  let comprobante_url = null
  if (req.file) {
    try {
      const extension = req.file.originalname.split('.').pop()
      const nombreArchivo = `comprobantes/${Date.now()}.${extension}`

      const { error: errorStorage } = await supabaseAdmin.storage
        .from('documentos')
        .upload(nombreArchivo, req.file.buffer, {
          contentType: req.file.mimetype
        })

      if (!errorStorage) {
        const { data: urlData } = supabaseAdmin.storage
          .from('documentos')
          .getPublicUrl(nombreArchivo)
        comprobante_url = urlData.publicUrl
      }
    } catch (err) {
      console.error('Error al subir comprobante:', err)
    }
  }

  const { data, error } = await supabaseAdmin
    .from('gastos')
    .insert([{
      viaje_id: Number(viajeId),
      pagador_id,
      descripcion,
      valor: Number(valor),
      dividido_entre: divididoArray,
      comprobante_url
    }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ gasto: data[0] })
}

// Elimina um gasto
export const eliminarGasto = async (req, res) => {
  const { id } = req.params

  const { error } = await supabaseAdmin
    .from('gastos')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ mensaje: 'Gasto eliminado' })
}
