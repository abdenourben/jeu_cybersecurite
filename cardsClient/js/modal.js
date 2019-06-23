var button = $('._close1');

var accept = $('._accept');
var reject = $('._reject'); 

var badge = $('.badge'); 
var imageBadge = $('.image-bagde');

var modal1 = $('._modal1');
var backdrop = $('._backdrop');
//var backdrop2 = $('._backdrop2');
var modal2 = $('._modal2');

var modal3 = $('._modal3');
var riskSection = $('.risk-section'); 
var trade = $('._trade'); 


//var appliquerButton = $('.appliquer-button');
//var ownPlayer = $('#own-player-img'); 

var distribScenario = $('#distrib-scenario'); 
var distribRisk = $('#distrib-risk'); 
var distribOutil = $('#distrib-outil'); 

//cards 
var cardScenario = $('.card-scenario');
var cardRisk = $('.card-risk'); 
var cardOutil = $('.card-outil');  

var paquet = $('.paquet'); 


var outputParagraph = $('._quote');

var quote = "Vanessa Paradis, née le 22 décembre 1972 à Saint-Maur-des-Fossés, est une chanteuse, actrice et mannequin française. Elle devient célèbre dès l'âge de quatorze ans avec son premier disque Joe le taxi et mène, depuis, une carrière dans la musique, le cinéma et la mode";

var selected1; 
var selected2; 



$('#ok-trade').unbind('click').bind('click', function(){
  socket.emit('tradeResponse', {
    response:"yes", to:acceptPlayerFrom, requestedCard:acceptRequestedFrom, offeredCard: acceptOfferedCard
  })
  backdrop.css("display", "none"); 
  $('.bottom-pop-trade-evaluation-risk').removeClass("open"); 
  $('.bottom-pop-trade-evaluation-risk').addClass("none"); 
})

$('#confirm-trade-risk').unbind('click').bind('click', function(){
  socket.emit('tradeRequest', {to:players[currentPlayer].id, requestedCard:selectedCard, offeredCard:selected2});
  backdrop.css("display","none");
  closeModal1(); 
  $(".bottom-pop-trade-risk").removeClass("open"); 
  $(".bottom-pop-trade-risk").addClass("none");
})

$('#trade-risk1-request').unbind('click').bind('click', function(){
 
  if(selected2!=1)
  {
    selected2=1;
    $('#trade-risk1-request').addClass('selected');
    $('#trade-risk2-request').removeClass('selected');
  }
})

$('#trade-risk2-request').unbind('click').bind('click', function(){
  if(selected2!=2)
  {
    selected2=2;
    $('#trade-risk2-request').addClass('selected');
    $('#trade-risk1-request').removeClass('selected');
  }
})

$('#validation-two').unbind('click').bind('click', function(){
  socket.emit('validate2', {})
})

$('#validation-one').unbind('click').bind('click', function(){
  if(selected1)
  socket.emit('validate1', {cardIndex:selected1}); 
})

$('#valid-risk1').unbind('click').bind('click', function(){
 
  if(selected1!=1)
  {
    selected1=1;
    $('#valid-risk1').addClass('selected');
    $('#valid-risk2').removeClass('selected');
  }
})

$('#valid-risk2').unbind('click').bind('click', function(){
  if(selected1!=2)
  {
    selected1=2;
    $('#valid-risk2').addClass('selected');
    $('#valid-risk1').removeClass('selected');
  }
})


$('#trade-button').on('click', function(){
  $('.bottom-pop-trade-risk').removeClass("none");
  $('.bottom-pop-trade-risk').toggleClass("open"); 

  socket.emit('readCard', {from:mySocketId, ownerId:mySocketId, cardIndex:1, elementName:'#trade-risk1-request'}); 
  socket.emit('readCard', {from:mySocketId, ownerId:mySocketId, cardIndex:2, elementName:'#trade-risk2-request'}); 
  

  $('.bottom-pop-choice').removeClass("open"); 
  $('.bottom-pop-choice').addClass("none"); 
  $('._modal1').css("top", "10%");

 

  if(playing)
	return;

  playing = true;

  returnCard.play();
  popUpDamnTradeCard.play(); 
})

var popUpDamnTradeCard = anime({
  targets: '.bottom-pop-trade-risk',
  translateY: -250
});


$('#replace-button').unbind('click').bind('click', function(){
  backdrop.css("display", "block"); 
  $('.bottom-pop-choice-prof').removeClass("open"); 
  $('.bottom-pop-choice-prof').addClass("none"); 
  $('.bottom-pop-new-card').removeClass("none");
  $('.bottom-pop-new-card').toggleClass("open"); 

  setTimeout(() => {
    $('.bottom-pop-new-card').removeClass("open");
    $('.bottom-pop-new-card').addClass("none"); 
    backdrop.css("display", "none"); 
    closeModal1();
  }, 3000);

  modal1.css("display", "none");  

 

  socket.emit('changeCardForMe', {cardIndex:currentCard});


  if(playing)
	return;

  playing = true;
  returnCard.play();
  popUpDamnNewCard.play(); 
  //closeModal1(); 
})

var popUpDamnNewCard = anime({
  targets: '.bottom-pop-new-card',
  translateY: -250
});

$('.card-scenario').on('click', function(){
  $('.bottom-pop-choice').removeClass("open");
  $('.bottom-pop-choice').addClass("none");
})

$('.card-change-player-risk').on('click', function(){
  $('.bottom-pop-choice').removeClass("none"); 
  $('.bottom-pop-choice').toggleClass("open"); 
})


$('.card-change-prof').on('click', function(){
  $('.bottom-pop-choice-prof').removeClass("none");
  $('.bottom-pop-choice-prof').toggleClass("open"); 
})

$('.validation-risk-button').on('click', function(){
  backdrop.css("display", "block"); 
  $('.bottom-pop-validation-risk').removeClass("none");
  $('.bottom-pop-validation-risk').toggleClass("open"); 
  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:0,elementName:"#valid-scenario"});
  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:1,elementName:"#valid-risk1"});
  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:2,elementName:"#valid-risk2"});

  if(playing)
	return;

  playing = true;
  returnCard.play(); 

  popUpDamn.play(); 
})

var popUpDamn = anime({
  targets: '.bottom-pop-validation-risk',
  translateY: -250
});

$('.validation-button').on('click', function(){
  backdrop.css("display", "block"); 
  $('.bottom-pop-final-validation').removeClass("none"); 
  $('.bottom-pop-final-validation').toggleClass("open"); 

  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:0,elementName:"#valid-final-scen"});
  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:1,elementName:"#valid-final-risk", type:"valid-final-risk"});
  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:3,elementName:"#valid-final-outil1"});
  socket.emit('readCard',{from:mySocketId,ownerId:mySocketId,cardIndex:4,elementName:"#valid-final-outil2"});



  if(playing)
	return;

  playing = true;
  returnCard.play(); 

  popUpDamnFinalValidation.play(); 
})

var popUpDamnFinalValidation = anime({
  targets: '.bottom-pop-final-validation',
  translateY: -250
});

$('.cancel-trade-risk').on('click', function(){
  $("._modal1").css("top", "20%"); 
  $(".bottom-pop-trade-risk").removeClass("open"); 
  $(".bottom-pop-trade-risk").addClass("none"); 
  $('.bottom-pop-choice').removeClass("none");
  $('.bottom-pop-choice').toggleClass("open");
})

$('.cancel-validation-risk').on('click', function(){
  backdrop.css("display", "none"); 
  $('.bottom-pop-validation-risk').removeClass("open"); 
  $('.bottom-pop-validation-risk').addClass("none"); 
})

$('.cancel-final-validation').on('click', function(){
  backdrop.css("display", "none"); 
  $('.bottom-pop-final-validation').removeClass("open"); 
  $('.bottom-pop-final-validation').addClass("none"); 
})

$('.cancel-evaluation-risk').on('click', function(){
  socket.emit('tradeResponse', {
    response:"no", to:acceptPlayerFrom, requestedCard:acceptRequestedFrom, offeredCard: acceptOfferedCard
  })
  backdrop.css("display", "none"); 
  $('.bottom-pop-trade-evaluation-risk').removeClass("open"); 
  $('.bottom-pop-trade-evaluation-risk').addClass("none"); 
})

function inputParagraph() {
  outputParagraph.text(quote);
}


function closeModal1() {
	modal1.css("display", "none");
  backdrop.css("display", "none"); 
  $('.bottom-pop-choice').removeClass("open");
  $('.bottom-pop-choice').addClass("none");
  $('.bottom-pop-choice-prof').removeClass("open");
  $('.bottom-pop-choice-prof').addClass("none");
  $(".bottom-pop-trade-risk").removeClass("open"); 
  $(".bottom-pop-trade-risk").addClass("none");
}

function closeModal2() {
	modal2.css("display", "none");
	backdrop.css("display", "none");
}

function closeModal3(){
	modal3.css("display", "none");
	backdrop.css("display", "none"); 
}

inputParagraph();

badge.on('click', function(e) {
  backdrop.css("display", "block");
  $('.bottom-pop-trade-evaluation-risk').removeClass("none"); 
  $('bottom-pop-trade-evaluation-risk').toggleClass("open"); 
  
  if(playing)
	return;

  playing = true;
  returnCard.play(); 
  popUpDamnBadge.play(); 
  $('.badge').css("display", "none"); 
 	e.stopPropagation();
});

$('.badgeResponse').on('click', function() {
  

 

  if(tradeResponse=="yes")
  {
    backdrop.css("display", "block"); 
    $('.badgeResponse').css("display", "none"); 
    $('.bottom-pop-new-card-response').removeClass("none");
    $('.bottom-pop-new-card-response').toggleClass("open"); 
    $('.card-container-portfolio-new-card-response').removeClass("none"); 
    $('.card-container-portfolio-new-card-response').addClass("open"); 
    socket.emit('readCard', {from:mySocketId, ownerId:mySocketId, cardIndex:newCardIndex, elementName:"#newCardResponse"});
  }
  else
  {
    backdrop.css("display", "block"); 
    $('.badgeResponse').css("display", "none");
    $('.bottom-pop-new-card-response-no').removeClass("none"); 
    $('.bottom-pop-new-card-response-no').addClass("open"); 
    $('.bottom-pop-new-card-response-no .failTrade').removeClass("none"); 
    $('.bottom-pop-new-card-response-no .failTrade').addClass("open"); 
  }

  setTimeout(() => {
    $('.bottom-pop-new-card-response').removeClass("open");
    $('.bottom-pop-new-card-response').addClass("none"); 
    $('.card-container-portfolio-new-card-response').removeClass("open"); 
    $('.card-container-portfolio-new-card-response').addClass("none"); 
    $('.bottom-pop-new-card-response-no').removeClass("open"); 
    $('.bottom-pop-new-card-response-no').addClass("none"); 
    $('.bottom-pop-new-card-response-no .failTrade').removeClass("open"); 
    $('.bottom-pop-new-card-response-no .failTrade').addClass("none"); 
    backdrop.css("display", "none"); 
  }, 3000);

  if(playing)
	return;

  playing = true;
  returnCard.play();
  popUpDamnNewCard.play(); 
  closeModal1(); 
});



var popUpDamnBadge = anime({
  targets: '.bottom-pop-trade-evaluation-risk',
  translateY: -250
});

imageBadge.on('click', function(e){
	e.stopPropagation();
});

button.on('click', function(e){
closeModal1();
e.stopPropagation();  
}) ;
//backdrop1.on('click', closeModal1);

//backdrop2.on('click', closeModal2);


accept.on('click', closeModal2);
reject.on('click', closeModal2);

//riskSection.on('click',function(){
//	modal3.css("display", "block");
//	backdrop.css("display", "block");
//});


//for sending notification to another player to make trade ; to change!
trade.on('click',closeModal3); 


//backdrop1.on('click', closeModal3); 




//avatar 

//appliquerButton.on('click', function(){
//	ownPlayer.attr('src', 'images/img_avatar2.png'); 

//}); 


//distribution cards 
var turnArround = anime({
  targets: '.box',
  translateX: -250,
  delay:1000, 
});



distribScenario.on('click', function(){
  cardScenario.css("display", "block"); 
  $(this).css("display", "none"); 
})



distribRisk.on('click', function(){
  cardRisk.css("display", "block"); 
  $(this).css("display", "none"); 
  cardScenario.css("display", "block"); 
  distribScenario.css("display", "none"); 
})

distribOutil.on('click', function(){
  cardOutil.css("display", "block"); 
  $(this).css("display", "none"); 
})


paquet.on('click', function(){
  cardScenario.css("display", "block");
})


//--------------------------



//----------------------------

var cardPortfolio = document.querySelectorAll(".card-portfolio");
var playing = false;


var returnCard =  anime({
  targets: cardPortfolio,
  scale: [{value: 1}, {value: 1.3}, {value: 1, delay: 400}],
  rotateY: {value: '+=180', delay: 350},
  easing: 'easeInOutSine',
  duration: 500,
  complete: function(anim){
  playing = false;
  }
});

