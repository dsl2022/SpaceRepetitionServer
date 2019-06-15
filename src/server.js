require('dotenv').config()

cors = require('cors')
const knex = require('knex')
const app = require('./app')
const { PORT, DB_URL,CLIENT_ORIGIN } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})
app.use(cors({origin:CLIENT_ORIGIN}))

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
