// import { sceneOption } from "./constants/Constants";

export default class Spin extends Phaser.GameObjects.Container {
  constructor(scene, options) {
    super(scene, 0, 0);
    this.options = options;
    this.addSpin(options.slots, options.distanceBetween);

    this.spinDuration = 1000;
    this.status = "stop";
  }

  addSpin(option, distanceBetweenItems = 125) {
    // console.log("first", this.options);

    this.items = [];
    option.slice(0, 5).map(({ name }, index) => {
      // console.log("name", name);
      this[name] = this.scene.add
        .image(
          0,
          this.options.highPosition + index * distanceBetweenItems,
          "atlas",
          option[(Math.random() * 11) | 0].name
        )
        .setAlpha(1)
        .setScale(0.8)
        .setDepth(200);
      this.items.push(this[name]);
      this.add([this[name]]);
      this._sort();
    });
  }

  addWin() {
    this.win = this.scene.add
      .image(
        0,
        this.options.highPosition +
          this.options.winPos -
          1 * this.options.distanceBetween,
        "atlas",
        "border_y"
      )
      .setAlpha(0)
      .setScale(1)
      .setDepth(150);
    this.add([this.win]);
    this._sort();
  }
  move(once) {
    const isLastSpin =
      this.scene.header.coinBox.countCoin / 2 < this.scene.countCoinsBet ||
      !this.scene.totalCoins;
    this.items.map((item, index) => {
      this.scene.tweens.add({
        targets: item,
        y: item.y + this.options.distanceBetween,
        duration: this.spinDuration,
        ease: "Ease.bounce",
        onComplete: () => {
          this.spinDuration = 50;
          if (
            index !== 4 ||
            (this.status === "stop" &&
              this.items[isLastSpin ? 1 : 2].frame.name === "slot3_7" &&
              this.scene.step === 1)
          ) {
            return;
          }
          if (
            index !== 4 ||
            (this.status === "stop" &&
              this.items[isLastSpin ? 1 : 2].frame.name === "slot3_7" &&
              this.scene.step === 2)
          ) {
            return;
          }
          if (
            index !== 4 ||
            (this.status === "stop" &&
              this.scene.step === 3 &&
              this.items[1].frame.name === "slot3_7")
          ) {
            return;
          }
          if (
            index !== 4 ||
            (this.status === "stop" && this.scene.step === 1)
          ) {
            this.items[4].y = this.options.highPosition;
            this.items[4].setTexture("atlas", this.options.slots[12].name);
            const lastItem = this.items.pop();
            this.items.unshift(lastItem);
            this.move();
            return;
          }
          this.items[4].y = this.options.highPosition;
          this.items[4].setTexture(
            "atlas",
            this.options.slots[(Math.random() * 11) | 0].name
          );
          const lastItem = this.items.pop();
          this.items.unshift(lastItem);
          this.move();
        },
      });
    });
  }

  stop() {
    const isLastSpin =
      this.scene.header.coinBox.countCoin / 2 < this.scene.countCoinsBet;
    this.spinDuration = 300;
    this.status = "stop";
    if (this.scene.step === 1) {
      this.items[0].setTexture("atlas", this.options.slots[10].name);
    }
    if (this.scene.step === 2) {
      this.items[0].setTexture("atlas", this.options.slots[10].name);
    }
    if (this.scene.step === 3) {
      this.items[0].setTexture("atlas", this.options.slots[10].name);
    }
  }

  addAnimationFire(item) {
    this.items.slice(1, 4).map((item, idx) => {
      const particles = this.scene.add.particles("fire2").setDepth(200);
      const emitZone = {
        type: "edge",
        source: item
          .getBounds()
          .setSize(200, 135)
          .setPosition(item.getBounds().x - 33, item.getBounds().y),
        quantity: 52,
        total: 20,
      };
      this[`emitter${idx}`] = particles.createEmitter({
        speed: 20,
        lifespan: 300,
        quantity: 2,
        scale: { start: 0.15, end: 0 },
        emitZone: emitZone,
        alpha: { start: 1, end: 0 },
        tint: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        duration: 2000,
      });
      this.add([particles]);
      this._sort();
      this[`emitter${idx}`].stop();
    });
  }
  starsExplosion(item, idx) {
    const particles = this.scene.add.particles("fire2").setDepth(200);
    const emitZone = {
      type: "edge",
      source: item
        .getBounds()
        .setSize(200, 135)
        .setPosition(item.getBounds().x - 33, item.getBounds().y),
      quantity: 42,
      total: 1,
    };
    const emitter = particles.createEmitter({
      speed: 1,
      lifespan: 900,
      quantity: 42,
      scale: { start: 0.2, end: 0 },
      emitZone: emitZone,
      alpha: { start: 1, end: 0 },
      tint: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
    });
    particles.setDepth(200);
    this.add([particles]);
    this._sort();
    emitter.start();
  }
}
