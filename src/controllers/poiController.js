import supabase from '../supabaseClient.js';  

export const crearLugarPOI = async (req, res) => {
  const { nombre, viaje_id } = req.body;
  // Pegamos o ID do usuário que o seu middleware 'verifySession' já validou
  const creador_id = req.user.id; 

  if (!nombre || !viaje_id) {
    return res.status(400).json({ error: 'Nombre e viaje_id são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('lugares_poi')
      .insert([{ 
        nombre, 
        viaje_id: Number(viaje_id), 
        creador_id // Incluindo o campo obrigatório que vimos na image_467ca0.png
      }])
      .select();

    if (error) {
      console.error("ERRO DETALHADO DO SUPABASE:", error);
      return res.status(400).json(error);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("ERRO NO CATCH:", error);
    res.status(500).json({ error: 'Erro interno' });
  }
};

export const votarPOI = async (req, res) => {
  // Ajustando para receber 'poiId' e 'tipo' que o seu MapaPOI.jsx envia
  const { poiId, tipo } = req.body; 
  const user_id = req.user.id;

  // Transformando 'up' em 1 e 'down' em -1 para o cálculo matemático
  const valorVoto = tipo === 'up' ? 1 : -1;

  try {
    const { data, error } = await supabase
      .from('votos_poi')
      .upsert(
        { poi_id: poiId, user_id, tipo_voto: valorVoto }, 
        { onConflict: 'poi_id, user_id' }
      )
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Voto registrado com sucesso', data });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar voto' });
  }
};

export const listarPOIsPorViaje = async (req, res) => {
  const { viajeId } = req.params;

  try {
    const { data, error } = await supabase
      .from('lugares_poi')
      .select(`
        *,
        votos_poi (
          tipo_voto
        )
      `)
      .eq('viaje_id', viajeId);

    if (error) return res.status(400).json({ error: error.message });

    // Calculando a pontuação e separando positivos/negativos para o seu front
    const poisComPontuacao = data.map(poi => {
      const votosPositivos = poi.votos_poi.filter(v => v.tipo_voto === 1).length;
      const votosNegativos = poi.votos_poi.filter(v => v.tipo_voto === -1).length;
      const total = poi.votos_poi.reduce((acc, voto) => acc + voto.tipo_voto, 0);
      
      return {
        ...poi,
        votos_positivos: votosPositivos,
        votos_negativos: votosNegativos,
        puntuacion_total: total
      };
    });

    // Ordenação: Os mais votados primeiro
    poisComPontuacao.sort((a, b) => b.puntuacion_total - a.puntuacion_total);

    res.status(200).json(poisComPontuacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar POIs' });
  }
};