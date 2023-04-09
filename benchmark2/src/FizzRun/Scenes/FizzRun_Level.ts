import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController, { PlayerTweens } from "../Player/PlayerController";
import PlayerWeapon from "../Player/PlayerWeapon";

import { FizzRun_Events } from "../FizzRun_Events";
import { FizzRun_PhysicsGroups } from "../FizzRun_PhysicsGroups";
import FizzRun_FactoryManager from "../Factory/FizzRun_FactoryManager";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";

import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Graphic from "../../Wolfie2D/Nodes/Graphic";

/**
 * A const object for the layer names
 */
export const FizzRun_Layers = {
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI"
} as const;

/**
 * Use this object to access keys to load sprites or images (change if needed)
 */
export const FizzRunResourceKeys = {
    SPRITE_LOGO: "SPRITE_LOGO",
    SPRITE_ABILITY: "SPRITE_ABILITY",
} as const;

// The layers as a type
export type FizzRun_Layers = typeof FizzRun_Layers[keyof typeof FizzRun_Layers]

/**
 * An abstract HW4 scene class.
 */
export default abstract class FizzRun_Level extends Scene {

    /** Overrride the factory manager */
    public add: FizzRun_FactoryManager;

    /** The particle system used for the player's weapon */
    protected playerWeaponSystem: PlayerWeapon
    /** The key for the player's animated sprite */
    protected playerSpriteKey: string;
    /** The animated sprite that is the player */
    protected player: AnimatedSprite;
    /** The player's spawn position */
    protected playerSpawn: Vec2;

    private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;

    private fizzLabel: Label;
    private fizzBar: Label;
    private fizzBarBg: Label;

    private activeSodaLabel: Label;
    private activeSodaIcon: Sprite;

    private activeSkillLabel: Label;
    private activeSkillSquare: Graphic;
    private activeSkillIcon: Sprite;

    /** The end of level stuff */

    protected levelEndPosition: Vec2;
    protected levelEndHalfSize: Vec2;

    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => Scene;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    // Level end transition timer and graphic
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    /** The keys to the tilemap and different tilemap layers */
    protected tilemapKey: string;
    protected destructibleLayerKey: string;
    protected wallsLayerKey: string;
    /** The scale for the tilemap */
    protected tilemapScale: Vec2;
    /** The destrubtable layer of the tilemap */
    protected destructable: OrthogonalTilemap;
    /** The wall layer of the tilemap */
    protected walls: OrthogonalTilemap;

    /** Sound and music */
    protected levelMusicKey: string;
    protected jumpAudioKey: string;
    protected deadAudioKey: string;
    protected tileDestroyedAudioKey: string;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, {...options, physics: {
            // TODO configure the collision groups and collision map
            groupNames: ["GROUND", "PLAYER", "WEAPON", "DESTRUCTABLE"],
            collisions: [[0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [0, 1, 1, 0]]
         }});
        this.add = new FizzRun_FactoryManager(this, this.tilemaps);
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        // Initialize the sprite and particle system for the players weapon 
        this.initializeWeaponSystem();

        this.initializeUI();

        // Initialize the player 
        this.initializePlayer(this.playerSpriteKey);

        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();
        

        // Initialize the ends of the levels - must be initialized after the primary layer has been added
        this.initializeLevelEnds();

        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // Initially disable player movement
        Input.disableInput();

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Start playing the level music for the HW4 level
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.levelMusicKey, loop: true, holdReference: true});
    }

    /* Update method for the scene */

    public updateScene(deltaT: number) {
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case FizzRun_Events.PLAYER_ENTERED_LEVEL_END: {
                this.handleEnteredLevelEnd();
                break;
            }
            // When the level starts, reenable user input
            case FizzRun_Events.LEVEL_START: {
                Input.enableInput();
                break;
            }
            // When the level ends, change the scene to the next level
            case FizzRun_Events.LEVEL_END: {
                this.sceneManager.changeToScene(this.nextLevel);
                break;
            }
            case FizzRun_Events.HEALTH_CHANGE: {
                this.handleHealthChange(event.data.get("curhp"), event.data.get("maxhp"));
                break;
            }
            case FizzRun_Events.PLAYER_DEAD: {
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case FizzRun_Events.PARTICLE_HIT_DESTRUCT: {
                this.handleParticleHit(event.data.get("node"));
                break;
            }
            case FizzRun_Events.PLAYER_SWITCH: {
                this.handleCharSwitch()
                break;
            }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
            }
        }
    }

    /* Handlers for the different events the scene is subscribed to */

    /**
     * Handle particle hit events
     * @param particleId the id of the particle
     */
    protected handleParticleHit(particleId: number): void {
        let particles = this.playerWeaponSystem.getPool();

        let particle = particles.find(particle => particle.id === particleId);
        if (particle !== undefined) {
            // Get the destructable tilemap
            let tilemap = this.destructable;

            let min = new Vec2(particle.sweptRect.left, particle.sweptRect.top);
            let max = new Vec2(particle.sweptRect.right, particle.sweptRect.bottom);

            // Convert the min/max x/y to the min and max row/col in the tilemap array
            let minIndex = tilemap.getColRowAt(min);
            let maxIndex = tilemap.getColRowAt(max);

            // Loop over all possible tiles the particle could be colliding with 
            for(let col = minIndex.x; col <= maxIndex.x; col++){
                for(let row = minIndex.y; row <= maxIndex.y; row++){
                    // If the tile is collideable -> check if this particle is colliding with the tile
                    if(tilemap.isTileCollidable(col, row) && this.particleHitTile(tilemap, particle, col, row)){
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: this.tileDestroyedAudioKey, loop: false, holdReference: false });
                        // TODO Destroy the tile
                        tilemap.setTileAtRowCol(new Vec2(col, row), 0);
                    }
                }
            }
        }
    }

    /**
     * Checks if a particle hit the tile at the (col, row) coordinates in the tilemap.
     * 
     * @param tilemap the tilemap
     * @param particle the particle
     * @param col the column the 
     * @param row the row 
     * @returns true of the particle hit the tile; false otherwise
     */
    protected particleHitTile(tilemap: OrthogonalTilemap, particle: Particle, col: number, row: number): boolean {
        // TODO detect whether a particle hit a tile
        //if(tilemap.getTileAtRowCol(new Vec2(row, col)) === 1)
            
        return true;
    }

    /**
     * Handle the event when the player enters the level end area.
     */
    protected handleEnteredLevelEnd(): void {
        // If the timer hasn't run yet, start the end level animation
        if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
            this.levelEndTimer.start();
            this.levelEndLabel.tweens.play("slideIn");
        }
    }
    /**
     * This is the same healthbar I used for hw2. I've adapted it slightly to account for the zoom factor. Other than that, the
     * code is basically the same.
     * 
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    protected handleHealthChange(currentHealth: number, maxHealth: number): void {
		let unit = this.healthBarBg.size.x / maxHealth;
        
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}

    protected handleCharSwitch(): void {
        console.log(this.playerSpriteKey);
    }


    /* Initialization methods for everything in the scene */

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer(FizzRun_Layers.UI);
        // Add a layer for players and enemies
        this.addLayer(FizzRun_Layers.PRIMARY);
    }
    /**
     * Initializes the tilemaps
     * @param key the key for the tilemap data
     * @param scale the scale factor for the tilemap
     */
    protected initializeTilemap(): void {
        if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
            throw new Error("Cannot add the homework 4 tilemap unless the tilemap key and scale are set.");
        }
        // Add the tilemap to the scene
        this.add.tilemap(this.tilemapKey, this.tilemapScale);

        if (this.destructibleLayerKey === undefined || this.wallsLayerKey === undefined) {
            throw new Error("Make sure the keys for the destuctible layer and wall layer are both set");
        }

        // Get the wall and destructible layers 
        this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
        this.destructable = this.getTilemap(this.destructibleLayerKey) as OrthogonalTilemap;

        // Add physicss to the wall layer
        this.walls.addPhysics();
        // Add physics to the destructible layer of the tilemap
        this.destructable.addPhysics();
        this.destructable.setTrigger("WEAPON", FizzRun_Events.PARTICLE_HIT_DESTRUCT, null);
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe(FizzRun_Events.PLAYER_ENTERED_LEVEL_END);
        this.receiver.subscribe(FizzRun_Events.LEVEL_START);
        this.receiver.subscribe(FizzRun_Events.LEVEL_END);
        this.receiver.subscribe(FizzRun_Events.HEALTH_CHANGE);
        this.receiver.subscribe(FizzRun_Events.PLAYER_DEAD);
        this.receiver.subscribe(FizzRun_Events.PARTICLE_HIT_DESTRUCT);
        this.receiver.subscribe(FizzRun_Events.PLAYER_SWITCH);
    }
    /**
     * Adds in any necessary UI to the game
     */
    protected initializeUI(): void {

        // HP Label
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(20, 30), text: "Health "});
		this.healthLabel.size.set(300, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Arial";

        // HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(70, 30), text: ""});
		this.healthBar.size = new Vec2(300, 25);
		this.healthBar.backgroundColor = Color.GREEN;

        // HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(70, 30), text: ""});
		this.healthBarBg.size = new Vec2(300, 25);
		this.healthBarBg.borderColor = Color.BLACK;

        // Fizz Label
		this.fizzLabel = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(20, 40), text: "Fizz "});
		this.fizzLabel.size.set(300, 30);
		this.fizzLabel.fontSize = 24;
		this.fizzLabel.font = "Arial";

        // Fizz Bar
		this.fizzBar = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(70, 40), text: ""});
		this.fizzBar.size = new Vec2(300, 25);
		this.fizzBar.backgroundColor = new Color(153, 217, 234, 1);

        // Fizz Bar Border
		this.fizzBarBg = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(70, 40), text: ""});
		this.fizzBarBg.size = new Vec2(300, 25);
		this.fizzBarBg.borderColor = Color.BLACK; 

        // Active Soda Label
        this.activeSodaLabel = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(20, 20), text: "Active Soda: "});
        this.activeSodaLabel.size.set(300, 20);
        this.activeSodaLabel.fontSize = 24;
        this.activeSodaLabel.font = "Arial";

        // Active Soda Icon
        this.activeSodaIcon = this.add.sprite(FizzRunResourceKeys.SPRITE_LOGO, FizzRun_Layers.UI);
        this.activeSodaIcon.position.set(45, 20);
        this.activeSodaIcon.scale.set(0.75, 0.75);

        // Active Skill Square
        this.activeSkillSquare = this.add.graphic(GraphicType.RECT, FizzRun_Layers.UI, {position: new Vec2(70, 20), size: new Vec2(10, 10)});
        this.activeSkillSquare.color = new Color(217, 217, 217, 1);

        // Active Skill Label
        this.activeSkillLabel = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, {position: new Vec2(70, 20), text: "E"});
        this.activeSkillLabel.size.set(300, 30);
        this.activeSkillLabel.fontSize = 24;
        this.activeSkillLabel.font = "Arial";

        // Active Skill Icon
        this.activeSkillIcon = this.add.sprite(FizzRunResourceKeys.SPRITE_ABILITY, FizzRun_Layers.UI);
        this.activeSkillIcon.position.set(85, 19);
        this.activeSkillIcon.scale.set(0.45, 0.45);
        
        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, FizzRun_Layers.UI, { position: new Vec2(-300, 100), text: "Level Complete" });
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, FizzRun_Layers.UI, { position: new Vec2(300, 200), size: new Vec2(600, 400) });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: FizzRun_Events.LEVEL_END
        });

        /*
             Adds a tween to fade in the start of the level. After the tween has
             finished playing, a level start event gets sent to the EventQueue.
        */
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: FizzRun_Events.LEVEL_START
        });
    }
    /**
     * Initializes the particles system used by the player's weapon.
     */
    protected initializeWeaponSystem(): void {
        this.playerWeaponSystem = new PlayerWeapon(50, Vec2.ZERO, 1000, 3, 0, 50);
        this.playerWeaponSystem.initializePool(this, FizzRun_Layers.PRIMARY);
    }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        if (this.playerWeaponSystem === undefined) {
            throw new Error("Player weapon system must be initialized before initializing the player!");
        }
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }
        // Add the player to the scene
        this.player = this.add.animatedSprite(key, FizzRun_Layers.PRIMARY);
        this.player.scale.set(0.25, 0.25); // fixing scaling of 128 x 128
        this.player.position.copy(this.playerSpawn); // fix spawn location

        // Give the player physics
        this.player.addPhysics(new AABB(this.player.position.clone(), this.player.boundary.getHalfSize().clone()));
        this.player.setGroup("PLAYER");

        // TODO - give the player their flip tween

        this.player.tweens.add(PlayerTweens.FLIP, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2 * Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        // Give the player a death animation
        this.player.tweens.add(PlayerTweens.DEATH, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: FizzRun_Events.PLAYER_DEAD
        });

        // Give the player it's AI
        this.player.addAI(PlayerController, { 
            weaponSystem: this.playerWeaponSystem, 
            tilemap: "Destructable" 
        });
    }
    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(4);
        this.viewport.setBounds(0, 0, 1024, 1024);
    }
    /**
     * Initializes the level end area
     */
    protected initializeLevelEnds(): void {
        if (!this.layers.has(FizzRun_Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, FizzRun_Layers.PRIMARY, { position: this.levelEndPosition, size: this.levelEndHalfSize });
        this.levelEndArea.addPhysics(undefined, undefined, false, true); // FIX
        this.levelEndArea.setTrigger(FizzRun_PhysicsGroups.PLAYER, FizzRun_Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(255, 0, 255, .20);
        
    }

    /* Misc methods */

    // Get the key of the player's jump audio file
    public getJumpAudioKey(): string {
        return this.jumpAudioKey
    }
    public getdeadAudioKey(): string {
        return this.deadAudioKey
    }
}