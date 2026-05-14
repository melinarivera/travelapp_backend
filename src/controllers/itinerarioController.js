import { supabaseAdmin as supabase } from '../supabaseClient.js'

export const obtenerItinerario = async (req, res) => {
  const { id } = req.params

  try {
    const { data, error } = await supabase
      .from('itinerarios')
      .select('*')
      .eq('viaje_id', Number(id))
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })

    if (error) {
      console.log("❌ ERRO AO BUSCAR ITINERÁRIO:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ itinerario: data })
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const agregarItinerario = async (req, res) => {
  const { id } = req.params
  const { nombre_local, direccion, fecha, hora } = req.body

  try {
    const { data, error } = await supabase
      .from('itinerarios')
      .insert([{
        viaje_id: Number(id),
        nombre_local,
        direccion: direccion || null,
        fecha,
        hora
      }])
      .select()

    if (error) {
      console.log("❌ ERRO AO INSERIR:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({ message: 'Evento añadido al itinerario', item: data[0] })

  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const eliminarItinerario = async (req, res) => {
  const { itemId } = req.params

  try {
    const { error } = await supabase
      .from('itinerarios')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.log("❌ ERRO AO DELETAR ITEM:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ message: 'Evento eliminado correctamente' })
  } catch (err) {
    console.error("Erro interno ao deletar:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}