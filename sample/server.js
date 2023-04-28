const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// Initialize and add the map
function initMap() {
    // The location of Uluru
       var tadepalli={
        lat:16.8073,
        lng:81.53
       }
      
        var map = new google.maps.Map(
          document.getElementById('map'),{
            zoom:4,
            center:tadepalli
          });
      
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({
      position: tadepalli,
      map: map
    });
  }
  window.initMap=initMap;
 

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index1.html");
})


app.post('/', function (req, res) {
    res.redirect('/index1');
    
  })

  app.get("/index1",function(req,res){
    res.sendFile(__dirname + "/index1.html");
  })

app.listen(3000, function () {
  console.log("welocome");
});
