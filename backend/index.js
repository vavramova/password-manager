import express from 'express'
import './db.js'

//creaed the server
const app = express()
app.use(express.json())


//when visit server`s homepage, run:
app.get('/', (req, res) =>{
    // .send -> Plaintext
    res.send('Password manager API is running!')
})


// .get -> fetch data
app.get('/health', (req, res) => {
    // .json -> sends JSON Data => Frontend expects JSON
    res.json({ status: 'ok', message: 'Server is healthy'})
})


// .post -> send data
app.post('/test', (req, res) => {
    const body = req.body
    res.json({ received: body })
})

app.listen(3000, () => {
    console.log('Server started on Port 3000')
})