import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import FizzRun_AnimatedSprite from "../../Nodes/FizzRun_AnimatedSprite";
import PlayerController from "../PlayerController";
import { FizzRun_Events } from "../../FizzRun_Events";

let SHARED_playerController: PlayerController;
export { SHARED_playerController };

/**
 * An abstract state for the PlayerController 
 */
export default abstract class PlayerState extends State {

    public parent: PlayerController;
	protected owner: FizzRun_AnimatedSprite;
	protected gravity: number;

	public constructor(parent: PlayerController, owner: FizzRun_AnimatedSprite){
		super(parent);
		this.owner = owner;
        this.gravity = 500;

        SHARED_playerController = parent;
	}

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
	public handleInput(event: GameEvent): void {
        switch(event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {
        // This updates the direction the player sprite is facing (left or right)
        let direction = this.parent.inputDir;
		if(direction.x !== 0){
			this.owner.invertX = MathUtils.sign(direction.x) < 0;
		}
    }

    public abstract onExit(): Record<string, any>;
}