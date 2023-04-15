import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { FizzRun_Events } from "../FizzRun_Events";

import { SHARED_playerController } from "../Player/PlayerStates/PlayerState";

export default class RobotBehavior implements AI {
    private owner: AnimatedSprite;
    private receiver: Receiver;

    /**
     * @see {AI.initializeAI}
     */
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;

        this.receiver = new Receiver();
        this.receiver.subscribe(FizzRun_Events.PLAYER_ROBOT_COLLISION);

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

            case FizzRun_Events.PLAYER_ROBOT_COLLISION: {
              console.log("robot collided");
              this.handleRobotCollision(event);
              break;
            }
            default: {
                throw new Error("Unhandled event in RobotBehavior! Event type: " + event.type);
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

    protected handleRobotCollision(event: GameEvent): void {
      console.log("robot collided");
      SHARED_playerController.health = 0;
      this.owner.destroy();
    }

}





