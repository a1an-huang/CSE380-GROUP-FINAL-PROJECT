import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import FizzRun_Level from "./FizzRun_Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

import { FizzRunResourceKeys } from "./FizzRun_Level";
import Level2 from "./FizzRun_Level2";
import Level3 from "./FizzRun_Level3";
import Level4 from "./FizzRun_Level4";
import Level5 from "./FizzRun_Level5";

export const SUGAR_SPAWN_VECS_6: Vec2[] = [];

export const MENTOS_SPAWN_VECS_6: Vec2[] = [];

export const ICE_SPAWN_VECS_6: Vec2[] = [];

export const ROBOT_SPAWN_VECS_6: Vec2[] = [];

export const SIGN_SPAWN_VECS_6: Vec2[] = [];

export const SIGN_SIZE_VECS6: Vec2[] = [];

export const SIGN_WORDS_VECS_6: string[] = [];

export const PLAYER_SPAWN_VEC_6 = new Vec2(228, 350); //OG 120, 740

export const LEVEL_END_AREA_6 = new AABB(new Vec2(224, 232), new Vec2(24, 16));

export default class Level6 extends FizzRun_Level {
    public static readonly PLAYER_SPAWN = PLAYER_SPAWN_VEC_6;
    public static readonly PLAYER_SPRITE_KEY = "COKE";

    public static readonly TILEMAP_KEY = "LEVEL6";
    public static readonly TILEMAP_PATH =
        "fizzrun_assets/tilemaps/FizzRun_Level6.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    public static readonly OBSTACLE_LAYER_KEY = "Obstacle";
    public static readonly WATER_LAYER_KEY = "Water";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH =
        "fizzrun_assets/music/ThemeSong.wav";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";

    public static readonly DEAD_AUDIO_KEY = "PLAYER_DEAD";

    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";

    public static readonly FIZZ_BOOM_KEY = "FIZZ_BOOM";

    public static readonly SWITCH_AUDIO_KEY = "PLAYER_SWITCH";

    public static readonly LEVEL_END = LEVEL_END_AREA_6;

    public constructor(
        viewport: Viewport,
        sceneManager: SceneManager,
        renderingManager: RenderingManager,
        options: Record<string, any>
    ) {
        super(viewport, sceneManager, renderingManager, options);
        this.levelNumber = 6;
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level6.TILEMAP_KEY;
        this.tilemapScale = Level6.TILEMAP_SCALE;
        this.destructibleLayerKey = Level6.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level6.WALLS_LAYER_KEY;
        this.obsLayerKey = Level6.OBSTACLE_LAYER_KEY;
        this.waterLayerKey = Level6.WATER_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level6.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level6.PLAYER_SPAWN;

        //SECTION Set the powerup/enemy pool here

        //Set powerup spawn
        this.sugarSpawn = SUGAR_SPAWN_VECS_6;
        this.mentosSpawn = MENTOS_SPAWN_VECS_6;
        this.iceSpawn = ICE_SPAWN_VECS_6;

        //Set enemy spawn
        this.robotSpawn = ROBOT_SPAWN_VECS_6;

        //Set sign spawn
        this.signSpawn = SIGN_SPAWN_VECS_6;
        this.signSize = SIGN_SIZE_VECS6;
        this.signWords = SIGN_WORDS_VECS_6;

        // Music and sound
        this.levelMusicKey = Level6.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = Level6.JUMP_AUDIO_KEY;
        this.deadAudioKey = Level6.DEAD_AUDIO_KEY;
        this.switchAudioKey = Level6.SWITCH_AUDIO_KEY;
        this.tileDestroyedAudioKey = Level6.TILE_DESTROYED_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(992, 333);
        this.levelEndHalfSize = new Vec2(16, 10).mult(this.tilemapScale);
    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level6.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.getSpritesheet("COKE");
        this.load.getSpritesheet("FANTA");
        this.load.getSpritesheet("SPRITE");

        this.load.getSpritesheet(FizzRunResourceKeys.SUGAR);
        this.load.getSpritesheet(FizzRunResourceKeys.MENTOS);
        this.load.getSpritesheet(FizzRunResourceKeys.ICE);
        this.load.getSpritesheet(FizzRunResourceKeys.ROBOT);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level6.LEVEL_MUSIC_PATH);
        this.load.getAudio(Level6.JUMP_AUDIO_KEY);
        this.load.getAudio(Level6.DEAD_AUDIO_KEY);
        this.load.getAudio(Level6.SWITCH_AUDIO_KEY);
        this.load.getAudio(Level6.TILE_DESTROYED_KEY);

        this.load.getImage(FizzRunResourceKeys.SPRITE_LOGO);
        this.load.getImage(FizzRunResourceKeys.SPRITE_ABILITY);
        this.load.getImage(FizzRunResourceKeys.COKE_LOGO);
        this.load.getImage(FizzRunResourceKeys.COKE_ABILITY);
        this.load.getImage(FizzRunResourceKeys.FANTA_LOGO);
        this.load.getImage(FizzRunResourceKeys.FANTA_ABILITY);

        this.load.getImage(FizzRunResourceKeys.BLINDED_ICON);
    }

    public unloadScene(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: Level6.LEVEL_MUSIC_KEY,
        });
    }

    public startScene(): void {
        super.startScene();
        this.currentLevel = Level6;
        this.nextLevel = MainMenu;

        this.theLevel2Scene = Level2;
        this.theLevel3Scene = Level3;
        this.theLevel4Scene = Level4;
        this.theLevel5Scene = Level5;
        this.theLevel6Scene = Level6;
    }
}
