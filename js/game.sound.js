game.sound = {
  effects: {
    step: null
  },
  timeline: Date.now(),
  init: function() {
    this.effects.step = game.assets.audio[3];
    this.effects.step.volume = 0.5;
    for(var prop in this.effects) {
      this.effects[prop].loop = false;
    }
  },
  //Creates sound snippets
  update: function() {
    //Foot step snippet
    if(game.assets.audio[2].currentTime > 1.25) {
      game.assets.audio[2].pause();
      game.assets.audio[2].load();
    }
    //Sprint
    if(game.player.speed === 8 && Date.now() - this.timeline > 200) {
      this.effects.step.load();
      this.effects.step.play();
      this.timeline = Date.now();
    }
  }
};