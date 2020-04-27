const express = require('express');
const {DisplaySchema} = require('../../db/db');
const {check, addDisplay, getUserDisplays} = require('../../account/account');
const mongoose = require('mongoose');
const router = express.Router();


/* Get display info.
GET:
    display/get/<displayId>/
RES:
{
    display: {
        id: <MongoosedbID/String>,
        name: <String>,
        message: <String>,
        scheduled: <Array of Messages>,
        now: <currentTime>,
        error: <Exception>
    }
}
*/
router.get('/get/:displayId', (req, res, next)=>{
    const id = req.params.displayId;
    DisplaySchema.findById(id)
    .select('_id name message scheduled')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                display:{
                    id: doc._id,
                    name: doc.name,
                    message: doc.message,
                    scheduled: doc.scheduled,
                    now: new Date()
                }
            });
        } else{
            res.status(404).json({error:"The is no display mapped to this id."});
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    });
});

/* Create a new display.
POST:
    display/new/
BODY:
{
    name: <displayName>
}
RES:
{
    display:{
        id: <MongoosedbID/String>,
        name: <String>,
        error: <Exception>
    }
}
*/
router.post('/new', (req, res, next)=>{
    const {name, session} = req.body;
    check(session, (data) => {
        
        let id = new mongoose.Types.ObjectId();
        const n = new DisplaySchema({_id: id, name: name, message: {text: "Hello World!"}});
        n.save().then(() => {
            addDisplay(data.id, id, 
                (m) => {
                    res.status(200).json(m)
                }, (err) => {
                    res.status(500).json(err)
                })
        }).catch((err) => {
            res.status(500).json({accepted:false, error:err})
        });

    }, (err) => {
        res.status(500).json({accepted:false, error:err})
    })
    
});

/* Get the name only.
GET: 
    display/name/get/<displayId>/
RES:
{
    display:{
        id: <MongoosedbID/String>,
        name: <String>,
        error: <Exception>
    }
}
*/

router.get('/name/get/:displayId', (req, res, next)=>{
    const id = req.params.displayId;

    DisplaySchema.findById(id)
    .select('name')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                display:{
                    id: id,
                    name: doc.name
                }
            });
        } else{
            res.status(404).json({error:"The is no display mapped to this id."});
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    });
});

/* Get the name of several displays.
POST: 
    display/name/get/multiple/
RES:
...
*/

router.post('/name/get/multiple/', (req, res, next)=>{
    const ids = req.body.ids;
    let pa = [];
    for(let id in ids)
        pa.push(DisplaySchema.findById(id).select('name').exec());
        
    Promise.all(pa).then(doc => {
        if(doc){
            res.status(200).json({
                display:{
                    id: id,
                    name: doc.name
                }
            });
        } else{
            res.status(404).json({error:"The is no display mapped to this id."});
        }
    })
    .catch(err => {
        res.status(500).json({error:err});
    });
});

/* Set the name of display.
POST:
    display/name/set/
BODY: 
{
    id: <ID>,
    sessionid: <SessionID>, -WIP
    name: <String>
}
RES:
{ 
    accepted: <Boolean>,
    error: <Exception>,
    echo: { 
        id:<ID>, 
        name:<String>
    }
}
*/

router.post('/name/set', (req, res) => {
    const { id, name } = req.body;
      
      DisplaySchema.findByIdAndUpdate(id, {name: name}, (err, doc) => {
        if (err) 
          return res.status(400).json({accepted:false, error:err, echo:{ id:id, name:name }});
        return res.status(200).json({accepted:true, echo:{ id:id, name:name }});
      })
  });

module.exports = router;