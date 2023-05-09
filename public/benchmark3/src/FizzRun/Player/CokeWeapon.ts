import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { FizzRunResourceKeys } from "../Scenes/FizzRun_Level";
import InkSackBehavior from "../Items/InkSackBehavior";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { FizzRun_Events } from "../FizzRun_Events";

export default class CokeWeapon {

  public name: string = "CokeWeapon";

  protected theInkSack: Sprite;
  protected emitter: Emitter;

  constructor() {
    this.emitter = new Emitter();
  }

  initializeInkSack(scene: Scene, layer: string) {
    this.theInkSack = scene.add.sprite(FizzRunResourceKeys.COKE_ABILITY, layer);
    this.theInkSack.addAI(InkSackBehavior);
  }
  
  startSystem(startPoint: Vec2) {
    this.emitter.fireEvent(FizzRun_Events.ACTIVATE_INKSACK, {position: startPoint});
  }
}