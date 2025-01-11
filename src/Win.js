export class Win extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    this.initAssets();
    this.addWin();
    this.addCoins();
  }
  initAssets() {
    this.addProperties(["pos", "scale"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setCustomScale(1, 1, 1, 1)
      .setDepth(50);
  }
  addWin() {
    // console.log("this.", this.scene.countCoinsBet);
    this.win = this.scene.add
      .image(0, 0, "bigwin")
      .setAlpha(1)
      .setScale(0.4)
      .setDepth(150);
    this.light = this.scene.add
      .image(0, 0, "atlas", "light")
      .setScale(0.8)
      .setAlpha(0.8)
      .setDepth(140);
    this.get_it = this.scene.add
      .image(0, 200, "atlas", "get_It")
      .setScale(0.8)
      .setDepth(190);
    this.coinText = this.scene.add
      .text(0, 100, 0, {
        font: `bold 54px BerlinSansFBDemiBold`,
        fill: "#FDC904",
        letterSpacing: 30,
        stroke: "#8B1601",
        strokeThickness: 15,
      })
      .setDepth(160)
      .setAlpha(1)
      .setOrigin(0.5, 0.5);
    this.scene.tweens.add({
      targets: this.light,
      angle: 360,
      duration: 3000,
      repeat: -1,
    });
    this.add([this.win, this.light, this.coinText, this.get_it]);
    this._sort();
    this.changeCount();
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  changeCount(x, duration = 1000) {
    // this;
    this.animationSecond = this.scene.tweens.addCounter({
      onStart: () => this.setAlpha(1),
      onComplete: () => {
        // this.changeSpeedCoin(50);
        // this.countCoin -= this.scene.countCoinsBet;
        // this.scene.totalCoins -= this.scene.countCoinsBet;
      },
      from: 0,
      to:
        typeof this.scene.countCoinsBet === "number"
          ? this.scene.countCoinsBet
          : this.scene.countCoinsBet[0],
      duration,
      onUpdate: (tween) => {
        this.coinText.text = this.numberWithCommas(
          Math.floor(tween.getValue())
        );
        // if (tween.getValue() > 90000000) {
        //   this.coinText.setFontSize(58);
        // }
        // if (tween.getValue() > 9000000000) {
        //   this.coinText.setFontSize(46);
        //   this.coinText.setOrigin(0.4, 0.5);
        // }
      },
    });
  }
  addCoins() {
    this.partc = this.scene.add.particles("atlas", "coin1");

    const emitter = this.partc.createEmitter({
      frame: ["coins1", "coins2", "coins3", "coins4"],
      x: 0,
      y: 0,
      angle: { start: 0, end: 360 },
      speedY: { min: -400, max: 500 },
      speedX: { min: -400, max: 500 },
      lifespan: 2400,
      scale: { start: 0.4, end: 0.5 },
      frequency: 100,
      quantity: 2,
      // blendMode: "ADD",
      // on: false,
    });
    this.add([this.partc]);
    this._sort();
    // this.addBigWin();

    const stopEmitter = () => {
      emitter.stop();
      this.time.delayedCall(1400, () => this.partc.destroy());
    };
    // this.time.delayedCall(2000, stopEmitter, [], this);
  }
}
