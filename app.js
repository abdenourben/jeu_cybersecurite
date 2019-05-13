var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var http = require('http').Server(app);


//mongodb
var db = require('./_helpers/db')

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
})


//cors enabling
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//game
const playersNbMax = 5;
delete players;
var players=[];//players IDs list
var cardsInUse = [];//array of cards' id's that are distributed to players 

//socket
var io = require('socket.io')(http,{ serveClient: false,origins:'*:*' });
io.on('connection',function(sock){
  console.log('connected'+sock.id)
  sock.on('playerRequest', async function(req){
      if(players.length+1>playersNbMax){
          sock.emit('playResponse', {})
      }
      else {
          var cards = [];
          //list cards
          var cardScenareo = await db.getRandomCard('scenareo', cardsInUse,0)//.then(c => { console.log(c); });
          cardsInUse.push({ playerId: sock.id, cardId: cardScenareo.id, type:0  });
          cards.push(cardScenareo)
          var cardRisk1 = await db.getRandomCard('risks', cardsInUse,1)//.then(c => { console.log(c); });
          cardsInUse.push({ playerId: sock.id, cardId: cardRisk1.id, type: 1 });
          cards.push(cardRisk1)
          var cardRisk2 = await db.getRandomCard('risks', cardsInUse,1)//.then(c => { console.log(c); });
          cardsInUse.push({ playerId: sock.id, cardId: cardRisk2.id, type: 1 });
          cards.push(cardRisk2)
          //END list cards
          sock.emit('playResponse', { cards: cards, socketId: sock.id, playersList: players })
        if(players.length==0)
        {
          players.push({number:0,id:sock.id});
          //sock.broadcast.emit('newPlayer',{playerNumber:0,id:sock.id});
        }
        else
        {
          for (let index = 0; index < playersNbMax; index++) {
            var x  = players.find((p)=> p.number==index);
            if(x==null){
              players.push({number:index,id:sock.id});
              break;
            }
          }
            sock.broadcast.emit('newPlayer', { playerNumber: players[players.length - 1].number, id: sock.id });

        }
                
      }
  });
    sock.on('changeCardForMe', async function (req) {
        var j = 0;
        var card;
        for (var i = 0; i < cardsInUse.length; i++) {
            if (cardsInUse[i].playerId == req.from) {
                if (req.cardIndex == j) {
                    var collectionName = getCollectionName(j);
                    card = await db.getRandomCard(collectionName, cardsInUse);
                    cardsInUse[i].cardId = card.id;
                    break;
                }
                else {
                    j++;
                }
            }
        }
        console.log(cardsInUse)
        sock.emit('changeCardForMe', { card: card, index: req.cardIndex });
    });
    sock.on('readCard', async function (req) {
        var j = 0;
        var card;
        for (var i = 0; i < cardsInUse.length; i++) {
            if (cardsInUse[i].playerId == req.ownerId) {
                if (req.cardIndex == j) {
                    var collectionName = getCollectionName(req.cardIndex);
                    card = await db.cardById(collectionName, cardsInUse[i].cardId);
                    break;
                    //cardsInUse[i].cardId = card.id;
                }
                else {
                    j++;
                }
            }
        }
       
        if(!card)
        return;
        if(req.elementName) {
          sock.emit('readCard', { name: card.name, elementName:req.elementName});
          return; 
        }
        if(req.type=="firstValidation"){
          sock.emit('readCard', { name: card.name,cardIndex: req.cardIndex,type:"firstValidation"});
        }
        else {
          sock.emit('readCard', { name: card.name,type:req.type});
        }
        
    });
    sock.on('tradeRequest', async function (req) {    
      sock.broadcast.to(req.to).emit('tradeRequest', { from: sock.id, requestedCard: req.requestedCard, offeredCard: req.offeredCard });

  });
  sock.on('tradeResponse', async function (req) {      
    if(req.response=="yes")
    {

      var k;
      var o;
      var j = 0;
        for (var i = 0; i < cardsInUse.length; i++) {
            if (cardsInUse[i].playerId == req.to) {
                if (req.offeredCard == j) {
                    k=i;
                    break;
                    //cardsInUse[i].cardId = card.id;
                }
                else {
                    j++;
                }
            }
        }
         j = 0;
        for (var i = 0; i < cardsInUse.length; i++) {
            if (cardsInUse[i].playerId == sock.id) {
                if (req.requestedCard == j) {
                    o=i;
                    break;
                    //cardsInUse[i].cardId = card.id;
                }
                else {
                    j++;
                }
            }
        }
      var id = cardsInUse[k].cardId
      cardsInUse[k].cardId=cardsInUse[o].cardId
      cardsInUse[o].cardId=id
      sock.broadcast.to(req.to).emit('tradeResponse', { from:  sock.id,  response: "yes" });
    }
    else{     
      sock.broadcast.to(req.to).emit('tradeResponse', { from:  sock.id,  response: "no" });
    }
    

});
    function getCollectionName(cardIndex) {
        switch (cardIndex) {
            case 0:
                return 'scenareo'
                break;
            case 1:
                 return'risks'
                break;
            case 2:
                return 'risks'
                break;
            case 3:
                return 'tools'
                break;
            case 4:
                return 'tools'
                break;
            default:
                return null;
        }
    }
    function getCardType(cardIndex) {
        switch (cardIndex) {
            case 0:
                return 0
                break;
            case 1:
                return 1
                break;
            case 2:
                return 1
                break;
            case 3:
                return 2
                break;
            case 4:
                return 2
                break;
            default:
                return null;
        }
    }
  sock.on('disconnect',function(ds){
    var p =players.find(x=>x.id==sock.id);
    if(p!=null)
    {
        players = players.filter(x => x.id != sock.id);
        cardsInUse = cardsInUse.filter(x => x.playerId != sock.id)
      io.emit('playerOut',{playerNumber:p.number,id:sock.id});

    }
   
  });
  sock.on('cardRequest',function(req){
    sock.broadcast.to(req.to).emit('cardRequest',{from:req.from,cardId:req.cardId});
  })

  sock.on('validate1', async function (req) {
    var validated = await db.validate1(sock.id,cardsInUse,req.cardIndex);
    
    if(validated)
    {
      var cards = [];
      var cardTool1 = await db.getRandomCard('tools', cardsInUse,2)//.then(c => { console.log(c); });
            cardsInUse.push({ playerId: sock.id, cardId: cardTool1.id, type: 2 });
            cards.push(cardTool1)
            var cardTool2 = await db.getRandomCard('tools', cardsInUse,2)//.then(c => { console.log(c); });
            cardsInUse.push({ playerId: sock.id, cardId: cardTool2.id, type: 2 });
            cards.push(cardTool2)
        //remove the other risk card 
        var cardToRemoveIndex;     
        if(req.cardIndex==1)
        {
          cardToRemoveIndex=2;
        }    
        else{
          cardToRemoveIndex=1;
        }
        var j = 0;
          var card;
          for (var i = 0; i < cardsInUse.length; i++) {
              if (cardsInUse[i].playerId == sock.id) {
                  if (cardToRemoveIndex== j) {
                     cardsInUse[i].cardId=-1;
                      break;
                      //cardsInUse[i].cardId = card.id;
                  }
                  else {
                      j++;
                  }
              }
          }
      sock.emit('validate1', {response:'yes',validatedIndex:req.cardIndex,cardsOutil:cards});
    return;
    }
    else {

      sock.emit('validate1', {response:'no',validatedIndex:req.cardIndex});
    }
    
  });
  sock.on('validate2', async function (req) {
    /*var validated1 = await db.validate1(sock.id,cardsInUse,req.ijb);
    if(validate1)
    {
      sock.emit('validate1', {response:'no'});
      return;
    */
    var validated2 = await db.validate2(sock.id,cardsInUse);
    if(validated2)
    {
      sock.emit('validate2', {response:'yes'});
    return;
    }
    else
    sock.emit('validate2', {response:'no'});
  });

    sock.on('disconnect',function(ds){
      var p =players.find(x=>x.id==sock.id);
      if(p!=null)
      {
          players = players.filter(x => x.id != sock.id);
          cardsInUse = cardsInUse.filter(x => x.playerId != sock.id)
        io.emit('playerOut',{playerNumber:p.number,id:sock.id});
  
      }
     
    });
    sock.on('cardRequest',function(req){
      sock.broadcast.to(req.to).emit('cardRequest',{from:req.from,cardId:req.cardId});
    })
    sock.on('changeCardForMe', async function (req) {
      var j = 0;
      var card;
      for (var i = 0; i < cardsInUse.length; i++) {
          if (cardsInUse[i].playerId == sock.id) {
              if (req.cardIndex == j) {
                  var collectionName = getCollectionName(j);
                  card = await db.getRandomCard(collectionName, cardsInUse);
                  cardsInUse[i].cardId = card.id;
                  break;
              }
              else {
                  j++;
              }
          }
      }
      sock.emit('changeCardForMe', { card: card, index: req.cardIndex });
  });
  
});




http.listen(5004, function(){
  console.log('listening on *:5004');
});
module.exports = app;
