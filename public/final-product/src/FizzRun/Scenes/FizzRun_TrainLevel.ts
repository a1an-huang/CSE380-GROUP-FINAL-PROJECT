import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import FizzRun_Level from "./FizzRun_Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import FizzRun_Level2 from "./FizzRun_Level2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

import { FizzRunResourceKeys } from "./FizzRun_Level";
import MainMenu from "./MainMenu";
import Level3 from "./FizzRun_Level3";
import Level4 from "./FizzRun_Level4";

/* SECTION LIST POWERUP/NPC SPAWNPOINTS HERE, DO IT FOR EVERY LEVEL! */

export const SUGAR_SPAWN_VECS: Vec2[] = [
  new Vec2(784, 528),
];

export const MENTOS_SPAWN_VECS: Vec2[] = [

];

export const ICE_SPAWN_VECS: Vec2[] = [
  new Vec2(449, 704),
];

export const ROBOT_SPAWN_VECS: Vec2[] = [
    new Vec2(199, 700),
];

export const SIGN_SPAWN_VECS: Vec2[] = [
  new Vec2(120, 180),
  new Vec2(242, 180),
  new Vec2(357, 256),
  new Vec2(578, 235),
  new Vec2(669, 175),
  new Vec2(937, 234),

  new Vec2(937, 500),
  new Vec2(787, 500),
  new Vec2(451, 500),

  new Vec2(120, 680),
  new Vec2(120, 702),
  new Vec2(275, 680),
  new Vec2(199, 658),
  new Vec2(449, 658),
  new Vec2(449, 680),
  new Vec2(582, 690),
  new Vec2(776, 680),
];

export const SIGN_SIZE_VECS: Vec2[] = [
  new Vec2(70, 30),
  new Vec2(90, 30),
  new Vec2(90, 30),
  new Vec2(70, 30),
  new Vec2(90, 30),
  new Vec2(90, 30),

  new Vec2(120, 30),
  new Vec2(110, 30),
  new Vec2(90, 30),

  new Vec2(90, 20),
  new Vec2(120, 20),
  new Vec2(90, 20),
  new Vec2(120, 20),
  new Vec2(120, 20),
  new Vec2(90, 20),
  new Vec2(90, 20),
  new Vec2(120, 20),
];

export const SIGN_WORDS_VECS: string[] = [
  "Welcome to FizzRun!",
  "Use A and D to move left and right.",
  "Use W to jump.",
  "Lasers will kill you!",
  "Jump over the laser to not die!",
  "Drop down to continue.",

  "Ouch! You took some fall damage, but its nothing :)",
  "Sugar makes you super fast for 2.5 seconds!",
  "Keep going!",

  "Robots will instantly kill you if touched!",
  "Press E to send out an ink sack and blind the robot!",
  "Blind lasts 5 seconds.",
  "You can move through the robot when it is blinded.",
  "This is an ice cube. Use it to walk over water!",
  "The powerup lasts 5 seconds.",
  "Without ice, you will drown!",
  "That is all the training for now. Enjoy Fizzrun!"
];

export const PLAYER_SPAWN_VEC = new Vec2(50, 160); //50,160 OG

export const LEVEL_END_AREA = new AABB(new Vec2(890, 704), new Vec2(12, 16));

/* SECTION SPAWN SECTION DONE*/

export default class TrainLevel extends FizzRun_Level {

    public static readonly PLAYER_SPAWN = PLAYER_SPAWN_VEC;
    public static readonly PLAYER_SPRITE_KEY = "COKE";
    public static readonly PLAYER_SPRITE_PATH_COKE = "fizzrun_assets/spritesheets/coke.json";
    public static readonly PLAYER_SPRITE_PATH_FANTA = "fizzrun_assets/spritesheets/fanta.json";
    public static readonly PLAYER_SPRITE_PATH_SPRITE = "fizzrun_assets/spritesheets/sprite.json";

    public static readonly SPRITE_PATH_SUGAR = "fizzrun_assets/spritesheets/sugar.json";
    public static readonly SPRITE_PATH_MENTOS = "fizzrun_assets/spritesheets/mentos.json";
    public static readonly SPRITE_PATH_ICE = "fizzrun_assets/spritesheets/icecube.json";
    public static readonly SPRITE_PATH_ROBOT = "fizzrun_assets/spritesheets/levitating_robot.json";

    public static readonly TILEMAP_KEY = "TRAINLEVEL";
    public static readonly TILEMAP_PATH = "fizzrun_assets/tilemaps/FizzRun_TrainLevel.json";
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
        this.levelNumber = -1;
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = TrainLevel.TILEMAP_KEY;
        this.tilemapScale = TrainLevel.TILEMAP_SCALE;
        this.destructibleLayerKey = TrainLevel.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = TrainLevel.WALLS_LAYER_KEY;
        this.obsLayerKey = TrainLevel.OBSTACLE_LAYER_KEY;
        this.waterLayerKey = TrainLevel.WATER_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = TrainLevel.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = TrainLevel.PLAYER_SPAWN;

        //SECTION Set the powerup/enemy pool here

        //Set powerup spawn
        this.sugarSpawn = SUGAR_SPAWN_VECS;
        this.mentosSpawn = MENTOS_SPAWN_VECS;
        this.iceSpawn = ICE_SPAWN_VECS;

        //Set enemy spawn
        this.robotSpawn = ROBOT_SPAWN_VECS;

        //Set sign spawn and words
        this.signSpawn = SIGN_SPAWN_VECS;
        this.signSize = SIGN_SIZE_VECS;
        this.signWords = SIGN_WORDS_VECS;

        // Music and sound
        this.levelMusicKey = TrainLevel.LEVEL_MUSIC_KEY
        this.jumpAudioKey = TrainLevel.JUMP_AUDIO_KEY;
        this.deadAudioKey = TrainLevel.DEAD_AUDIO_KEY;
        this.switchAudioKey = TrainLevel.SWITCH_AUDIO_KEY;
        this.tileDestroyedAudioKey = TrainLevel.TILE_DESTROYED_KEY;

        // Level end size and position
        console.log(this.tilemapScale);
        this.levelEndPosition = new Vec2(464, 344).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, TrainLevel.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet("COKE", TrainLevel.PLAYER_SPRITE_PATH_COKE);
        this.load.spritesheet("FANTA", TrainLevel.PLAYER_SPRITE_PATH_FANTA);
        this.load.spritesheet("SPRITE", TrainLevel.PLAYER_SPRITE_PATH_SPRITE);

        this.load.spritesheet("SUGAR", TrainLevel.SPRITE_PATH_SUGAR);
        this.load.spritesheet("MENTOS", TrainLevel.SPRITE_PATH_MENTOS);
        this.load.spritesheet("ICE", TrainLevel.SPRITE_PATH_ICE);
        this.load.spritesheet("ROBOT", TrainLevel.SPRITE_PATH_ROBOT);
        // Audio and music
        this.load.audio(this.levelMusicKey, TrainLevel.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, TrainLevel.JUMP_AUDIO_PATH);
        this.load.audio(this.deadAudioKey, TrainLevel.DEAD_AUDIO_PATH);
        this.load.audio(this.switchAudioKey, TrainLevel.SWITCH_AUDIO_PATH);
        this.load.audio(this.tileDestroyedAudioKey, TrainLevel.TILE_DESTROYED_PATH);

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
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: TrainLevel.LEVEL_MUSIC_KEY});

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
        this.nextLevel = MainMenu;
        this.currentLevel = TrainLevel;

        this.theLevel2Scene = FizzRun_Level2;
        this.theLevel3Scene = Level3;
        this.theLevel4Scene = Level4;
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