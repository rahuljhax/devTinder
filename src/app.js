const express = require('express');
const app = express();

app.use("/test", (req, res) => {
    // res.send('Hello I am your node friend')
    const data = {
        name: 'raul jha',
        age: 33
    }
    res.send(data);
})

app.listen(3000, () => {
    console.log(`Server is running on 3000....`)
})