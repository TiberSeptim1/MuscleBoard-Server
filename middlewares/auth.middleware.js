import { createClient } from '@supabase/supabase-js'
import {SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL} from '../config/env.js'


const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.user = user
  next()
}

export default authorize
