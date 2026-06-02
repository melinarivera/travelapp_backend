import { supabaseAdmin } from '../supabaseClient.js'

// Busca integrantes da viagem com nome do perfil
export const obtenerIntegrantes = async (req, res) => {
  const { viajeId } = req.params

  const { data: ints, error } = await supabaseAdmin
    .from('integrantes')
    .select('usuario_id, rol')
    .eq('viaje_id', viajeId)

  if (error) return res.status(400).json({ error: error.message })

  // Busca os perfis de cada integrante
  const ids = ints.map(i => i.usuario_id)
  const { data: perfis } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre, foto_url')
    .in('id', ids)

  // Junta os dados
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

// Cria um novo gasto
export const crearGasto = async (req, res) => {
  const { viajeId } = req.params
  const { descripcion, valor, pagador_id, dividido_entre } = req.body

  if (!descripcion?.trim()) return res.status(400).json({ error: 'La descripción es obligatoria' })
  if (!valor || isNaN(valor) || Number(valor) <= 0) return res.status(400).json({ error: 'El valor debe ser mayor que 0' })
  if (!pagador_id) return res.status(400).json({ error: 'El pagador es obligatorio' })
  if (!dividido_entre?.length) return res.status(400).json({ error: 'Selecciona al menos una persona' })

  const { data, error } = await supabaseAdmin
    .from('gastos')
    .insert([{
      viaje_id: Number(viajeId),
      pagador_id,
      descripcion,
      valor: Number(valor),
      dividido_entre
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