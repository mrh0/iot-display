const express = require('express');
const {login, create} = require('../../account/account');
const router = express.Router();

/* WIP */
router.post('/', (req, res, next)=>{
    const {username, pwd} = req.body;
    if(!username || !pwd){
        res.status(200).json({accepted:false, error:"Missing required post body fields: 'username', 'pwd'"});
        return;
    }

    login(username, pwd, (r) => {
        res.status(200).json(r);
    })
});

router.post('/create/', (req, res, next)=>{
    const {username, pwd} = req.body;
    create(username, pwd, (r) => {
        res.status(200).json(r);
    })
});

module.exports = router;