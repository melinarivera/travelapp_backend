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