const router = require('express').Router();
const{google} =require('googleapis');
const { calendar } = require('googleapis/build/src/apis/calendar');

const GOOGLE_CLIENT_ID='271341033472-h6vpdvkueiv43147f0n5dkril6ljdkg5.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET='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'


const REFRESH_TOKEN=''
const oauth2Client=new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next)=>{
  try {
    const {code }= req.body
    const {tokens} =await oauth2Client.getToken(code)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/create-event',async (req, res, next)=>{
  try {
   const{ summary,description,location,startDateTime,endDateTime}=req.body
   oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
   const calendar = google.calendar('v3')
   const response=await calendar.events.insert({
     auth: oauth2Client,
     calendarId: 'primary',
     requestBody:{
       summary: summary,
       description: description,
       location:location,
       colorId: '5',
       start:{
         dateTime: new Date(startDateTime),
       },
       end:{
         dateTime: new Date(endDateTime),
       },
     },
   })
   res.send(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router
