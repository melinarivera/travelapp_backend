import supabase, { supabaseAdmin } from '../supabaseClient.js'

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

export const recuperarPassword = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email obligatorio' })

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`
  })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ message: 'Email enviado' })
}