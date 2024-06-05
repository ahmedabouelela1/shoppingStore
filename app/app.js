var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Session } = require('inspector');
const bp = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(bp.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'foo',
  store: MongoStore.create({ mongoUrl: "mongodb+srv://admin:admin@cluster0.sj9ic.mongodb.net/db1?retryWrites=true&w=majority" }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    expires: 60000 *60*24
  }
}));
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/home', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('home');
  } 
});

app.get('/', function (req, res) {
  let sess = req.session;
  if (sess.user) {
    res.redirect('/home');
  }
  else {
    res.redirect('/login');
  }
});

app.get('/login', function (_req, res) {
  res.render('login', { message: '' });
});

app.post('/login', function (req, res) {
  var x = req.body.username;
  var y = req.body.password;
  login(x, y, res).then(function (value) {
    if (value) {
      req.session.user = x;
      res.redirect('/home');
    }
    else {
      res.render('login', { message: 'Wrong email or paswoord' });
    }
  });
});


app.get('/registration', function (req, res) {
  res.render('registration', { message: '', mess: '' });
});
app.post('/register', function (req, res) {
  var x = req.body.username;
  var y = req.body.password;
  register(x, y, res);
});



async function register(username, password,res) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin@cluster0.sj9ic.mongodb.net/db1?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  var users = await client.db('db1').collection('users').find().toArray();
  var flag = false;
  for (let user of users) {
    if (user.username === username)
      flag = true;
  }
  if (username.length ===0|| password.length === 0)
    flag = true;
  if (flag) {
    res.render('registration', { message: '', mess: 'Unvalid username or password. choose a valid one'});
  }
  else {
    var user = { username: username, password: password};
    await client.db('db1').collection('users').insertOne(user);
    res.render('registration', { message: 'You have been succefully registered. Click to proceed to login.', mess: '' });
  }
  client.close();
}

async function login(username, password,res) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin@cluster0.sj9ic.mongodb.net/db1?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  var users = await client.db('db1').collection('users').find().toArray();
  //console.log(users);
  var flag = false;
  for (let user of users) {
    //console.log(user.username + "  " + username);
    if (user.username === username) {
      if (user.password === password) {
        //console.log('hiii');
        flag = true;
      }
    }
  }
  client.close();
  //console.log(flag + "2");
  return flag;
}

app.get('/books', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('books');
  } 
});
app.get('/boxing', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('boxing', { mess: "" });
  } 
});
app.get('/galaxy', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('galaxy', { mess: "" });
  } 
});
app.get('/cart', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    var user = req.session.user;
    cartProducts(user).then(function (value) {
      //console.log(value);
      res.render('cart', { prod:value });
    });
  } 
});
async function cartProducts(user) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin@cluster0.sj9ic.mongodb.net/db1?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  var cart = await client.db('db1').collection('cart').find().toArray();
  //console.log(cart);
  var prod = [];
  for (let product of cart) {
    //console.log(product.user + "   " + user);
    if (product.user === user) {
      prod.push(product.product);
    }
  }
  //console.log(prod);
  client.close();
  return prod;
}
app.get('/iphone', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('iphone', { mess: "" });
  } 
});
app.get('/leaves', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('leaves', { mess: "" });
  } 
});
app.get('/phones', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('phones');
  } 
});
app.get('/sports', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('sports');
  } 
});
app.get('/tennis', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('tennis', { mess: "" });
  } 
});
app.get('/sun', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('sun', { mess: "" });
  } 
});

app.post('/sun', function (req, res) {
  isInCart(req.session.user, 'sun').then(function (value) {
    if (!value) {
      addToCart(req.session.user, 'sun').then(function () {
      res.render('sun', { mess: "Added successfully" });
      });
    }
    else {
      res.render('sun', { mess: "Already in cart" });
    }
  });
});
app.post('/leaves', function (req, res) {
  isInCart(req.session.user, 'leaves').then(function (value) {
    if (!value) {
      addToCart(req.session.user, 'leaves').then(function () {
        res.render('leaves', { mess: "Added successfully" });
      });
    }
    else {
      res.render('leaves', { mess: "Already in cart" });
    }
  });
});
app.post('/iphone', function (req, res) {
  isInCart(req.session.user, 'iphone').then(function (value) {
    if (!value) {
      addToCart(req.session.user, 'iphone').then(function () {
        res.render('iphone', { mess: "Added successfully" });
      });
    }
    else {
      res.render('iphone', { mess: "Already in cart" });
    }
  });
}); app.post('/galaxy', function (req, res) {
  isInCart(req.session.user, 'galaxy').then(function (value) {
    if (!value) {
      addToCart(req.session.user, 'galaxy').then(function () {
        res.render('galaxy', { mess: "Added successfully" });
      });
    }
    else {
      res.render('galaxy', { mess: "Already in cart" });
    }
  });
}); app.post('/tennis', function (req, res) {
  isInCart(req.session.user, 'tennis').then(function (value) {
    if (!value) {
      addToCart(req.session.user, 'tennis').then(function () {
        res.render('tennis', { mess: "Added successfully" });
      });
    }
    else {
      res.render('tennis', { mess: "Already in cart" });
    }
  });
}); app.post('/boxing', function (req, res) {
  isInCart(req.session.user, 'boxing').then(function (value) {
    if (!value) {
      addToCart(req.session.user, 'boxing').then(function () {
        res.render('boxing', { mess: "Added successfully" });
      });
    }
    else {
      res.render('boxing', { mess: "Already in cart" });
    }
  });
});
async function addToCart(user,product) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin@cluster0.sj9ic.mongodb.net/db1?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  var p = { user: user, product: product };
  await client.db('db1').collection('cart').insertOne(p);
  client.close();
}

async function isInCart(user, product1) {
  var { MongoClient } = require('mongodb');
  var url = "mongodb+srv://admin:admin@cluster0.sj9ic.mongodb.net/db1?retryWrites=true&w=majority";
  var client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  var cart = await client.db('db1').collection('cart').find().toArray();
  var flag = false;
  for (let product of cart) {
    if (product.user === user) {
      if (product.product === product1)
        flag = true;
    }
  }
  client.close();
  return flag;
}




app.get('/searchresults', function (req, res) {
  let sess = req.session;
  if (!sess.user) {
    res.redirect('/login',);
  }
  else {
    res.render('searchresults');
  } 
});

// post of search
app.post('/search',function(req,res){
  // if session expired redirect to login
  if(session == undefined){
   res.redirect('/')
 }
 else{
   session.session_searchlist = [];
   //console.log(session);

 var user_input = req.body.Search;
 user_input = user_input.toLowerCase();
 var str1 = "the sun and her flowers";
 var str2 = "galaxy s21 ultra"
 var str3 = "leaves of grass"
 var str4 = "iphone 13 pro"
 var str5 = "boxing bag"
 var str6 = "tennis racket"
 
 if(str1.includes(user_input)){
   session.session_searchlist.push(str1);
 }

 if(str2.includes(user_input)){
    session.session_searchlist.push(str2);
 }

 if(str3.includes(user_input)){
   session.session_searchlist.push(str3);
 }

 if(str4.includes(user_input)){
   session.session_searchlist.push(str4);
 }

 if(str5.includes(user_input)){
  session.session_searchlist.push(str5);
 }

 if(str6.includes(user_input)){
  session.session_searchlist.push(str6);
 }

 if(session.session_searchlist.length==0){
   res.render('searchresults',{data:session.session_searchlist,noSearchResult:"No Search Result"});
   
 }
 else{
   res.render('searchresults',{data:session.session_searchlist,noSearchResult:""});
 }


 }
});




/*
app.get('/books',function(req, res){
  res.render('books')
});*/
/*app.get('/boxing',function(req, res){
  res.render('boxing')
});
app.get('/galaxy',function(req, res){
  res.render('galaxy')
});

app.get('/cart',function(req, res){
  res.render('cart')
});

app.get('/iphone',function(req, res){
  res.render('iphone')
});
app.get('/leaves',function(req, res){
  res.render('leaves')
});
app.get('/phones',function(req, res){
  res.render('phones')
});

app.get('/sports',function(req, res){
  res.render('sports')
});
app.get('/sun',function(req, res){
  res.render('sun')
});
app.get('/tennis',function(req, res){
  res.render('tennis')
});*/



if(process.env.PORT) {
  app.listen(process.env.PORT, function() {console.log('Server started')});
}
else{
  app.listen(3000, function() {console.log('Server started on port 3000')});
}
//done