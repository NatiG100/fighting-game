const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

var audio = new Audio('./sounds/background.mp3');
var enemyHitSound = new Audio('./sounds/enemyHit.mp3');
var playerHitSound = new Audio('./sounds/playerHit.mp3');
var enemyPainSound = new Audio('./sounds/enemyPain.wav');
var playerPainSound = new Audio('./sounds/playerPain.wav');
var swordMissSound = new Audio('./sounds/swordMiss.wav');

audio.volume = 0.4;

c.fillRect(0,0,canvas.width,canvas.height,);

const gravity = 0.7;

const background = new Sprite({
    position:{
        x:0,
        y:0,
    },
    imgSrc:"./img/background.png",
    
})
const shop = new Sprite({
    position:{
        x:600,
        y:137,
    },
    imgSrc:"./img/shop_anim.png",
    scale:2.75,
    framesMax:6,
})
const player = new Fighter({
    position:{
        x:0,
        y:0,
    },
    velocity:{
        x:0,
        y:3,
    },
    scale:2.5,

    imgSrc:"./img/mack/Sprites/Idle.png",
    framesMax:8,
    offset:{
        x:215,
        y:154,
    },
    sprites:{
        idle:{
            imageSrc:"./img/mack/Sprites/Idle.png",
            framesMax:8,
        },
        run:{
            imageSrc:"./img/mack/Sprites/Run.png",
            framesMax:8,
        },
        jump:{
            imageSrc:"./img/mack/Sprites/Jump.png",
            framesMax:2,
        },
        fall:{
            imageSrc:"./img/mack/Sprites/Fall.png",
            framesMax:2,
        },
        attack1:{
            imageSrc:"./img/mack/Sprites/Attack1.png",
            framesMax:6,
        },
        takeHit:{
            imageSrc:"./img/mack/Sprites/Take Hit - white silhouette.png",
            framesMax:4,
        },
        death:{
            imageSrc:"./img/mack/Sprites/Death.png",
            framesMax:6,
        },
        
    },
    attackBox:{
        offset:{
            x:95,
            y:50
        },
        width: 160,
        height: 50
    }
});


const enemy = new Fighter({
    attackBox:{
        offset:{
            x:240,
            y:50
        },
        width: 160,
        height: 50
    },
    flip:true,
    position:{
        x:-400,
        y:100,
    },
    velocity:{
        x:0,
        y:0,
    },
    offset:{
        x:-50,
        y:0,
    },
    color:'blue',
    scale:2.5,
    imgSrc:"./img/zack/Sprites/Idle.png",
    framesMax:4,
    offset:{
        x:215,
        y:168,
    },
    sprites:{
        idle:{
            imageSrc:"./img/zack/Sprites/Idle.png",
            framesMax:4,
        },
        run:{
            imageSrc:"./img/zack/Sprites/Run.png",
            framesMax:8,
        },
        jump:{
            imageSrc:"./img/zack/Sprites/Jump.png",
            framesMax:2,
        },
        fall:{
            imageSrc:"./img/zack/Sprites/Fall.png",
            framesMax:2,
        },
        attack1:{
            imageSrc:"./img/zack/Sprites/Attack1.png",
            framesMax:4,
        },
        takeHit:{
            imageSrc:"./img/zack/Sprites/Take hit.png",
            framesMax:3,
        },
        death:{
            imageSrc:"./img/zack/Sprites/Death.png",
            framesMax:7,
        },
    }
});

console.log(player);

const keys = {
    a:{
        pressed:false,
    },
    d:{
        pressed:false,
    },
    w:{
        pressed:false,
    },
    ArrowRight:{
        pressed:false,
    },
    ArrowLeft:{
        pressed:false,
    },
    ArrowUp:{
        pressed:false
    }
}
let lastKey


decreaseTimer();
function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;


    if(keys.a.pressed && player.lastKey==='a'){
        if(player.position.x>-10){
            player.velocity.x = -5;
        }
        player.switchSprite('run');
    }
    else if(keys.d.pressed && player.lastKey==='d'){
        if(player.position.x<=canvas.width-player.width-5){
            player.velocity.x = 5;
        }
        player.switchSprite('run');
    }else{
        player.switchSprite('idle');
    }

    if(player.velocity.y<0){
       player.switchSprite('jump')
    }else if(player.velocity.y>0){
       player.switchSprite('fall')
    }



    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
        if(enemy.position.x<=canvas.width-enemy.width-5-canvas.width){
            enemy.velocity.x = +5;
        }
        enemy.switchSprite('run');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
        if(enemy.position.x>-10-canvas.width){
            enemy.velocity.x = -5;
        }
        enemy.switchSprite('run');
    }else{
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y<0){
        enemy.switchSprite('jump')
     }else if(enemy.velocity.y>0){
        enemy.switchSprite('fall')
     }

    
    //detect for collision 
    if(
        rectangularCollision({
            rectangle1:player,
            rectangle2:enemy,
        })&&
        player.isAttacking&&player.currentFrame === 4
        &&!enemy.dead
    ){
        enemyHitSound.pause();
        enemyHitSound.currentTime = 0;
            enemy.takeHit();

            enemyPainSound.pause();
            enemyPainSound.currentTime = 0;
            enemyPainSound.play();

            enemyHitSound.play();
            player.isAttacking = false;
            gsap.to('#enemyHealth',{
                width:enemy.health +'%'
            })
    }else if(player.isAttacking&&player.currentFrame === 4){
        swordMissSound.pause();
        swordMissSound.currentTime = 0;
        swordMissSound.play();
    }

    //if player misses
    if(player.isAttacking&&player.currentFrame===4){
        player.isAttacking = false
    }
    if(
        rectangularCollision({
            rectangle1:enemy,
            rectangle2:player,
        })&&
        enemy.isAttacking&&enemy.currentFrame===2
        &&!player.dead
    ){
            player.takeHit();
            playerPainSound.pause();
            playerPainSound.currentTime = 0;
            playerPainSound.play();


            playerHitSound.pause();
            playerHitSound.currentTime = 0;
            playerHitSound.play();
            enemy.isAttacking = false;
            gsap.to('#playerHealth',{
                width:player.health +'%'
            })
    }else if(enemy.isAttacking&&enemy.currentFrame===2){
        swordMissSound.pause();
        swordMissSound.currentTime = 0;
        swordMissSound.play();
    }
    //if eney misses
    if(enemy.isAttacking&&enemy.currentFrame===2){
        enemy.isAttacking = false
    }

    //end the game based on health
    if(enemy.health<=0||player.health<=0){
        determineWinner({player,enemy,timerId});
    }
}

animate();

window.addEventListener('keydown',(event)=>{
    audio.play();
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed=true;
                player.lastKey = 'd';
                break;
            case 'a':
                    keys.a.pressed=true;
                    player.lastKey = 'a';
                break;
            case 'w':
                if(player.velocity.y===0){
                    player.velocity.y=-20;
                }
                break;
            case ' ':
                player.attack();
                break;
        }
    }
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed=true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed=true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if(enemy.velocity.y===0){
                    enemy.velocity.y=-20;
                }
                break;
            case 'ArrowDown':
                enemy.attack()
                break;
        }
    }
});

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})
