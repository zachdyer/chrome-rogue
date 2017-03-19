game.enemy = {
  enemies: [],
  init: function() {
    this.generate();
  },
  generate: function() {
    function Rat(x, y) {
      var dir = ["left","up","right","down"];
      this.x = x;
      this.y = y;
      this.cropX = null;
      this.cropY = null;
      this.startX = x;
      this.speed = 5;
      this.facing = dir[game.math.random(0,3)];
      this.directionPlayhead = Date.now();
      this.directionTimeline = game.math.random(1000, 2000);
      this.blood = null;
    }
    //Place rats
    for(var i = 0; i < game.map.rooms.length; i++) {
      var room = game.map.rooms[i];
      //2 out of 3 rooms get a filthy rat
      if(game.math.random(0, 100) > 25) {
        //This spawns a random rat in the room
        var x = game.math.random(room.x + 1, room.x + room.width);
        var y = game.math.random(room.y + 1, room.y + room.height);
        this.enemies.push(new Rat(x, y));
      }
    }
  },
  timeline: Date.now(),
  render: function() {
    var rat = game.assets.sprite.rat;
    var scale = game.map.tileSize * game.render.scale;

    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      var rat = (enemy.speed) ? game.assets.sprite.rat : game.assets.images[7];
      var drawX = Math.floor(scale * enemy.x - game.player.x * scale + window.innerWidth / 2 - game.map.tileSize / 2);
      var drawY = Math.floor(scale * enemy.y - game.player.y * scale + window.innerHeight / 2 - game.map.tileSize / 2);
      if(enemy.speed) {
        game.render.ctx.drawImage(
          game.assets.images[5],
          enemy.cropX,
          enemy.cropY,
          32, 32,
          drawX,
          drawY,
          scale,
          scale
        );
      } else {
        game.render.ctx.drawImage(
          rat,
          drawX,
          drawY,
          scale,
          scale
        );
        //Blood
        var blood = {
          x: null,
          y: null,
          width: 803,
          height: 1016,
          scale: 0.25
        };
        blood.width *= blood.scale * game.render.scale;
        blood.height *= blood.scale * game.render.scale;
        blood.x = drawX - blood.width / (1.25 * game.render.scale);
        blood.y = drawY - blood.height * 0.75;
        game.render.ctx.save();
        switch(enemy.blood) {
          case "left":
            blood.y += blood.width * 0.5;
            blood.x -= blood.width * 0.6;
            game.render.ctx.drawImage(
              game.assets.sprite.bloodLeft,
              blood.x, blood.y,
              blood.height, blood.width
            );
            break;
          case "up":
            game.render.ctx.drawImage(
              game.assets.sprite.bloodUp,
              blood.x, blood.y,
              blood.width, blood.height
            );
            break;
          case "right":
            blood.y += blood.width * 0.5;
            blood.x += blood.width * 0.4;
            game.render.ctx.drawImage(
              game.assets.sprite.bloodRight,
              blood.x, blood.y,
              blood.height, blood.width
            );
            break;
          case "down":
            blood.y += blood.height * 0.7;
            game.render.ctx.drawImage(
              game.assets.sprite.bloodDown,
              blood.x, blood.y,
              blood.width, blood.height
            );
            break;
        }
      }
    }
  },
  update: function() {
    //Loop over rats
    for(var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      var speed = game.movement.speedPerSecond(enemy.speed);
      var playhead = Date.now() - this.timeline;
      //Update sprite for animation
      if(playhead <= 100)
        enemy.cropX = 3 * 32;
      else if(playhead >= 100 && playhead <= 200)
        enemy.cropX = 4 * 32;
      else if(playhead >= 200 && playhead <= 300)
        enemy.cropX = 5 * 32;
      else if(playhead >= 300 && playhead <= 400)
        enemy.cropX = 4 * 32;
      else this.timeline = Date.now();
      //Move rat
      switch(enemy.facing) {
        case "left":
          enemy.cropY = 1 * 32;
          if(!game.collision.detect(enemy, -speed, 0.9))
            enemy.x -= speed;
          else
            enemy.facing = "right";
          break;
        case "up":
          enemy.cropY = 3 * 32;
          if(!game.collision.detect(enemy, 0.9, -speed))
            enemy.y -= speed;
          else
            enemy.facing = "down";
          break;
        case "right":
          enemy.cropY = 2 * 32;
          if(!game.collision.detect(enemy, speed + 1, 0.9))
            enemy.x += speed;
          else
            enemy.facing = "left";
          break;
        case "down":
          enemy.cropY = 0 * 32;
          if(!game.collision.detect(enemy, 0.9, speed + 1))
            enemy.y += speed;
          else
            enemy.facing = "up";
          break;
      }

      //Move toward player if within 8 blocks of player
      
      if ( game.misc.distance(enemy.x,enemy.y,game.player.x,game.player.y) < 8 && game.player.hp > 0 ){
            if(Math.floor(enemy.x) < Math.floor(game.player.x)) {
                enemy.facing = "right";
            } else if( Math.floor(enemy.x) > Math.floor(game.player.x)) {
                enemy.facing = "left";
            } else if(Math.floor(enemy.y) < Math.floor(game.player.y)) {
                enemy.facing = "down";
            } else if(Math.floor(enemy.y) > Math.floor(game.player.y)) {
                enemy.facing = "up";
            }

      }
      
      //Attack player
      if(enemy.x > game.player.x - 0.5 && enemy.x - 0.5 < game.player.x
      && enemy.y > game.player.y - 0.5 && enemy.y - 0.5 < game.player.y
      && enemy.speed && game.player.hp > 0
    ) {
        if(Date.now() - game.player.hit.playhead > game.player.hit.cooldown) {
          game.player.hit.playhead = Date.now();
          game.sound.effects.hit.play();
          game.render.ctx.fillStyle = "red";
          game.render.ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
          console.log("hit");
          game.player.hp--;
          if(game.player.hp <= 0) game.sound.effects.scream.play();
        }
      }
    }
  }
};
