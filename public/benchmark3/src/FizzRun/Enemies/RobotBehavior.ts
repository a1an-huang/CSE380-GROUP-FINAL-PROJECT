import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { FizzRun_Events } from "../FizzRun_Events";

import { SHARED_playerController } from "../Player/PlayerStates/PlayerState";
import { FizzRunResourceKeys } from "../Scenes/FizzRun_Level";

export default class RobotBehavior implements AI {
    private owner: AnimatedSprite;
    private receiver: Receiver;
    private blindedDuration: number;

    private emitter: Emitter;

    /**
     * @see {AI.initializeAI}
     */
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.blindedDuration = 0;

        this.receiver = new Receiver();
        this.receiver.subscribe(FizzRun_Events.PLAYER_ROBOT_COLLISION);
        this.receiver.subscribe(FizzRun_Events.INKSACK_ROBOT_COLLISION);

        this.emitter = new Emitter();

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
              this.handleRobotCollision(event);
              break;
            }
            case FizzRun_Events.INKSACK_ROBOT_COLLISION: {
                this.handleRobotBlind(event);
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
        //console.log("blinded duration: " + this.blindedDuration)
        if (this.blindedDuration > 0) {
            this.blindedDuration -= 1000 * deltaT;
            if (this.blindedDuration < 0) {
                this.blindedDuration = 0;
            }
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
      let robotId = event.data.get("robotId");
      if (robotId != this.owner.id) { return; }
      //Don't kill the player if the robot is blinded
      if (this.blindedDuration > 0) {
          return;
      }
      SHARED_playerController.health = 0;
    }

    protected handleRobotBlind(event: GameEvent): void {
        let robotId = event.data.get("robotId");
        if (robotId != this.owner.id) { return; }
        //Blind for 5 seconds
        console.log("robot blinded at: " + this.owner.position);
        this.blindedDuration = 5000;
        this.emitter.fireEvent(FizzRun_Events.PLACE_DEBUFF_ICON, 
            { debuffKey: FizzRunResourceKeys.BLINDED_ICON, 
              debuffDurationSeconds: 5, 
              position: new Vec2(this.owner.position.x, this.owner.position.y - 25)
            });
    }
}





