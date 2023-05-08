import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { FizzRun_Events } from "../FizzRun_Events";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Emitter from "../../Wolfie2D/Events/Emitter";

import { SHARED_playerController } from "../Player/PlayerStates/PlayerState";
import { SHARED_robotPool } from "../Scenes/FizzRun_Level";
import Input from "../../Wolfie2D/Input/Input";
import { FizzRun_Controls } from "../FizzRun_Controls";

export default class InkSackBehavior implements AI {
  public readonly FIXED_POS_SPEED: Vec2 = new Vec2(1.6, 0);
  public readonly FIXED_NEG_SPEED: Vec2 = new Vec2(-1.6, 0);
  public readonly NO_SPEED: Vec2 = new Vec2(0, 0);
  private currentSpeed: Vec2;

  private isFacingRight: boolean = true;
  
  private owner: Sprite;
  private receiver: Receiver;
  private emitter: Emitter;

  initializeAI(owner: Sprite, options: Record<string, any>) {
    this.owner = owner;

    this.emitter = new Emitter();

    this.receiver = new Receiver();
    this.receiver.subscribe(FizzRun_Events.ACTIVATE_INKSACK);
    this.receiver.subscribe(FizzRun_Events.INKSACK_ROBOT_COLLISION);

    this.activate(options);
  }

  destroy() {
    this.receiver.destroy();
  }

  activate(options: Record<string, any>): void {
    this.currentSpeed = this.NO_SPEED;
    this.receiver.ignoreEvents();     

    this.owner.visible = false;
    this.owner.scale.set(0.4, 0.4);
    //this.theInkSack.setGroup("WEAPON");
    let collider = this.owner.boundary;
    this.owner.setCollisionShape(collider);
    this.owner.addPhysics(new AABB(this.owner.position.clone(), this.owner.boundary.getHalfSize().clone()));    
  }

  handleEvent(event: GameEvent): void {
    switch(event.type) {
      case FizzRun_Events.ACTIVATE_INKSACK: {
        this.activateInkSack(event);
        break;
      }
      case FizzRun_Events.INKSACK_ROBOT_COLLISION: {
        this.handleRobotCollision(event);
        break;
      }
      default: {
          throw new Error("Unhandled event in InkSackBehavior! Event type: " + event.type);
      }
    }      
  }

  update(deltaT: number): void {
    if (Input.isJustPressed(FizzRun_Controls.MOVE_LEFT)) {
      this.isFacingRight = false;
    }
    else if (Input.isJustPressed(FizzRun_Controls.MOVE_RIGHT)) {
      this.isFacingRight = true;
    }
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }
    this.owner.move(this.currentSpeed);
    for (let robot of SHARED_robotPool.poolArr) {
      if (this.owner.collisionShape.overlaps(robot.collisionShape)) {
        this.emitter.fireEvent(FizzRun_Events.INKSACK_ROBOT_COLLISION, { robotId: robot.id });
      }
    }
  }

  private activateInkSack(event: GameEvent): void {
    let startPoint = event.data.get("position");
    this.owner.visible = true;
    if (this.isFacingRight) {
      this.owner.position.copy(new Vec2(startPoint.x+10, startPoint.y));
      this.currentSpeed.copy(this.FIXED_POS_SPEED);
    }
    else {
      this.owner.position.copy(new Vec2(startPoint.x-10, startPoint.y));
      this.currentSpeed.copy(this.FIXED_NEG_SPEED);
    }
  }

  private handleRobotCollision(event: GameEvent): void {
    console.log("ink sack collided with robot");
    this.owner.visible = false;
    this.owner.position.copy(Vec2.ZERO);
    this.currentSpeed = this.NO_SPEED;
  }
}