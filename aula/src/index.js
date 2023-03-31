const express = require('express');
const {Pool} = require('pg')
require('dotenv').config()
const port = 3000;

const pool = new Pool({
    connectionString:process.env.POSTGRES_URL
})

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    console.log('Hi, everyone')
})

app.get('/users-list', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    } catch(err) {
        return res.status(400).send(err)
    }
})

app.post('/users-create', async (req,res) => {
    const {username} = req.body
    try{
        const newSession = await pool.query(`INSERT INTO users(username) values ('${username}')`)
        return res.status(200).send('Usuário adicionado com sucesso!')
    }
    catch(err){
        return res.status(400).send(err)
    }
})

app.delete('/users-delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await pool.query(`DELETE FROM users WHERE user_id = '${userId}'`);
      return res.status(200).send(`Usuário com ID ${userId} foi excluído com sucesso!`);
    } catch (err) {
      return res.status(400).send(err);
    }
  });

  app.put('/users-update/:id', async (req, res) => {
    const userId = req.params.id;
    const { newUsername } = req.body;
    try {
      const updatedUser = await pool.query(`UPDATE users SET username = '${newUsername}' WHERE user_id = '${userId}'`);
      return res.status(200).send(`O nome do usuário com ID ${userId} foi atualizado para ${newUsername} com sucesso!`);
    } catch (err) {
      return res.status(400).send(err);
    }
  });

app.listen(port, () => console.log(`🚀 Botando pra fuder na porta ${port} 🚀`)); 