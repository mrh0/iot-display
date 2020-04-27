const express = require('express');
const router = express.Router();
const {DisplaySchema} = require('../../db/db');
const mongoose = require('mongoose');


/* Set the current message
POST:
  message/set/
BODY:
{
  id: <ID>,
  sessionid: <SessionID>, -WIP
  message: <String>,
  overrides: <Time/Date>
}
RES:
{
  accepted: <Boolean>,
  error: <Exception>, 
  echo:{ 
    id: <ID>, 
    message: <String> 
  }
}
*/
router.post('/set', (req, res) => {
  const { id, message } = req.body;
    
    DisplaySchema.findByIdAndUpdate(id, {message: {text: message}}, (err, doc) => {
      if (err) 
        return res.status(400).json({accepted:false, error:err, echo:{ id:id, message:message }});
      return res.status(200).json({accepted:true, error:"", echo:{ id:id, message:message }});
    })
});


/* Schedule a message.
POST: 
  message/schedule/ [WIP]
BODY:
{ 
  id: <ID>,
  sessionid: <SessionID>, -WIP
  message: <String>,
  time: <Time/Date>
}
RES:
{
  accepted: <Boolean>,
  error: <Exception>, 
  echo:{ 
    id: <ID>,
    messageid: <ObjectID>
    message: <String>,
    time: <Time/Date>
  }
}
*/
router.post('/schedule', (req, res) => {
  const { id, message, time } = req.body;
    
    DisplaySchema.findOneAndUpdate({_id: id}, {$push: {scheduled:{text: message, time: time||Date.now()}}}, (err, doc) => {
      if (err) 
        return res.status(400).json({accepted:false, error:err, echo:{ id:id, message:message, time:time||Date.now() }});
      return res.status(200).json({accepted:true, echo:{ id:id, message:message, time:time||Date.now() }});
    })
});
    
module.exports = router;