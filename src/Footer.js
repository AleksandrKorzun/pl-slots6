import { BET, EVENTS, POSITIONS, SCALES } from "./constants/Constants";

export class Footer extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    this.initAssets();
    this.text_bet = 3;
    this.addButtons();
    this.addInteractive();

    this.addInteractiveSpin();
    this.onResize();
    window.addEventListener("resize", () => this.onResize());
  }
  initAssets() {
    this.addProperties(["pos", "scale"])
      .setCustomPosition(...POSITIONS.bottom)
      .setCustomAlign("Bottom")
      .setCustomScale(...SCALES.bottom)
      .setDepth(50);
  }

  onResize() {
    this.isPortrait = this.scene.game.size;
    if (!this.scene.game.size.isPortrait) {
      this.bg.setPosition(0, 300);
      this.minus.setPosition(-450, 150);
      this.total.setPosition(-280, 150);
      this.totalText.setPosition(-280, 130);
      this.plus.setPosition(-110, 150);
      this.max.setPosition(50, 150);
      this.spin.setPosition(370, 150);
    } else {
      this.bg.setPosition(0, 50);
      this.minus.setPosition(-220, 0);
      this.total.setPosition(-70, 0);
      this.totalText.setPosition(-70, -20);
      this.plus.setPosition(80, 0);
      this.max.setPosition(220, 0);
      this.spin.setPosition(0, 150);
    }
  }
  increment() {
    // const countCoinsBet = Object.values(BET[this.text_bet]);
    // this.scene.countCoinsBet = countCoinsBet;
    // console.log("this.scene.totalCoins", this.scene.totalCoins);
    // console.log("countCoinsBet[0]", countCoinsBet[0]);
    // console.log("first", this.text_bet);
    if (
      this.text_bet <= 4 &&
      BET[this.text_bet + 1] &&
      this.scene.totalCoins > Object.values(BET[this.text_bet + 1])
    ) {
      this.text_bet++;
      const countCoinsBet = Object.values(BET[this.text_bet]);
      this.scene.countCoinsBet = countCoinsBet;
      this.totalText.setText(Object.keys(BET[this.text_bet]));
    } else {
      this.text_bet = 4;
      this.scene.countCoinsBet = this.scene.totalCoins;
      console.log("this.scene.countCoinsBet", this.scene.countCoinsBet);
      const max =
        this.scene.totalCoins / 1000000 >= 1
          ? `${this.scene.totalCoins / 1000000}M`
          : `${this.scene.totalCoins / 1000}K`;
      this.totalText.setText(`${max}`);
    }
  }
  decrement() {
    // const countCoinsBet = Object.values(BET[this.text_bet]);
    // this.scene.countCoinsBet = countCoinsBet;
    if (this.text_bet > 0) {
      this.text_bet--;
      const countCoinsBet = Object.values(BET[this.text_bet]);
      this.scene.countCoinsBet = countCoinsBet;
      this.totalText.setText(Object.keys(BET[this.text_bet]));
    }
  }

  maxBet() {
    const maxCoinsBet = Object.values(BET[6]);
    this.text_bet = 6;
    if (this.scene.totalCoins >= maxCoinsBet[0]) {
      this.totalText.setText(Object.keys(BET[this.text_bet]));
      this.scene.countCoinsBet = this.scene.totalCoins;
    } else {
      this.scene.countCoinsBet = this.scene.totalCoins;
      const max =
        this.scene.totalCoins / 1000000 >= 1
          ? `${this.scene.totalCoins / 1000000}M`
          : `${this.scene.totalCoins / 1000}K`;
      this.totalText.setText(`${max}`);
    }
  }
  onSpin() {
    this.disableInteractive();
    this.scene.emitter.emit(EVENTS.ON_MACHINE_CLICK, this.scene);
    setTimeout(() => {
      this.scene.emitter.emit(EVENTS.ON_STOP_CLICK, this.scene);
    }, 3000);
    setTimeout(() => {
      const isLastSpin =
        this.scene.header.coinBox.countCoin / 2 < this.scene.countCoinsBet ||
        !this.scene.totalCoins;
      if (!isLastSpin && this.scene.step !== 3) {
        this.scene.addNextRound();
      }
    }, 4500);
    setTimeout(() => {
      const isLastSpin =
        this.scene.header.coinBox.countCoin / 2 < this.scene.countCoinsBet ||
        !this.scene.totalCoins;
      if (!isLastSpin && this.scene.step !== 3) {
        this.addInteractiveSpin();
        this.enableInteractive();
      } else {
        this.scene.emitter.emit("final", this.scene);
      }
    }, 5000);
  }
  addInteractive() {
    this.plus.setInteractive().on("pointerdown", () => this.increment());
    this.minus.setInteractive().on("pointerdown", () => this.decrement());
    this.max.setInteractive().on("pointerdown", () => this.maxBet());
  }
  disableInteractive() {
    this.plus.disableInteractive();
    this.minus.disableInteractive();
    this.max.disableInteractive();
  }
  enableInteractive() {
    this.plus.setInteractive();
    this.minus.setInteractive();
    this.max.setInteractive();
  }
  addInteractiveSpin() {
    this.spin.setInteractive().once("pointerdown", () => this.onSpin());
  }
  addButtons() {
    const countCoinsBet = Object.keys(BET[this.text_bet]);
    this.bg = this.scene.add
      .image(0, 50, "bottom")
      .setDepth(5)
      .setScale(5, 1.2);
    this.minus = this.scene.add.image(-220, 0, "atlas", "minus").setDepth(6);
    this.total = this.scene.add.image(-70, 0, "atlas", "total").setDepth(6);
    this.totalText = this.scene.add
      .text(-70, -20, countCoinsBet, {
        font: `bold 40px BerlinSansFBDemiBold`,
        fill: "#ffffff",
        shadow: {
          offsetX: 5,
          offsetY: 5,
          color: "#000",
          blur: 10,
          stroke: true,
          fill: true,
        },
        letterSpacing: 10,
        stroke: "#000",
        strokeThickness: 10,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(6);
    this.plus = this.scene.add.image(80, 0, "atlas", "plus").setDepth(6);
    this.max = this.scene.add.image(220, 0, "atlas", "max_bet").setDepth(6);
    this.spin = this.scene.add
      .image(0, 150, "atlas", "spin")
      .setScale(1.2)
      .setDepth(6);
    this.add([
      this.minus,
      this.total,
      this.plus,
      this.max,
      this.spin,
      this.totalText,
      this.bg,
    ]);
    this._sort();
  }
}
