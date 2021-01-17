const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', async (req, res) => { 
    res.render('layouts/login');
});

router.get('/verify', async (req, res) => {
    res.render('layouts/verify');
});

router.get('/success', async (req, res) => {
    res.render('layouts/success');
}); 


router.post('/signin', async (req, res) => {
    let api_send_sms = 'https://open-auth-engine.herokuapp.com/api/send_sms'
    return new Promise((resolve, reject) => {
        let reqBody = {
            // "auth_token": req.body.token,
            "auth_token": process.env.TOKEN,
            "user_number": req.body.number
        }; 
        // console.log(api_send_sms);
        // console.log(reqBody);
        try{
            request.post({ 
                    uri: api_send_sms,
                    json: true,
                    body: reqBody
                },
                (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    if(body=="SMS SENT"){
                        // console.log("IF SENT");
                        res.redirect('/verify');
                    }else{
                        res.redirect('/');
                    }
                }else{
                    res.redirect('/');
                }
            })
        }
        catch(e){ 
            res.redirect('/');
            reject('Error while POST token and number')
        }
    })
});

router.post('/verify', async (req, res) => {
    let api_send_sms = 'https://open-auth-engine.herokuapp.com/api/verify_sms'
    return new Promise((resolve, reject) => {
        let reqBody = {
            "auth_token": process.env.TOKEN,
            "user_number": req.body.number,
            "user_verification_code": req.body.verify_code
        };
        try{
            request.post({ 
                    uri: api_send_sms,
                    json: true,
                    body: reqBody
                },
                (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    // console.log(body);
                    // console.log(error);
                    if(body=="VERIFIED SUCCESSFULLY"){
                        // console.log("VERIFIED SUCCESSFULLY");
                        res.redirect('/success');
                    }else if(body=="WRONG CODE"){
                        // console.log("WRONG CODE");
                        res.redirect('/verify');
                    }else if(body=="UNAUTHORIZED"){
                        // console.log("UNAUTHORIZED");
                        res.redirect('/');
                    }else{
                        res.redirect('/');
                    }
                }else{
                    res.redirect('/');
                    // res.render('layouts/newView', "Błedne dane");
                }
            })
        }
        catch(e){
            res.redirect('/');
            reject('Error while POST token and number')
        }
    })
});

module.exports = router;