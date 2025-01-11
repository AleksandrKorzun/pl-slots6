import Spin from "./Spin";
import { EVENTS, POSITIONS, SCALES, SPIN_ITEMS } from "./constants/Constants";

export default class Machine extends Phaser.GameObjects.Container {
  constructor(scene, options) {
    super(scene, 0, 0);
    this.tweens = scene.tweens;
    this.options = options;
    this.stopSpins = false;
    this.addMachine();
    this.addStyles();
    // this.addWin();
    this.addSpin({
      name: "left",
      slots: SPIN_ITEMS,
      highPosition: options.highPosition,
      winPos: options.winPos,
      distanceBetween: options.distanceBetween,
      ...options.positionSpin[0],
    });
    this.addSpin({
      name: "center",
      slots: SPIN_ITEMS,
      highPosition: options.highPosition,
      winPos: 100,
      distanceBetween: 100,
      ...options.positionSpin[1],
    });
    this.addSpin({
      name: "right",
      slots: options.slots,
      highPosition: options.highPosition,
      winPos: options.winPos,
      distanceBetween: options.distanceBetween,
      ...options.positionSpin[2],
    });
    this.initListeners();
    // this.addInteractive();
  }

  initListeners() {
    this.scene.emitter.on(EVENTS.ON_MACHINE_CLICK, () => this.start(), this);
    this.scene.emitter.on(
      EVENTS.ON_STOP_CLICK,
      () => this.addStopClick(),
      this
    );
    // this.emitter.on(EVENTS.ON_DESELECT_CLICK, this.onDeselectClick, this);
  }

  addStyles() {
    this.addProperties(["pos", "scale"])
      .setCustomPosition(...POSITIONS.machine)
      .setCustomScale(...SCALES.machine)
      .setCustomAlign("Center")
      .setDepth(7)
      .setAlpha(1);
  }

  addStopClick() {
    this.stopSpins = true;
    this.stop();
  }

  addHand() {
    this.hand = this.scene.add
      .image(this.stopBtn.x + 70, this.stopBtn.y + 70, "atlas", "hand")
      .setScale(0.74)
      .setDepth(190);
    this.circle1 = this.scene.add
      .image(this.stopBtn.x + 10, this.stopBtn.y + 10, "atlas", "white_circle")
      .setScale(0.5)
      .setAlpha(0)
      .setDepth(170);
    this.circle2 = this.scene.add
      .image(this.stopBtn.x + 10, this.stopBtn.y + 10, "atlas", "white_circle")
      .setScale(1)
      .setAlpha(0)
      .setDepth(170);

    this.circleAnim = this.scene.tweens.add({
      targets: this.circle1,
      // scale: "*=1.4",
      alpha: 0,
      duration: 500,
      hold: 1000,
      // yoyo: true,
      repeat: -1,
      onStart: () => {
        this.circle1.setAlpha(1);
      },
    });
    this.circleAnimScale = this.scene.tweens.add({
      targets: this.circle1,
      scale: "*=1.4",
      duration: 500,
      repeatDelay: 1000,
      repeat: -1,
    });
    this.circleAnim2 = this.scene.tweens.add({
      targets: this.circle2,
      alpha: 0,
      duration: 500,
      hold: 1000,
      delay: 300,
      repeat: -1,
      onStart: () => {
        this.circle2.setAlpha(1);
      },
    });
    this.circleAnimScale2 = this.scene.tweens.add({
      targets: this.circle2,
      scale: "*=1.4",
      duration: 500,
      repeatDelay: 1000,
      delay: 300,
      repeat: -1,
    });
    this.handleAnim = this.scene.tweens.add({
      targets: this.hand,
      x: "-=5",
      y: "-=5",
      // angle: "+=5",
      scale: "/=1.1",
      duration: 200,
      // hold: 200,
      repeatDelay: 1000,
      yoyo: true,
      repeat: -1,
    });

    this.add([this.hand, this.circle1, this.circle2]);
    this._sort();
  }

  addSpin(options) {
    this[options.name] = new Spin(this.scene, options)
      .setPosition(options.x, options.y)
      .setScale(0.7)
      .setDepth(10);
    this.add([this[options.name]]);
    this._sort();
  }

  addMachine() {
    this.machine = this.scene.add
      .image(0, 0, "slot")
      .setScale(0.74)
      .setDepth(14);
    this.machineMiddle = this.scene.add
      .image(-8, 73, "slot_spin")
      .setScale(0.74)
      .setDepth(4);
    this.add([this.machine, this.machineMiddle]);
    this._sort();
  }

  start() {
    this.btnAnim = this.scene.tweens.add({
      targets: this.btn_press,
      alpha: 1,
      duration: 200,
      yoyo: true,
    });
    this.scene.step += 1;
    this.left.status = "start";
    this.center.status = "start";
    this.right.status = "start";
    this.left.spinDuration = 50;
    this.left.move();
    setTimeout(() => {
      this.center.spinDuration = 50;
      this.center.move();
    }, 50);
    setTimeout(() => {
      this.right.spinDuration = 50;
      this.right.move();
    }, 100);
  }

  stop() {
    this.left.stop();
    setTimeout(() => {
      this.center.stop();
    }, 500);
    setTimeout(() => {
      this.right.stop();
    }, 800);
  }

  removeHand() {
    this.circleAnim?.remove();
    this.circleAnim2?.remove();
    this.circleAnimScale?.remove();
    this.circleAnimScale2?.remove();
    this.circle1?.destroy();
    this.circle2?.destroy();
    this.handleAnim?.remove();
    this.hand?.destroy();
  }
}
