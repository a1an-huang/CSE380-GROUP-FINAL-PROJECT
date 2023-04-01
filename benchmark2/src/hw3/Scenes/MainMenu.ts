import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./HW3Level1";


// Layers for the main menu scene
export const MenuLayers = {
    MAIN: "MAIN"
} as const;

export default class MainMenu extends Scene {

    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/menu.mp3";

    public loadScene(): void {
        // Load the menu song
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
        this.load.image("MAINMENU_SPLASH", "fizzrun_assets/images/mainmenu_splash.png");
    }

    public startScene(): void {
        this.addUILayer(MenuLayers.MAIN);
        let center = this.viewport.getCenter();

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        // Add the splash image
        let menuSplash = this.add.sprite("MAINMENU_SPLASH", MenuLayers.MAIN);
        menuSplash.position.set(center.x, center.y);
        menuSplash.scale.set(1, 1.3);

        // Create a play button
        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MenuLayers.MAIN, {position: new Vec2(size.x, size.y+200), text: "PLAY"});
        playBtn.backgroundColor = new Color(255, 0, 64, 1);
        playBtn.borderRadius = 0;
        playBtn.font = "Arial";
        playBtn.setPadding(new Vec2(50, 10));

        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            this.sceneManager.changeToScene(Level1);
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }
}

