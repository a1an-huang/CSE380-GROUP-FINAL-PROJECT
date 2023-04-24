import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import FizzRun_Level from "./FizzRun_Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

import { FizzRunResourceKeys } from "./FizzRun_Level";

export default class Level2 extends FizzRun_Level {

    public static readonly PLAYER_SPAWN = new Vec2(150, 160);
    public static readonly PLAYER_SPRITE_KEY = "COKE";

    public static readonly TILEMAP_KEY = "LEVEL2";
    public static readonly TILEMAP_PATH = "fizzrun_assets/tilemaps/FizzRun_Level2.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    public static readonly OBSTACLE_LAYER_KEY = "Obstacle";
    public static readonly WATER_LAYER_KEY = "Water";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "fizzrun_assets/music/ThemeSong.wav";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";

    public static readonly DEAD_AUDIO_KEY = "PLAYER_DEAD";

    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";

    public static readonly FIZZ_BOOM_KEY = "FIZZ_BOOM";

    public static readonly SWITCH_AUDIO_KEY = "PLAYER_SWITCH";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.levelNumber = 2;
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level2.TILEMAP_KEY;
        this.tilemapScale = Level2.TILEMAP_SCALE;
        this.destructibleLayerKey = Level2.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = Level2.WALLS_LAYER_KEY;
        this.obsLayerKey = Level2.OBSTACLE_LAYER_KEY;
        this.waterLayerKey = Level2.WATER_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level2.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level2.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Level2.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level2.JUMP_AUDIO_KEY;
        this.deadAudioKey = Level2.DEAD_AUDIO_KEY;
        this.switchAudioKey = Level2.SWITCH_AUDIO_KEY;
        this.tileDestroyedAudioKey = Level2.TILE_DESTROYED_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(32, 216).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);

    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level2.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.getSpritesheet('COKE');
        this.load.getSpritesheet('FANTA');
        this.load.getSpritesheet('SPRITE');

        this.load.getSpritesheet(FizzRunResourceKeys.SUGAR);
        this.load.getSpritesheet(FizzRunResourceKeys.MENTOS);
        this.load.getSpritesheet(FizzRunResourceKeys.ROBOT);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level2.LEVEL_MUSIC_PATH);
        this.load.getAudio(Level2.JUMP_AUDIO_KEY);
        this.load.getAudio(Level2.DEAD_AUDIO_KEY);
        this.load.getAudio(Level2.SWITCH_AUDIO_KEY);
        this.load.getAudio(Level2.TILE_DESTROYED_KEY);

        this.load.getImage(FizzRunResourceKeys.SPRITE_LOGO);
        this.load.getImage(FizzRunResourceKeys.SPRITE_ABILITY);
        this.load.getImage(FizzRunResourceKeys.COKE_LOGO);
        this.load.getImage(FizzRunResourceKeys.COKE_ABILITY);
        this.load.getImage(FizzRunResourceKeys.FANTA_LOGO);
        this.load.getImage(FizzRunResourceKeys.FANTA_ABILITY);

        this.load.getImage(FizzRunResourceKeys.BLINDED_ICON);
    }

    public unloadScene(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: Level2.LEVEL_MUSIC_KEY});
    }

    public startScene(): void {
        super.startScene();
        this.nextLevel = MainMenu;
    }

}