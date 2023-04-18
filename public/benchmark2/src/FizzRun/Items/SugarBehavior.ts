import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { FizzRun_Events } from "../FizzRun_Events";

export default class SugarBehavior implements AI {
    private owner: AnimatedSprite;
    private receiver: Receiver;

    /**
     * @see {AI.initializeAI}
     */
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;

        this.receiver = new Receiver();
        this.receiver.subscribe(FizzRun_Events.PLAYER_POWERUP);

        this.activate(options);
    }
    /**
     * @see {AI.activate}
     */
    activate(options: Record<string, any>): void {
        this.owner.animation.play("IDLE", true);
        this.receiver.ignoreEvents();
    }
    /**
     * @see {AI.handleEvent}
     */
    handleEvent(event: GameEvent): void { 
        switch(event.type) {
            case FizzRun_Events.PLAYER_POWERUP: {
                this.handlePlayerPowerUp(event);
                break;
            }
            default: {
                throw new Error("Unhandled event! Event type: " + event.type);
            }
        }
    }

    /**
     * @see {Updatable.update}
     */
    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    /**
     * @see {AI.destroy}
     */
    destroy(): void { 
        this.receiver.destroy();
    }  

    protected handlePlayerPowerUp(event: GameEvent): void {
        let id = event.data.get("powerId");
        let type = event.data.get("type");
        if (id === this.owner.id && type === 'sugar') {
            this.owner.position.copy(Vec2.ZERO);
            this.owner.visible = false;
        }
    }
}





