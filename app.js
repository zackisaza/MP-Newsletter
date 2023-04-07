const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {

    const name = req.body.fName;
    const lasName = req.body.fLastName;
    const email = req.body.fEmail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name,
                    LNAME: lasName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = 'https://us21.api.mailchimp.com/3.0/lists/815fdde363'
    const options = {
        method: 'POST',
        auth: 'zett:7ce81d8393c0ea58b7f53f30c5731164-us21'
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        });
    })

    request.write(jsonData);
    request.end();

});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.post('/success', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT, () => {
    console.log('Example app listening on port 3000!');
});

// 7ce81d8393c0ea58b7f53f30c5731164 - us21 API KEY
// 815fdde363 LIST ID