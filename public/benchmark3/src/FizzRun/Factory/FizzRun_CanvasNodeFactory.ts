import CanvasNodeFactory from "../../Wolfie2D/Scene/Factories/CanvasNodeFactory";
import FizzRun_AnimatedSprite from "../Nodes/FizzRun_AnimatedSprite";
import FizzRun_Level from "../Scenes/FizzRun_Level";

/**
 * An extension of Wolfie2ds CanvasNodeFactory. The purpose of the class is to add functionality for adding custom
 * game nodes to HW3Levels. 
 */
export default class FizzRun_CanvasNodeFactory extends CanvasNodeFactory {

    // Reference to the HW4Level
    protected scene: FizzRun_Level;
    
    // Overriden to only accept HW4Levels
    public init(scene: FizzRun_Level): void { super.init(scene); }

    // Overriden to return HW3AnimatedSprites instead of regular AnimatedSprites
    public addAnimatedSprite = (key: string, layerName: string): FizzRun_AnimatedSprite => {
        let layer = this.scene.getLayer(layerName);
		let spritesheet = this.resourceManager.getSpritesheet(key);
		let instance = new FizzRun_AnimatedSprite(spritesheet);

		// Add instance fo scene
		instance.setScene(this.scene);
		instance.id = this.scene.generateId();
		
		if(!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))){
			this.scene.getSceneGraph().addNode(instance);
		}

		// Add instance to layer
		layer.addNode(instance);

		return instance;
    }
}