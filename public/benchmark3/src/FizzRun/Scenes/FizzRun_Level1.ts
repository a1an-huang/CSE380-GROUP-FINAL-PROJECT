import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import FizzRun_Level from "./FizzRun_Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import FizzRun_Level2 from "./FizzRun_Level2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

import { FizzRunResourceKeys } from "./FizzRun_Level";

/* SECTION LIST POWERUP/NPC SPAWNPOINTS HERE, DO IT FOR EVERY LEVEL! */

export const SUGAR_SPAWN_VECS: Vec2[] = [
    new Vec2(373, 432), 
    new Vec2(628, 448),
    new Vec2(680, 784),
];

export const MENTOS_SPAWN_VECS: Vec2[] = [
    // new Vec2(300, 180), 
    // new Vec2(320, 180), 
    // new Vec2(340, 180), 
    // new Vec2(360, 180),
    // new Vec2(380, 180), 
    // new Vec2(400, 180), 
    // new Vec2(420, 180), 
    // new Vec2(440, 180), 
    // new Vec2(460, 180), 
    // new Vec2(480, 180), 
    // new Vec2(500, 180), 
];

export const ICE_SPAWN_VECS: Vec2[] = [
    new Vec2(503, 652), 
    new Vec2(54, 992),
    new Vec2(452, 912),
    new Vec2(111, 288),
    new Vec2(936, 352),
];

export const ROBOT_SPAWN_VECS: Vec2[] = [
    //new Vec2(250, 180),
];

export const SIGN_SPAWN_VECS: Vec2[] = [
    new Vec2(120, 160),
    new Vec2(242, 160),
    new Vec2(185, 250),
    new Vec2(80, 272),
    new Vec2(126, 350),
    new Vec2(420, 415),
    new Vec2(638, 750),

];

export const SIGN_WORDS_VECS: string[] = [
    "Welcome to FizzRun!",
    "Use W A S D to move",
    "Ice freezes water for 4.5 seconds",
    "Water below!",
    "Move fast and don't drown!",
    "Sugar makes you fast for 2.5 seconds",
    "Avoid the lasers with the sugar!"
];

export const PLAYER_SPAWN_VEC = new Vec2(150, 160);

export const LEVEL_END_AREA = new AABB(new Vec2(478, 496), new Vec2(12, 16));

export default class Level1 extends FizzRun_Level {

    public static readonly PLAYER_SPAWN = PLAYER_SPAWN_VEC;
    public static readonly PLAYER_SPRITE_KEY = "COKE";
    public static readonly PLAYER_SPRITE_PATH_COKE = "fizzrun_assets/spritesheets/coke.json";
    public static readonly PLAYER_SPRITE_PATH_FANTA = "fizzrun_assets/spritesheets/fanta.json";
    public static readonly PLAYER_SPRITE_PATH_SPRITE = "fizzrun_assets/spritesheets/sprite.json";

    public static readonly SPRITE_PATH_SUGAR = "fizzrun_assets/spritesheets/sugar.json";
    public static readonly SPRITE_PATH_MENTOS = "fizzrun_assets/spritesheets/mentos.json";
    public static readonly SPRITE_PATH_ICE = "fizzrun_assets/spritesheets/icecube.json";
    public static readonly SPRITE_PATH_ROBOT = "fizzrun_assets/spritesheets/levitating_robot.json";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "fizzrun_assets/tilemaps/FizzRun_Level1.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    public static readonly OBSTACLE_LAYER_KEY = "Obstacle";
    public static readonly WATER_LAYER_KEY = "Water";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "fizzrun_assets/music/ThemeSong.wav";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "fizzrun_assets/sounds/jump.wav";

    public static readonly DEAD_AUDIO_KEY = "PLAYER_DEAD";
    public static readonly DEAD_AUDIO_PATH = "fizzrun_assets/sounds/dead.wav";

    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";
    public static readonly TILE_DESTROYED_PATH = "fizzrun_assets/sounds/break.wav";

    public static readonly FIZZ_BOOM_KEY = "FIZZ_BOOM";
    public static readonly FIZZ_BOOM_PATH = "fizzrun_assets/sounds/fizzboom.wav";

    public static readonly SWITCH_AUDIO_KEY = "PLAYER_SWITCH";
    public static readonly SWITCH_AUDIO_PATH = "fizzrun_assets/sounds/switch.wav";

    public static readonly LEVEL_END = LEVEL_END_AREA;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.levelNumber = 1;
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level1.TILEMAP_KEY;
        this.tilemapScale = Level1.TILEMAP_SCALE;
        this.destructibleLayerKey = Level1.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level1.WALLS_LAYER_KEY;
        this.obsLayerKey = Level1.OBSTACLE_LAYER_KEY;
        this.waterLayerKey = Level1.WATER_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level1.PLAYER_SPAWN;

        //SECTION Set the powerup/enemy pool here

        //Set powerup spawn
        this.sugarSpawn = SUGAR_SPAWN_VECS;
        this.mentosSpawn = MENTOS_SPAWN_VECS;
        this.iceSpawn = ICE_SPAWN_VECS;

        //Set enemy spawn
        this.robotSpawn = ROBOT_SPAWN_VECS;

        //Set sign spawn and words
        this.signSpawn = SIGN_SPAWN_VECS;
        this.signWords = SIGN_WORDS_VECS;

        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;
        this.deadAudioKey = Level1.DEAD_AUDIO_KEY;
        this.switchAudioKey = Level1.SWITCH_AUDIO_KEY;
        this.tileDestroyedAudioKey = Level1.TILE_DESTROYED_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(478, 496).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 16).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level1.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet("COKE", Level1.PLAYER_SPRITE_PATH_COKE);
        this.load.spritesheet("FANTA", Level1.PLAYER_SPRITE_PATH_FANTA);
        this.load.spritesheet("SPRITE", Level1.PLAYER_SPRITE_PATH_SPRITE);

        this.load.spritesheet("SUGAR", Level1.SPRITE_PATH_SUGAR);
        this.load.spritesheet("MENTOS", Level1.SPRITE_PATH_MENTOS);
        this.load.spritesheet("ICE", Level1.SPRITE_PATH_ICE);
        this.load.spritesheet("ROBOT", Level1.SPRITE_PATH_ROBOT);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level1.JUMP_AUDIO_PATH);
        this.load.audio(this.deadAudioKey, Level1.DEAD_AUDIO_PATH);
        this.load.audio(this.switchAudioKey, Level1.SWITCH_AUDIO_PATH);
        this.load.audio(this.tileDestroyedAudioKey, Level1.TILE_DESTROYED_PATH);

        // LOAD IN REQUIRED ASSETS FOR IN GAME UI 
        this.load.image(FizzRunResourceKeys.SPRITE_LOGO, "fizzrun_assets/images/sprite_logo.png");
        this.load.image(FizzRunResourceKeys.SPRITE_ABILITY, "fizzrun_assets/images/sprite_ability.png");
        this.load.image(FizzRunResourceKeys.COKE_LOGO, "fizzrun_assets/images/coke_logo.png");
        this.load.image(FizzRunResourceKeys.COKE_ABILITY, "fizzrun_assets/images/coke_ability.png");
        this.load.image(FizzRunResourceKeys.FANTA_LOGO, "fizzrun_assets/images/fanta_logo.png");
        this.load.image(FizzRunResourceKeys.FANTA_ABILITY, "fizzrun_assets/images/fanta_ability.png");

        this.load.image(FizzRunResourceKeys.BLINDED_ICON, "fizzrun_assets/images/blinded_status.png");
    }

    /**
     * Unload resources for level 1
     */
    public unloadScene(): void {
        this.load.keepSpritesheet("COKE");
        this.load.keepSpritesheet("FANTA");
        this.load.keepSpritesheet("SPRITE");

        this.load.keepSpritesheet(FizzRunResourceKeys.SUGAR);
        this.load.keepSpritesheet(FizzRunResourceKeys.MENTOS);
        this.load.keepSpritesheet(FizzRunResourceKeys.ROBOT);
        this.load.keepSpritesheet(FizzRunResourceKeys.ICE);
        
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.deadAudioKey);
        this.load.keepAudio(this.switchAudioKey);
        this.load.keepAudio(this.tileDestroyedAudioKey);
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level1.LEVEL_MUSIC_KEY});

        // Keep UI assets
        this.load.keepImage(FizzRunResourceKeys.SPRITE_LOGO);
        this.load.keepImage(FizzRunResourceKeys.SPRITE_ABILITY);
        this.load.keepImage(FizzRunResourceKeys.COKE_LOGO);
        this.load.keepImage(FizzRunResourceKeys.COKE_ABILITY);
        this.load.keepImage(FizzRunResourceKeys.FANTA_LOGO);
        this.load.keepImage(FizzRunResourceKeys.FANTA_ABILITY);

        this.load.keepImage(FizzRunResourceKeys.BLINDED_ICON);
    }

    public startScene(): void {
        super.startScene();
        this.nextLevel = FizzRun_Level2;
        this.currentLevel = Level1;
    }

    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up 
     * when I was making the tilemap for the first level is what it boils down to.
     * 
     * - Peter
     */
    protected initializeViewport(): void {
        super.initializeViewport();
    }

}