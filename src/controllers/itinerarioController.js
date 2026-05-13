import supabase from '../supabaseClient.js'

export const obtenerItinerario = async (req, res) => {
  const { id } = req.params // ID da viagem

  try {
    const { data, error } = await supabase
      .from('itinerarios')
      .select('*')
      .eq('viaje_id', Number(id)) // Garante que busca pelo número correto
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
  const { id } = req.params // ID da viagem vem como string da URL
  const { nombre_local, direccion, fecha, hora } = req.body
  const user_id = req.user.id

  try {
    // 1. Verificar se a viagem existe e se o usuário é o dono (titular)
    const { data: viaje, error: errorViaje } = await supabase
      .from('viajes')
      .select('titular_id')
      .eq('id', Number(id)) // Converte para número para bater com int8
      .single()

    if (errorViaje || !viaje) {
      console.log("❌ VIAGEM NÃO ENCONTRADA:", errorViaje);
      return res.status(404).json({ error: 'Viaje no encontrado' })
    }

    if (viaje.titular_id !== user_id) {
      return res.status(403).json({ error: 'No tienes permiso. Solo el administrador puede editar el itinerario.' })
    }

    // 2. Inserir no banco com o viaje_id convertido para número
    const { data, error } = await supabase
      .from('itinerarios')
      .insert([
        { 
          viaje_id: Number(id), // CONVERSÃO CRUCIAL AQUI
          nombre_local, 
          direccion: direccion || null, // Garante que não envie string vazia se não quiser
          fecha, 
          hora 
        }
      ])
      .select()

    if (error) {
      console.log("❌ ERRO DETALHADO DO SUPABASE AO INSERIR:", error);
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({ 
      message: 'Evento añadido al itinerario', 
      item: data[0] 
    })

  } catch (err) {
    console.error("Erro interno no servidor:", err);
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const eliminarItinerario = async (req, res) => {
  const { itemId } = req.params // UUID do item do itinerário
  
  try {
    // Nota: Como itemId é UUID no banco, não precisa de Number()
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