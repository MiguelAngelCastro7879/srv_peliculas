/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route.resource('/personas', 'PersonasController').apiOnly()

Route.resource('/usuarios', 'UsuariosController').apiOnly()
Route.resource('/categorias', 'CategoriasController').apiOnly()
Route.resource('/clasificaciones', 'ClasificacionesController').apiOnly()
Route.resource('/idiomas', 'IdiomasController').apiOnly()
Route.resource('/peliculas', 'PeliculasController').apiOnly()
Route.resource('/productoras', 'ProductorasController').apiOnly()


Route.post('/login', 'UsuariosController.login')
Route.post('/logout', 'UsuariosController.logout')
Route.post('/status', 'UsuariosController.statusCuenta')

Route.get('dashboard', async ({ auth, response }) => {
  try {
    const sesion = await auth.use('web').authenticate()
    response.status(200).send({ususario:sesion})
  } catch (E_INVALID_AUTH_SESSION) {
    response.badRequest({error: 'No se ha iniciado sesion'})
  }

// }).middleware('auth:web')
})

Route.get('inicia_sesion', async () => {
  return {hello:'conectateeee'}
})
