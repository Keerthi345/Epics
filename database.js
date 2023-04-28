const sql=require('mysql');
const express = require('express');
const path=require('path');
const app = express();
const bodyParser=require('body-parser');
var nodemailer = require('nodemailer');
const multer=require('multer');
const session = require('express-session');




app.set('view engine','ejs');



app.use(express.static("assests"))
//const  fast2sms = require('fast-two-sms');
const fs = require('fs');
const users=[];
app.use(bodyParser.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'static')));
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
     cb(null,'images/')
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(null,Date.now()+path.extname(file.originalname))

    }
})
const limits = {
    fileSize : 4000000
}
const fileFilter =(req, file, cb) => {
    //if the file is not a jpg, jpeg, or png file, do not upload it multer; reject it.
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('File must be of type JPG, JPEG, or PNG and nore more than 2MB in size'))
    }
    //undefined = nothing went wrong; true = that is true, nothing went wrong, accept the upload.
    cb(null, true)
  }
const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
    // filename: filename
  })
const connection=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'visitors'
});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Keerthisekharkandukuri@gmail.com',
      pass: 'rroxmtrerkbpypxs'
    }
  });
connection.connect(function(err){
    if(err) throw err;
     console.log("connected");
    //  connection.query(sql,function(err,result){
    //     if(err) throw err;
    //     console.log("result: " + result);
    //   } );
});
app.get('/',function(req,res){
    res.sendFile(__dirname+"/project.html");
});
app.get('/project',function(req,res){
    if (req.session.loggedin) {
		// Output username
		res.send('Welcome back, ' + request.session.id_1 + '!');
	} else {
		// Not logged in
		res.send('Please login to view this page!');
	}
	res.end();
})
app.get('/details', function(req,res){
    res.sendFile(__dirname + "/details.html");
    
});
app.get("/securitylogin",function(req,res){
    res.sendFile(__dirname + "/securitylogin.html");


});
// app.post("/",function(req,res) {
//     res.redirect('/project.html');
// });
app.get("/Signup",function(req,res){
   res.sendFile(__dirname + "/Signup.html");
});
app.get("/visitordetailsk",function(req,res){
    res.sendFile(__dirname+"/visitordetailsk.html")
})
app.get("/checkoutdetails",function(req,res){
    res.sendFile(__dirname+"/checkoutdetails.html")
})
app.get("/area",function(req,res){
    res.sendFile(__dirname+"/area.html")
})
app.get("/about",function(req,res){
    res.sendFile(__dirname+"/at.html")
})
app.get("/update",function(req,res){
    res.sendFile(__dirname+"/update.html")
})
app.get('/approve',function(req,res){
    res.sendFile(__dirname+"/sam.html")
  })
app.get('/contact',function(req,res){
    res.sendFile(__dirname+"/contact.html")
})
app.post("/Signup",async function(req, res) {
    
    let name=req.body.name;
    let id_1=req.body.id_1;
    let phone_number=req.body.phone_number;
    let password=req.body.password;
    let address=req.body.address;
    let date=req.body.date;
    var data1={
        name:name,
        id_1:id_1,
        phone_number:phone_number,
        password:password,
        address:address,
        date:date    
    }
    var q="select * from security where id_1=?"
    const search=sql.format(q,[id_1])
    var sql1="insert into security(name,id_1,phone_number,date,password,address) values(?,?,?,?,?,?)";
    connection.query(search,(err,result)=>{
        if (err) throw err;
        console.log(result.length);
        if(result.length!=0){
            //connection.release();
            console.log("user already exists");
            res.sendStatus(409);
        }
        else{
            connection.query(sql1,[name,id_1,phone_number,date,password,address] ,function(err,res){
                //connection.release();
                if (err) throw err;
                console.log("inserted")
                //res.sendFile(__dirname+"/securitylogin.html")
        })
        res.redirect("/securitylogin")
    }
   

})
    
    
    
        
   
    
})

app.post("/securitylogin",function(req,res){
    let id_1=req.body.id_1;
    let password=req.body.password;
    if (id_1 && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM security WHERE id_1= ? AND password = ?', [id_1, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
            console.log(results.length);
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.id_1 = id_1;
				// Redirect to home page
				//res.redirect('/project');
			} else {
				//res.send('Incorrect Username and/or Password!');
                console.log('Incorrect username and/or password!');
                res.sendStatus(409);
                
			}			
			
		});
	} else {
		res.send('Please enter Username and Password!');
		
	}
   // var sql1='select details.*,checkout.* from details JOIN checkout on details.gate_id=checkout.gate_id';
    //console.log("hello world");
    // connection.query(sql,[id_1,password],function(err,res){
    //     if (err) throw err;
    //     console.log(res);

    //     if(res.length>0){
    //        console.log("user exists")
    //     }
    //     else{
    //         console.log("user does not exist")
    //     }
    // });
    var data;
    connection.query("select * from details",function(err,resultss,fields){
        if (err) throw err;
        //console.log("hiii");
        console.log(resultss.length);
        console.log(resultss);
        
        data=JSON.parse(JSON.stringify(resultss));
        console.log(data);

    });
    var Totalvisitors;
    connection.query('SELECT COUNT(*) AS total_visitors FROM details', (error, resultsss, fields) => {
        if (error) throw error;
        console.log('Totalvisitors:', resultsss[0].total_visitors);
        Totalvisitors=resultsss[0].total_visitors;
       
    });
    connection.query('select count(*) as insidee from details where destination_time=null',(err,ress,fields)=>{
         if(err) throw err;
        
         //console.log("number of people still inside the campus"+inside);
         res.render('view',{number:Totalvisitors,visitorsdata:data,numb:ress[0].insidee});
      
    });
    //console.log(visitorsdata.length)

    //res.sendFile(__dirname+"/visitordetails.html")
});

app.post('/details',upload.single('img'),  function(req,res){
    let visitor_name=req.body.visitor_name;
    let phone_number=req.body.phone_number;
    let host_name=req.body.host_name;
    let phone=req.body.phone;
    let purpose=req.body.purpose;
    let email=req.body.email;
    let arrival_time=req.body.arrival_time;
    let arrival_date=req.body.arrival_date;
    console.log(arrival_date);
     let category=req.body.category;
     let gate_id=req.body.gate_id;
   
    let image = req.file;
    console.log(image);
    const imageBuffer = fs.readFileSync(image.path);
    const imageBinary = Buffer.from(imageBuffer).toString('base64');
   
    var sql="insert into details(gate_id,visitor_name,phone_number,host_name,phone,arrival_time,arrival_date,category,purpose,email) values(?,?,?,?,?,?,?,?,?,?)";
    console.log("hii");
    const filename = req.file.filename;
    const mimetype = req.file.mimetype;
    const path = req.file.path;
    const data = fs.readFileSync(path);
    const query = 'INSERT INTO images (gate_id,filename, mime_type, data) VALUES (?,?,?,?)';
    connection.query(query, [gate_id,filename, mimetype, data], (error, results) => {
        if (error) throw error;
       // res.redirect('/');
    });
    //connection.query("select *from details where visitor_name =? and phone_number=? and host_name =? and phone=?",[visitorname,phonenumber,hostname,phone],function(error,results,fields){
    connection.query(sql,[gate_id,visitor_name,phone_number,host_name,phone,arrival_time,arrival_date,category,purpose,email],async function(err,results){
        
        if (err) throw err;
        //res.render('view');
        console.log("hii");
        console.log(results);
        
        var mailOptions = {
            from: 'keerthisekharkandukuri@gmail.com',
            to: email,
            subject: 'Visitor Check-In Request',
            // text: `A visitor named ${visitor.name} has requested to see you. Please approve or reject their request.`
            html:`<p>A new visitor has submitted a request:</p>
            <ul>
              <li>Name: ${visitor_name}</li>
              <li>Gate_id:${gate_id}</li>
    
              <li>Purpose: ${purpose}</li>
            </ul>
            <p>Click <a href="http://localhost:${7000}/approve">here</a> to approve the visit.</p>`
      };
        
      
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
      
            console.log('Email notification sent: ' + info.response);
            
          
          });

       
    });
  

    res.sendFile(__dirname+'/project.html');

    //console.log(data);
});
// app.post("/checkoutdetails",function(req,res){
//     let gate_id=req.body.gate_id;
//     let destination_date=req.body.destination_date;
//     let destination_time=req.body.destination_time;
//     connection.query("insert into checkout(gate_id,destination_date,destination_time) values(?,?,?)",[gate_id,destination_date,destination_time],function(err,res){
//         if (err) throw err;
//         console.log(res);
//     })
//     res.sendFile(__dirname+"/project.html");

// })
app.post('/search',function(req,res){
    let date=req.body.date;
    console.log("hiii");
    console.log(date);
    connection.query(`SELECT * FROM details WHERE DATE(arrival_date)='${date}'`,(err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error searching for visitors');
        } else {
            console.log(results.length);
            console.log(results);
          res.render('date', {visitorsdate: results });
        }
      });
})
app.post("/update",function(req,res){
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    let id=req.body.visitorId;
    let destination_date=req.body.destination_date;
    let destination_time=req.body.destination_time;
   var sql='update details set destination_date=?,destination_time=? where gate_id=?';
   connection.query(sql,[destination_date,destination_time,id],function(err,res){
    console.log("hiiiiiiiiiiiiiiii");
      if (err) throw err;
      console.log(res);
      
   })
   connection.query("select * from details",function(err,req,res){
            console.log(res);
   })
   res.redirect('/securitylogin'); 
});
app.post("/particular",function(req,res){
    var datae;
    var gate=req.body.gate_id;
    var dataURI;
    var query = 'SELECT mime_type, data FROM images WHERE gate_id = ?';
    connection.query(query, [gate], (error, results) => {
        if (error) throw error;
        const mimetype = results[0].mimetype;
        const data = results[0].data;
         dataURI = 'data:' + mimetype + ';base64,' + data.toString('base64');
       
    });
     connection.query("select * from details where gate_id=?",[gate],function(err,resultss,fields){
        if (err) throw err;
    // //     //console.log("hiii");
        console.log(resultss.length);
   console.log(resultss);
    //   var photo=resultss[0].data;
    // //     var dataURI= 'data:image/png;base64,' + photo.toString('base64');
     datae=JSON.parse(JSON.stringify(resultss));
      console.log(datae);
    // //     console.log(dataURI);
     res.render('particular',{visitorsdata:datae,dataURI: dataURI});
    });
    
    
   
    
      
})
app.post('/approve', (req, res) => {
    var id= req.body.gate_id;
    var status = req.body.status;
    //let email=req.body.email;
    connection.query('UPDATE details SET checked_in = ? gate_id = ?', [status, id], (err, result) => {
      if (err) throw err;
  
      // Notify visitor of approval or rejection
      const visitor = result[0];
      const message = (status) ? 'Your request to visit has been approved.' : 'Your request to visit has been rejected.';
  
      const mailOptions = {
        from: 'keerthisekharkandukuri@gmail.com',
        to: "421159@student.nitandhra.ac.in",
        subject: 'Visitor approval Notification',
        text: message
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
  
        console.log('Email notification sent: ' + info.response);
        
      });
    });
   res.redirect('/')
  });
  app.post("/contact",function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var text=req.body.text;
    
    const mailOptions = {
        from: 'keerthisekharkandukuri@gmail.com',
        to: "421159@student.nitandhra.ac.in",
        subject: 'query',
        text: text
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
  
        console.log('Email notification sent: ' + info.response);
        
      });

  })
app.listen(7000);

