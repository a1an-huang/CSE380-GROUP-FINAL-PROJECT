import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import FizzRun_Level from "../Scenes/FizzRun_Level";

/**
 * An animated sprite in the HW3Level. I have extended the animated sprite to create a more specific sprite
 * with a reference to a HW3Level. One of the things I want to try and show all of you is how to extend
 * Wolfie2d. 
 * 
 * For the HW3AnimatedSprite, I've just overriden the type of the scene and the associated getter/setter
 * methods. Without this, you would have to explicitly cast the type of the scene to a HW3Level to get access
 * to the methods associated with HW3Level. 
 * 
 * - Peter
 */
export default class FizzRun_AnimatedSprite extends AnimatedSprite {
    public currentSprite: string;
    protected scene: FizzRun_Level;
    
    public setScene(scene: FizzRun_Level): void { this.scene = scene; }
    public getScene(): FizzRun_Level { return this.scene; }

}