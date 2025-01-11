import Buttons from "./Buttons";
import CoinBox from "./CoinBox";
import { POSITIONS, SCALES } from "./constants/Constants";

export class Header extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);

    this.initAssets();
    this.addLogo();
    this.addCoinBox();
    this.addCta("cta");
    this.addInteractive();
    this.onResize();
    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.isPortrait = this.scene.game.size;
    if (!this.scene.game.size.isPortrait) {
      this.logo.setPosition(180, 130);
      this.coinBox.setPosition(-500, 130);
      this.cta2.setPosition(-100, 130);
      this.cta.setPosition(500, 130);
      this.bg.setPosition(0, -50);
    } else {
      this.logo.setPosition(0, 130);
      this.coinBox.setPosition(-140, 450);
      this.cta2.setPosition(240, 460);
      this.cta.setPosition(0, 300);
      this.bg.setPosition(0, 250);
    }
  }
  initAssets() {
    this.addProperties(["pos", "scale"])
      .setCustomPosition(...POSITIONS.top)
      .setCustomAlign("Top")
      .setCustomScale(...SCALES.top)
      .setDepth(50);
  }

  addInteractive() {
    this.logo.setInteractive().on("pointerdown", () => this.scene.openStore());
    this.cta.setInteractive().on("pointerdown", () => this.scene.openStore());
    this.cta2.setInteractive().on("pointerdown", () => this.scene.openStore());
  }
  addLogo() {
    this.bg = this.scene.add.image(0, 250, "top").setScale(20, 1.6).setDepth(5);
    this.logo = this.scene.add
      .image(0, 130, "atlas", "logo")
      .setDepth(100)
      .setScale(1);

    this.logoAnim = this.scene.tweens.add({
      targets: this.logo,
      scale: "*=1.1",
      duration: 500,
      repeat: -1,
      yoyo: true,
    });
    this.add([this.logo, this.bg]);
    this._sort();
  }
  addCoinBox(count) {
    this.coinBox = new CoinBox(this.scene, count)
      .setScale(0.7)
      .setAlpha(1)
      .setPosition(-140, 450)
      .setDepth(300);
    this.add([this.coinBox]);
    this._sort();
  }
  addCta(img, options = { lx: 0, ly: 0, px: 0, py: 0 }) {
    this.cta = this.scene.add
      .image(0, 300, "atlas", img)
      .setScale(0.8)
      .setDepth(200);
    this.cta2 = this.scene.add
      .image(240, 460, "atlas", "get_coins")
      .setScale(1.4)
      .setDepth(200);
    this.add([this.cta, this.cta2]);
    this._sort();
  }
}
