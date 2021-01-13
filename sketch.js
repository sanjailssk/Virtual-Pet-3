
var dog,sadDogImg,happyDogImg,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feedButton,addFoodButton;
var food;
var gameState,readState;

function preload(){
  sadDogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png");
}

function setup() {
  database = firebase.database();
  createCanvas(900,500);

  dog = createSprite(850,250,15,15);
  dog.addImage(sadDogImg);
  dog.scale = 0.25;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  food = new Food();

  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
  lastFed = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

  feedButton = createButton("Feed the Dog");
  feedButton.position(685,100);
  feedButton.mousePressed(feedDog);

  addFoodButton = createButton("Add food");
  addFoodButton.position(795,100);
  addFoodButton.mousePressed(addFood);
}

function draw(){
  
    currentTime=hour();
    if(currentTime==(lastFed+1)){
        update("Playing");
        food.garden();
     }else if(currentTime==(lastFed+2)){
      update("Sleeping");
        food.bedroom();
     }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
        food.washroom();
     }else{
      update("Hungry")
      food.display();
     }
     
     if(gameState!="Hungry"){
       feedButton.hide();
       addFoodButton.hide();
       dog.remove();
     }else{
      feedButton.show();
      addFoodButton.show();
      dog.addImage(sadDogImg);
     }
     drawSprites();
  }

  function readStock(data){
    foodS = data.val();
    food.updateFoodStock(foodS);
  }

  function feedDog(){
      dog.addImage(happyDogImg);
      foodS--;
      database.ref('/').update({
        Food : foodS,
        gameState: "Hungry"
      })
      fedTime = hour(); 
  }

  function addFood(){
    dog.addImage(sadDogImg);
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }

  function update(state){
    database.ref('/').update({
      gameState: state
    })
  }
