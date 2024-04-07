require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')
const fs = require('fs')
const getId = require('./getId.js')
const {URL} = require('url')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.json());
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',(req,res)=>{
  const url = req.body.url
  
 

  try{  var hostname = new URL(url).hostname}
  catch(err){
    return res.json({error: 'invalid url'})
  }
  
 
  
  dns.lookup(hostname,(err,address,family)=>{
    if(err) return res.json({error: 'invalid url'})
   
    const shortUrl = Math.floor(Math.random() * 100000) + 1//getId(hostname)
    
     var urlData = { url, shortUrl }
    

    //save data into file
    //check if there is data on file
    var toWrite = "";
    fs.readFile('urls.json', 'utf8', (err, data) => {
      if (!err && data.trim().length > 0) {

        var urlList = JSON.parse(data);
        urlList.push(urlData)

       toWrite = JSON.stringify(urlList);


      }
      else{
     
        toWrite = JSON.stringify([urlData])
       
      }

      fs.writeFile('urls.json', toWrite, err => {
        if (err) {
            console.error('Error saving file: ', err);
            return;
        }
        
    });
  });
  
  res.json({original_url: urlData.url,short_url: urlData.shortUrl})

  })

  
})


app.get('/api/shorturl/:short_url',(req,res)=>{
  fs.readFile('urls.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer los datos:', err);
        return;
    }

  
    const urls = JSON.parse(data);
    const urlToRedirect = urls.find(url=>url.shortUrl==req.params.short_url).url
    res.redirect(urlToRedirect)
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
