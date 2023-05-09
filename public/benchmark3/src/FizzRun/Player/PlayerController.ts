import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";
import Dead from "./PlayerStates/Dead";

import Input from "../../Wolfie2D/Input/Input";

import { FizzRun_Controls } from "../FizzRun_Controls";
import FizzRun_AnimatedSprite from "../Nodes/FizzRun_AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { FizzRun_Events } from "../FizzRun_Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";

import { SHARED_currentSodaType } from "../Scenes/FizzRun_Level";
import { SHARED_isCheatInvincibleOn } from "../Scenes/FizzRun_Level";


/**
 * Animation keys for the player spritesheet
 */
export const PlayerAnimations = {
    IDLE: "IDLE", 
    RUNNING_RIGHT: "RUNNING_RIGHT",
    RUNNING_LEFT: "RUNNING_LEFT",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    ATTACKING_RIGHT: "ATTACKING_RIGHT",
    ATTACKING_LEFT: "ATTACKING_LEFT",
    DYING: "DYING",
    DEAD: "DEAD",
    JUMP: "JUMP",
} as const

/**
 * Tween animations the player can player.
 */
export const PlayerTweens = {
    FLIP: "FLIP",
    DEATH: "DEATH"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const PlayerStates = {
    IDLE: "IDLE",
    WALK: "WALK",
	JUMP: "JUMP",
    FALL: "FALL",
    DEAD: "DEAD",
    POWERUP: "POWERUP"
} as const
// Enum for sprite 
export const PlayerSprite = {
	COKE: "COKE",
    FANTA: "FANTA",
    SPRITE: "SPRITE",
} as const

/**
 * The controller that controls the player.
 */
export default class PlayerController extends StateMachineAI {
    public readonly MAX_SPEED: number = 400;
    public readonly MIN_SPEED: number = 100;

    //CHEATCODE ATTRIBUTES
    public isInvincible: boolean = false;

    public speedChange: boolean;
    private speedTimer: Timer

    public iceEffect: boolean
    public contEffect: boolean
    private iceTimer: Timer

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    /** Fizz Meters */
    protected _fizz: number;
    protected _maxFizz: number;

    /** The players game node */
    protected owner: FizzRun_AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    protected weapon: any;

    public initializeAI(owner: FizzRun_AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.weapon = options.weaponSystem;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 100;
        this.velocity = Vec2.ZERO;

        this.health = options.currHealth;
        this.maxHealth = options.maxHealth;
        
        this.fizz = options.currFizz;
        this.maxFizz = options.maxFizz;

        this.iceEffect = false;
        this.contEffect = false;
        this.iceTimer = new Timer(4500, this.handleIceChange, false);

        this.speedChange = false;
        this.speedTimer = new Timer(2500, this.handleSpeedChange, false);

        //Check if invincible is on
        this.isInvincible = SHARED_isCheatInvincibleOn; 

        // Add the different states the player can be in to the PlayerController 
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
		this.addState(PlayerStates.WALK, new Walk(this, this.owner));
        this.addState(PlayerStates.JUMP, new Jump(this, this.owner));
        this.addState(PlayerStates.FALL, new Fall(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        
        // Start the player in the Idle state
        this.initialize(PlayerStates.IDLE);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(FizzRun_Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(FizzRun_Controls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isJustPressed(FizzRun_Controls.JUMP) ? -1 : 0);
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);
        if(this.speedChange) {
            this.speed = this.MAX_SPEED;
            this.speedTimer.start();
            this.speedChange = false;
        }
        if(this.iceEffect == true && this.contEffect == false) {
            this.iceTimer.start();
            this.contEffect = true;
        }
        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if (Input.isPressed(FizzRun_Controls.ATTACK)) {
            //WEAPON ALREADY UPDATED IN initializeAI, no need to update here

            if (SHARED_currentSodaType === PlayerSprite.SPRITE && !this.weapon.isSystemRunning()) {
                // Start the particle system at the player's current position
                this.weapon.startSystem(500, 0, this.owner.position);
            }
            else if (SHARED_currentSodaType === PlayerSprite.FANTA) {
                this.weapon.startSystem();
            }
            else if (SHARED_currentSodaType === PlayerSprite.COKE) {
                this.weapon.startSystem(this.owner.position);
            }
            this.owner.animation.play(PlayerAnimations.ATTACKING_RIGHT, false, PlayerAnimations.IDLE);
            console.log(this.owner.position)
        }
        // Switch character
        if (Input.isJustPressed(FizzRun_Controls.SWITCH)) {
            this.emitter.fireEvent(FizzRun_Events.PLAYER_SWITCH, {curhp: this.health, maxhp: this.maxHealth});
        }
        if(this.health === 0) {
            this.owner.animation.play(PlayerAnimations.DYING, false, PlayerStates.DEAD);
        }

	}

    protected handleSpeedChange = () => {
		if (!this.speedChange) {
            this.speed = this.MIN_SPEED; 
			//this.speedTimer.reset();
        }
	}
    protected handleIceChange = () => {
		if (this.iceEffect) {
            this.iceEffect = false;
            this.contEffect == false;
        }
	}

    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { 
        this._maxHealth = maxHealth; 
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(FizzRun_Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
    }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        if (this.isInvincible) { return; }
        
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(FizzRun_Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});

        // If the health hit 0, change the state of the player
        if (this.health === 0) { this.changeState(PlayerStates.DEAD); }
    }

    public get maxFizz(): number { return this._maxFizz; }
    public set maxFizz(maxFizz: number) { 
        this._maxFizz = maxFizz; 
        // When the fizz changes, fire an event up to the scene.
        this.emitter.fireEvent(FizzRun_Events.FIZZ_CHANGE, {curfizz: this.fizz, maxfizz: this.maxFizz});
    }

    public get fizz(): number { return this._fizz; }
    public set fizz(fizz: number) { 
        this._fizz = MathUtils.clamp(fizz, 0, this.maxFizz);
        // When the fizz changes, fire an event up to the scene.
        this.emitter.fireEvent(FizzRun_Events.FIZZ_CHANGE, {curfizz: this.fizz, maxfizz: this.maxFizz});
    }
}