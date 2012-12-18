var nodemailer = require('nodemailer');

exports.index = function(req, res){
  res.render('index', { title: 'Home', activeNavItem: "index" });
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Contact me', activeNavItem: "contact", error: false, fields: {} });
};

exports.emailContact = function(req, res){
    if(!req.body.email || !req.body.name || !req.body.message) {
       res.render('contact', { title: 'Contact me', activeNavItem: 'contact', error: true, fields: req.body}); 
       return;
    }
    
    var transport = nodemailer.createTransport("sendmail");
    
    var mailOptions = {        
        from: req.body.name + " <" + req.body.email + ">",
        to: "foo@bar.de",
        subject: "Contact from Photo Experience",
        text: req.body.message
    };

    transport.sendMail(mailOptions, function(err) {
        if(err) {
            console.log("An error occured", err);
            res.render("contactError", { title: 'Email sent successfully', activeNavItem: 'contact' });
            return;
        }
        
        
        console.log("Mailed", mailOptions);
        res.render("contactSuccess", { title: 'Email sent successfully', activeNavItem: 'contact' });
    });
};