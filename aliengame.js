const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let lives = 3;
let gameOver = false;

let boss = null;
let bossHealth = 0;
let nextBossScore = 15;

let bossBullets = [];
let bossDirection = 1;

let keys = {};

let squinka = {
    x: 270,
    y: 350,
    width: 50,
    height: 50,
    speed: 7
};

let bullets = [];
let aliens = [];


// Controls
document.addEventListener("keydown", function(e){

    keys[e.key] = true;

    if(e.key === " " && !gameOver){

        bullets.push({
            x: squinka.x + 15,
            y: squinka.y,
            width:20,
            height:20,
            speed:10
        });

    }

});


document.addEventListener("keyup", function(e){
    keys[e.key] = false;
});




// Spawn aliens
function spawnAlien(){

    if(!boss){

        aliens.push({

            x: Math.random() * (canvas.width-40),
            y:-40,
            width:40,
            height:40,
            speed:2

        });

    }

}


setInterval(function(){

    if(!gameOver){
        spawnAlien();
    }

},900);





// Boss
function spawnBoss(){

    boss={

        x:220,
        y:40,
        width:160,
        height:100,
        speed:2

    };

    bossHealth=10;

}




// Boss shooting
setInterval(function(){

    if(boss && !gameOver){

        bossBullets.push({

            x: boss.x + 70,
            y: boss.y + 80,
            width:20,
            height:20,
            speed:5

        });

    }

},1200);






function loseLife(){

    lives--;

    if(lives<=0){

        gameOver=true;

    }

}





function saveScore(){

    if(score>highScore){

        highScore=score;

        localStorage.setItem(
            "highScore",
            highScore
        );

    }

}







function update(){

    if(gameOver) return;



    // Spawn boss
    if(score>=nextBossScore && boss===null){

        spawnBoss();

        nextBossScore+=15;

    }





    // Player movement
    if(keys["ArrowLeft"] && squinka.x>0){

        squinka.x-=squinka.speed;

    }


    if(keys["ArrowRight"] && squinka.x<canvas.width-squinka.width){

        squinka.x+=squinka.speed;

    }






    // Player bullets

    bullets.forEach((b,i)=>{

        b.y-=b.speed;

        if(b.y<0){

            bullets.splice(i,1);

        }

    });







    // Aliens

    aliens.forEach((alien,ai)=>{


        alien.y+=alien.speed;



        if(alien.y+alien.height>=canvas.height){

            aliens.splice(ai,1);

            loseLife();

        }





        if(

            alien.x<squinka.x+squinka.width &&
            alien.x+alien.width>squinka.x &&
            alien.y<squinka.y+squinka.height &&
            alien.y+alien.height>squinka.y

        ){

            aliens.splice(ai,1);

            loseLife();

        }






        bullets.forEach((bullet,bi)=>{


            if(

                bullet.x<alien.x+alien.width &&
                bullet.x+bullet.width>alien.x &&
                bullet.y<alien.y+alien.height &&
                bullet.y+bullet.height>alien.y

            ){

                aliens.splice(ai,1);

                bullets.splice(bi,1);

                score++;

                saveScore();

            }


        });


    });








    // Boss movement

    if(boss){

        boss.x += boss.speed * bossDirection;


        if(boss.x<=0 || boss.x+boss.width>=canvas.width){

            bossDirection *= -1;

        }







        // Player hits boss

        bullets.forEach((bullet,bi)=>{


            if(

                bullet.x<boss.x+boss.width &&
                bullet.x+bullet.width>boss.x &&
                bullet.y<boss.y+boss.height &&
                bullet.y+bullet.height>boss.y

            ){

                bullets.splice(bi,1);

                bossHealth--;


                if(bossHealth<=0){

                    boss=null;

                    score+=10;

                    saveScore();

                }

            }


        });


    }







    // Boss bullets

    bossBullets.forEach((bullet,i)=>{


        bullet.y+=bullet.speed;



        if(bullet.y>canvas.height){

            bossBullets.splice(i,1);

        }






        // Hit Squinka

        if(

            bullet.x<squinka.x+squinka.width &&
            bullet.x+bullet.width>squinka.x &&
            bullet.y<squinka.y+squinka.height &&
            bullet.y+bullet.height>squinka.y

        ){

            bossBullets.splice(i,1);

            loseLife();

        }



    });







    document.getElementById("score").innerHTML =

    "Score: "+score+
    " | High Score: "+highScore+
    " | Lives: "+"❤️".repeat(lives)+
    (boss ? " | Boss HP: "+bossHealth:"");

}







function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);



    // Squinka

    ctx.font="50px Arial";

    ctx.fillText(
        "🐱",
        squinka.x,
        squinka.y+45
    );





    // Player fireballs

    ctx.font="25px Arial";

    bullets.forEach(b=>{

        ctx.fillText(
            "🔥",
            b.x,
            b.y
        );

    });






    // Aliens

    ctx.font="45px Arial";

    aliens.forEach(a=>{

        ctx.fillText(
            "👽",
            a.x,
            a.y+40
        );

    });






    // Boss

    if(boss){

        ctx.font="90px Arial";

        ctx.fillText(
            "👹",
            boss.x,
            boss.y+80
        );

    }






    // Boss attacks

    bossBullets.forEach(b=>{

        ctx.font="30px Arial";

        ctx.fillText(
            "💥",
            b.x,
            b.y
        );

    });






    if(gameOver){

        ctx.fillStyle="white";

        ctx.font="50px Arial";

        ctx.fillText(
            "GAME OVER",
            130,
            200
        );

    }


}






function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}



gameLoop();