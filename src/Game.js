import ParentScene from "@holywater-tech/ads-builder/framework/components/Scene";
import Background from "@holywater-tech/ads-builder/framework/components/ui/Background";
import { EVENTS, SLOT1 } from "./constants/Constants";
import Machine from "./Machine";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Win } from "./Win";

export default class Game extends ParentScene {
  create() {
    this.totalCoins = 10000000;
    this.addBackground("bg");
    this.addBackground("bg", { depth: 100 });
    this.addHeader();
    this.addFooter();
    this.addMachine(SLOT1);
    this.addText();
    this.step = 0;
    this.countCoinsBet = 2500000;
    this.initListeners();
    // this.addWin();
  }

  initListeners() {
    this.emitter.on("final", () => this.final(), this);
  }

  final() {
    this.addWin();
  }
  addText() {
    this.tap = this.add
      .image(0, 0, "atlas", "tap_title")
      .addProperties(["pos"])
      .setCustomPosition(0, 150, 0, 100)
      .setDepth(100);
    this.textMain = this.add
      .image(0, 0, "text1")
      .addProperties(["pos", "scale"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomScale(0.6, 0.6, 0.45, 0.45)
      .setDepth(100);
    this.textAnim = this.tweens.add({
      targets: this.tap,
      alpha: 0.2,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });
    this.mainContainer.add([this.tap, this.textMain]);
    this.sort();
  }

  firstClick() {
    this.textAnim.remove();
    this.tap.destroy();
    this.textMain.destroy();
    this.bg.destroy();
  }
  addBackground(bg, options = {}) {
    this[bg] = new Background(this, bg, true, [1.7, 1.7, 1.1, 1.1])
      .setDepth(options.depth || 4)
      .setAlpha(1);

    if (!options.disable) {
      this[bg].setInteractive().once("pointerdown", () => this.firstClick());
    }
    this.bg3 = this.add
      .image(0, 0, "bg2")
      .addProperties(["pos", "scale"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomScale(2.1, 2.1, 1, 1)
      .setCustomAlign("Center")
      .setDepth(5)
      .setAlpha(1);
    this.mainContainer.add([this[bg], this.bg3]);
    this.sort();
  }

  addCoins() {
    // this.scene.crySound = Utils.addAudio(this.scene, "cry", 0.5, true);

    this.partc = this.add
      .particles("atlas", "coin1")
      .addProperties(["pos"])
      .setCustomPosition(0, 0, 0, 0)
      .setDepth(155)
      .setCustomAlign("Center");

    const emitter = this.partc.createEmitter({
      frame: [
        "coin1",
        "coin2",
        "coin3",
        // "coin4",
        // "coin5",
        // "coin6",
        // "coin7",
        // "coin8",
        // "coin9",
        // "coin10",
      ],
      x: { min: -350, max: 350 },
      y: { min: -1350, max: 50 },
      speedY: { min: 400, max: 500 },
      lifespan: 1400,
      scale: { start: 1, end: 1 },
      // alpha: { start: 1, end: 0 },
      frequency: 50,
      quantity: 2,
      blendMode: "ADD",
      // on: false,
    });
    this.mainContainer.add([this.partc]);
    this.sort;
    this.addBigWin();

    this.coinBox.changeCount(5);
    const stopEmitter = () => {
      emitter.stop();
      this.time.delayedCall(1400, () => this.partc.destroy());
    };
    this.time.delayedCall(2000, stopEmitter, [], this);
  }

  addBigWin() {
    this.big_win = this.add
      .image(0, 0, "atlas", "big_win")
      .addProperties(["pos"])
      .setCustomPosition(0, 0, 0, 0)
      .setCustomAlign("Center")
      .setDepth(300)
      .setAlpha(0);

    this.tweens.add({
      targets: this.big_win,
      alpha: 1,
      duration: 200,
      hold: 2300,
      yoyo: true,
    });
    setTimeout(() => this.emitter.emit(EVENTS.NEXT_SCENE), 4000);
  }

  addMachine(options) {
    this.machine = new Machine(this, options);
    this.mainContainer.add([this.machine]);
    this.sort();
  }
  addNextRound() {
    this.text2 = this.add
      .image(0, 0, "text2")
      .addProperties(["pos"])
      .setCustomPosition(2000, 0, 2000, 0)
      .setCustomAlign("Center")
      .setCustomScale(0.5, 0.5, 0.5, 0.5)
      .setDepth(100);
    this.text3 = this.add
      .image(0, 0, "text3")
      .addProperties(["pos"])
      .setCustomPosition(2000, 0, 2000, 0)
      .setCustomAlign("Center")
      .setCustomScale(0.5, 0.5, 0.5, 0.5)
      .setDepth(100);
    this.tweens.add({
      targets: this.text2,
      px: 0,
      lx: 0,
      duration: 500,
      hold: 1000,
    });
    this.tweens.add({
      targets: this.text2,
      px: -2000,
      lx: -2000,
      duration: 500,
      hold: 1000,
      delay: 1500,
    });
    this.tweens.add({
      targets: this.text3,
      px: 0,
      lx: 0,
      duration: 500,
      hold: 1000,
      delay: 2000,
    });
    this.tweens.add({
      targets: this.text3,
      px: -2000,
      lx: -2000,
      duration: 500,
      hold: 1000,
      delay: 3500,
      onComplete: () => {
        this.text2.destroy();
        this.text3.destroy();
      },
    });
    this.mainContainer.add([this.text2, this.text3]);
    this.sort();
  }
  addWin(options) {
    this.addBackground("bg2", { depth: 450, disable: true });
    this.game.network.addClickToStore(this.bg2);
    this.win = new Win(this).setDepth(500);
    this.mainContainer.add([this.win]);
    this.sort();
  }
  addHeader() {
    this.header = new Header(this);
    this.mainContainer.add([this.header]);
    this.sort();
  }

  addFooter() {
    this.footer = new Footer(this);
    this.mainContainer.add([this.footer]);
    this.sort();
  }

  openStore() {
    this.game.network.openStore();
  }
}
