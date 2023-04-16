import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates, PlayerAnimations } from "../PlayerController";
import PlayerState from "./PlayerState";

export default class Fall extends PlayerState {

    onEnter(options: Record<string, any>): void {
        // If we're falling, the vertical velocity should be >= 0
        this.parent.velocity.y = 0;
    }

    update(deltaT: number): void {
        super.update(deltaT);

        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            let damage = Math.floor(this.parent.velocity.y / 250);
            this.parent.health -= damage;
            this.finished(PlayerStates.IDLE);   
            if(damage > 0)
                this.owner.animation.playIfNotAlready(PlayerAnimations.TAKING_DAMAGE, false, PlayerStates.IDLE);
        } 
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
            let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

    }

    onExit(): Record<string, any> {
        this.owner.animation.stop();
        return {};
    }
}