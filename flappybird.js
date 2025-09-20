let myCanvas ;
let ctx ;
let birdimg;
let scoreElement;
let  highestvalue;


let boardwidth=1060;
let boardheight=560;

let birdwidth=50;
let birdheight=50;
let birdy=boardheight/2;
let birdx=boardwidth/8;



//bird
let bird={
  x: birdx,
  y:birdy,
  width:birdwidth,
  height:birdheight
}

//pipe
let pipearray=[];
let pipewidth=64;
let pipeheight=512;
let pipex=boardwidth;
let pipey=0;
let toppipeimg;
let bottompipeimg;
let jumpSound;
let crashSound;
let tickSound;
let failSound;




//move
let velocityx=-2;
let velocityy=0;
let gravity=0.2;


//score
let score=0;




let gameover=false;
crashSound = new Audio('./assets/jump_sound.mp3'); // replace with your sound file path
jumpSound = new Audio('./assets/jump_sound1.mp3'); // replace with your sound file path
tickSound = new Audio('./assets/tick_sound.mp3'); // replace with your sound file path
failSound = new Audio('./assets/fail.mp3'); // replace with your sound file path

window.onload=function(){
  scoreElement=document.getElementById("score-value");
  
  highestvalue=document.getElementById("highest-value")
  
 
   myCanvas = document.getElementById("myCanvas");
   ctx = myCanvas.getContext("2d");
   myCanvas.height=boardheight;
   myCanvas.width=boardwidth;






 birdimg=new Image();
birdimg.src='./assets/bird.png'
birdimg.onload = function() {
    ctx.drawImage(birdimg, bird.x, bird.y,bird.width,bird.height);
  };


   toppipeimg=new Image();
  toppipeimg.src='./assets/upper.png'



  bottompipeimg=new Image();
  bottompipeimg.src='./assets/lower.png'





  requestAnimationFrame(update)
  setInterval(placepipe,1500)

  document.addEventListener("click",movebird);
  document.addEventListener("keydown",movebird);
}




function update(){
  requestAnimationFrame(update);


  if (gameover) {
    let high = parseInt(highestvalue.innerHTML) || 0; 
    let max = (score > high) ? score : high;       
    highestvalue.innerHTML = max;                    
 
    
      document.getElementById("gameover-section").style.display = "block";
      document.getElementById("restart-btn").addEventListener("click",restart);

    
    
    return;
  }
 



  ctx.clearRect(0,0,boardwidth,boardheight)
   velocityy+=gravity;

bird.y+=velocityy;

bird.y=Math.max(bird.y,0.1);
bird.y=Math.min(bird.y,512);



if(bird.y>=boardheight||bird.y<=0)
{
  

  gameover=true;
}
  ctx.drawImage(birdimg, bird.x, bird.y,bird.width,bird.height);

  for(let i=0;i<pipearray.length;i++)
  {
    let pipe=pipearray[i];
   
    pipe.x+=velocityx;

    ctx.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
    if(!pipe.ispassed&&bird.x>pipe.x+pipe.width)
    {
      score+=0.5;
      pipe.ispassed=true;
       tickSound.currentTime = 0;
      tickSound.play();
      scoreElement.innerHTML=score;
    }

    if(detectcollision(bird,pipe))
    {
       if (crashSound) {
      jumpSound.pause();
       jumpSound.currentTime = 0;
      crashSound.play();
      failSound.play();
    }
      gameover=true;
    }
  }


  while(pipearray.length>0&&pipearray[0].x<-pipewidth)
  {
    pipearray.shift();
  }

}



function placepipe()
{



  let randompipey=pipey-pipeheight/4-Math.random()*(pipeheight/2)
let openspace=(boardheight/4)+20;

  let toppipe={
      img:toppipeimg,
      x: pipex,
      y:randompipey,
      width:pipewidth,
      height:pipeheight,
      ispassed:false

  }

  
  
  let bottompipe={
    img:bottompipeimg,
    x: pipex,
    y:randompipey+pipeheight+openspace,
    width:pipewidth,
    height:pipeheight,
    ispassed:false

}
  pipearray.push(toppipe,bottompipe);
}


function movebird(e){
  if(!gameover)
  {
    if(e.code=="Space"||e.code=="ArrowUp")
  {
     velocityy=-5;
     if (jumpSound) {
       crashSound.pause();
        failSound.pause();
      crashSound.currentTime = 0;
      jumpSound.play();
    }
  }


  if (e.type === "click" || e.type === "touchstart") {
    velocityy = -5;
     if (jumpSound) {
       crashSound.pause();
        failSound.pause();
      
      
      jumpSound.play();
    }
  }

  }

  




}



function detectcollision( a,b){
  return a.x<b.x +b.width&&
        a.x+a.width >b.x &&
        a.y<b.y+b.height &&
        a.y +a.height>b.y;
}


function restart()
{

  bird.y=birdy;
  pipearray=[];
  score=0;
  scoreElement.innerHTML=0;
  gameover=false;
 
  document.getElementById("gameover-section").style.display = "none";
}
