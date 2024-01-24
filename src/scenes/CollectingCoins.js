import Phaser from "phaser";

export default class CollectingCoinsScene extends Phaser.Scene
{
    constructor(){
        super('collecting-coins-scene')
    }

    init(){
        this.platform = undefined
        this.player = undefined
        this.coins = undefined
        this.cursor = undefined
        this.scoreText = undefined
        this.score = 0
        this.bomb = undefined
    }

    preload(){
        this.load.image('ground','images/ground/ground_compressed.jpg')
        this.load.spritesheet('coin','images/coins/coin_resize.png',
            {frameWidth:89,frameHeight:86}
        )
        this.load.image('lava', 'images/lava-background/lava_compressed.jpg')
        this.load.image('bomb', 'images/bomb/bomb_minimized.png')
        this.load.spritesheet('boy','images/flatboy/png/walk_minimize.png',
            {frameWidth:139,frameHeight:128}
        )
    }

    create(){
        this.add.image(400,300,'lava')

        //placing platform
        this.platform = this.physics.add.staticGroup()

        this.platform.create(500,450,'ground')
        this.platform.create(50, 200,'ground')
        this.platform.create(1000,200,'ground')

        //placing alas
        this.platform.create(400,750,'ground').setScale(2).refreshBody();

        //placing player
        this.player = this.physics.add.sprite(100,450,'boy')
        this.player.setCollideWorldBounds(true)
        this.physics.add.collider(this.player,this.platform)

        //placing coins
        this.coins = this.physics.add.group(
            {
                key:'coin',
                repeat:15,
                setXY: {x:50, y:0, stepX:70}
            }
        )

        this.physics.add.collider(this.coins,this.platform)

        this.coins.children.iterate(function(child){
            // @ts-ignore
            child.setBounceY(0.5);
        });

        //placing bomb
        // this.bomb = this.physics.add.group(
        //     {
        //         key:'bomb',
        //         repeat:5,
        //         setXY: {x:30, y:0, stepX:120}
        //     }
        // )

        // this.physics.add.collider(this.bomb,this.platform)

        //keyboard input
        this.cursor = this.input.keyboard.createCursorKeys()

        //animasi jalan ke kiri
        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers('boy',{start:3,end:0}),
            frameRate:10,
            repeat:-1
        });

        //animasi diam 
        this.anims.create({
            key:'turn',
            frames:[{key:'boy',frame:0}],
            frameRate:20
        });

        //animasi bergerak ke kanan
        this.anims.create({
            key:'right',
            frames:this.anims.generateFrameNumbers('boy',
            {start:0, end:14}),
            frameRate:10,
            repeat:-1
        });

        //Menyentuh koin
        this.physics.add.overlap(
            this.player,
            this.coins,
            this.collectCoin,
            null,
            this
        )

        //Menyentuh bomb
        // this.physics.add.overlap(
        //     this.player,
        //     this.bomb,
        //     this.gameOver,
        //     null,
        //     this
        // )

        //memberi skor
        this.scoreText = this.add.text(16,16,'Score: 0',{
            fontSize:'32px',color:'green'
        });
    }

    update(){
        //pergerakan
        if(this.cursor.left.isDown){
            this.player.setVelocity(-200,200)
            this.player.anims.play('left',true)
        }else if(this.cursor.right.isDown){
            this.player.setVelocity(200,200)
            this.player.anims.play('right',true)
        }else{
            this.player.setVelocity(0,0)
            this.player.anims.play('turn')
        }

        //melompat
        if(this.cursor.up.isDown){
            this.player.setVelocity(0,-200)
            this.player.anims.play('turn')
        }

        //menang
        if(this.score > 280){
            this.physics.pause()
            this.add.text(300,300,'YATTA YOU WIN!!!',{
                fontSize:'48px',
                color:'green'
            })
        }
    }

    collectCoin(player,coin){
        coin.destroy()

        this.score = this.score + 20;

        this.scoreText.setText('Score: '+this.score);
    }

    // gameOver(player,bomb){
    //     this.physics.pause()
    //     this.add.text(300,300,'You are dead',{
    //         fontSize:'48px',
    //         color:'red'
    //     })
    // }
}