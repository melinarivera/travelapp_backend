import supabase from '../supabaseClient.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return res.status(401).json({ error: error.message })
  }

  res.status(200).json({
    message: 'Login exitoso',
    user: data.user,
    session: data.session
  })
}

export const registro = async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(201).json({
    message: 'Usuario creado correctamente',
    user: data.user
  })
}