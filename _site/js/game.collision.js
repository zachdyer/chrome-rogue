game.collision = {
  detect: function(entity, x, y) {
    var entityX = Math.floor(entity.x + x);
    var entityY = Math.floor(entity.y + y);
    if(game.map.layer[0][entityX][entityY].type === "floor"
    && game.map.layer[1][entityX][entityY].type != "chest") return false;
    return true;
  },
  isChest: function() {
    var is = function(x1, x2, y1, y2) {
      if(game.map.layer[1][Math.floor(game.player.x + x1)][Math.floor(game.player.y + y1)].type === "chest"
      || game.map.layer[1][Math.floor(game.player.x + x2)][Math.floor(game.player.y + y2)].type === "chest") return true;
      else false;
    }
    switch(game.player.facing) {
      case "left":
        if(is(-0.1,-0.1,0,1)) return true;
        break;
      case "up":
        if(is(0,1,-0.1,0)) return true;
        break;
      case "right":
        if(is(1.1,1.1,0,1)) return true;
        break;
      case "down":
        if(is(0,1,1.2,1.2)) return true;
        break;
      default:
        return false;
    }
  }
};
