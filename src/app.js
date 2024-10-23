const express = require('express');
const app = express();


// Creating the User GET, POST, DELETE Methods

// GET
app.get('/user', (req, res) => {
    res.send({
        name: 'Rahul Jha',
        age: 33
    })
})

//POST
app.post('/user', (req, res) => {
    res.send('User Data Successfully Saved to the database')
})

//DELETE
app.delete('/user', (req, res) => {
    res.send('User Deleted Successfully')
})

//PATCH
app.patch('/user', (req, res) => {
    res.send('User data updated successfully..')
})

app.listen(3000, () => {
    console.log('Server is running on PORT 3000...')
})

