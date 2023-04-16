import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { FizzRunResourceKeys } from "../Scenes/FizzRun_Level";

export default class CokeWeapon {

  protected theInkSack: AnimatedSprite;

  constructor() {
    // for (let i = 0; i < this.mentosPool.length; i++){
		// 	theInkSack = this.add.animatedSprite(FizzRunResourceKeys.MENTOS, FizzRun_Layers.PRIMARY);

		// 	// Mentos visible from the start
		// 	this.mentosPool[i].visible = true;
    //         this.mentosPool[i].position.copy(this.mentosSpawn[i]);

		// 	// Assign them mentos ai
		// 	this.mentosPool[i].addAI(MentosBehavior);

		// 	this.mentosPool[i].scale.set(0.3, 0.3);

		// 	//Use boundary instead of zoom to not have big hitbox
		// 	let collider = this.mentosPool[i].boundary; 
    //         console.log(collider);
		// 	this.mentosPool[i].setCollisionShape(collider);
		// }
  }

  initializeInkSack(scene: Scene, layer: string) {
    // this.theInkSack = scene.add.animatedSprite(FizzRunResourceKeys.COKE_ABILITY, layer);
    // this.theInkSack.visible = false;
    // //this.bubbles[i].addAI(BubbleAI);
    // let collider = this.theInkSack.boundary;
    // this.theInkSack.setCollisionShape(collider);
  }
  
  startSystem(startPoint: Vec2) {
    console.log("CokeWeapon startSystem");
  }
}