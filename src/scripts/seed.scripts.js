import { PASSWORD_DEFAULT } from '../config/envs.js'
import { listaUsuarios } from '../data/seed.data.js'
import { Usuario } from '../libs/db.js'
import { bcryptUtils } from '../utils/index.utils.js'

const loadData = async () => {
  try {
    console.log('--- Iniciando carga de usuarios por defecto ---')
    const claveHasheada = await bcryptUtils.hashPassword(PASSWORD_DEFAULT)

    const newUsers = listaUsuarios.map((usuario) => ({
      ...usuario,
      clave: claveHasheada,
    }))

    await Usuario.bulkCreate(newUsers, {
      ignoreDuplicates: true,
    })
    console.log(`✅ Éxito: ${newUsers.length} usuarios cargados correctamente.`)
  } catch (error) {
    console.error('❌ Error al cargar usuarios:', error.message)
    process.exit(1) // Cerramos con error si algo falla
  }
}

export { loadData }
