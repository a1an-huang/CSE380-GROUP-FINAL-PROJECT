import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";

import Level1 from "./FizzRun_Level1";
import Level2 from "./FizzRun_Level2";
import { uncompleted_levels } from "./FizzRun_Level";

// Layers for the main menu scene
export const MenuLayers = {
    SPLASH: "SPLASH", // Screen when first loaded
    MAIN: "MAIN", //Screen with level selection, help, and controls
    CONTROLS: "CONTROLS",
    LEVELSELECT: "LEVELSELECT",
    HELP: "HELP",
} as const;

const MainMenuEvent = {
    // NOTE Maybe add splash event later
    MENU: "MENU",
    CONTROLS: "CONTROLS",
    LEVELSELECT: "LEVELSELECT",
    HELP: "HELP",
} as const;

export default class MainMenu extends Scene {
    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "fizzrun_assets/music/menu.mp3";

    private splashScreen: Layer;
    private mainMenuScreen: Layer;
    private controlsScreen: Layer;
    private levelSelectScreen: Layer;
    private helpScreen: Layer;
    private layerArr: Layer[];

    public loadScene(): void {
        // Load the menu song
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);

        // Load each menu bg image*
        this.load.image("SPLASH_BG", "fizzrun_assets/images/splash_bg.png");
        this.load.image("MENU_BG", "fizzrun_assets/images/menu_bg.png");
        this.load.image("CONTROLS_BG", "fizzrun_assets/images/controls_bg.png");
        this.load.image(
            "LEVELSELECT_BG",
            "fizzrun_assets/images/levelselect_bg.png"
        );
        this.load.image("ICON_LOCKEDLEVEL", "fizzrun_assets/images/menu_lockedlevel_icon.png");
    }

    public startScene(): void {
        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        /**********/
        //SECTION To add a new layer, do the following* (after adding bg image to loadScene if needed):

        // Add each layer here*
        this.splashScreen = this.addUILayer(MenuLayers.SPLASH);
        this.mainMenuScreen = this.addUILayer(MenuLayers.MAIN);
        this.controlsScreen = this.addUILayer(MenuLayers.CONTROLS);
        this.levelSelectScreen = this.addUILayer(MenuLayers.LEVELSELECT);
        this.helpScreen = this.addUILayer(MenuLayers.HELP);

        // Create each layer here*
        this.createSplashScreen();
        this.createMainMenuScreen();
        this.createControlsScreen();
        this.createLevelSelectScreen();
        this.createHelpScreen();

        // Subscribe to an event to change menu screens*
        this.receiver.subscribe(MainMenuEvent.MENU);
        this.receiver.subscribe(MainMenuEvent.CONTROLS);
        this.receiver.subscribe(MainMenuEvent.LEVELSELECT);
        this.receiver.subscribe(MainMenuEvent.HELP);

        //Add to layer array if needed*
        this.layerArr = [
            this.splashScreen,
            this.mainMenuScreen,
            this.controlsScreen,
            this.levelSelectScreen,
            this.helpScreen,
        ];

        /**********/

        // Hide each layer here
        for (let layer of this.layerArr) {
            if (layer !== this.splashScreen) {
                layer.setHidden(true);
            }
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: MainMenu.MUSIC_KEY,
            loop: true,
            holdReference: true,
        });
    }

    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: MainMenu.MUSIC_KEY,
        });
    }

    public updateScene(): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case MainMenuEvent.MENU: {
                for (let layer of this.layerArr) {
                    if (layer !== this.mainMenuScreen) {
                        layer.setHidden(true);
                    } else {
                        layer.setHidden(false);
                    }
                }
                break;
            }
            case MainMenuEvent.CONTROLS: {
                for (let layer of this.layerArr) {
                    if (layer !== this.controlsScreen) {
                        layer.setHidden(true);
                    } else {
                        layer.setHidden(false);
                    }
                }
                break;
            }
            case MainMenuEvent.LEVELSELECT: {
                for (let layer of this.layerArr) {
                    if (layer !== this.levelSelectScreen) {
                        layer.setHidden(true);
                    } else {
                        layer.setHidden(false);
                    }
                }
                break;
            }
            case MainMenuEvent.HELP: {
                for (let layer of this.layerArr) {
                    if (layer !== this.helpScreen) {
                        layer.setHidden(true);
                    } else {
                        layer.setHidden(false);
                    }
                }
                break;
            }
            default: {
                throw new Error(
                    `Unhandled event caught in MainMenu: "${event.type}"`
                );
            }
        }
    }

    protected createSplashScreen(): void {
        let size = this.viewport.getHalfSize();
        // Add the splash image
        let menuSplash = this.add.sprite("SPLASH_BG", MenuLayers.SPLASH);
        menuSplash.position.set(size.x, size.y);
        menuSplash.scale.set(1, 1.3);

        // Create a play button
        let playBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.SPLASH,
            {
                position: new Vec2(size.x, size.y + 200),
                text: "PLAY",
            }
        );
        playBtn.backgroundColor = new Color(255, 0, 64, 1);
        playBtn.borderRadius = 0;
        playBtn.font = "Arial";
        playBtn.setPadding(new Vec2(50, 10));

        playBtn.onClickEventId = MainMenuEvent.MENU;
    }

    protected createMainMenuScreen(): void {
        let size = this.viewport.getHalfSize();
        // Add the menu bg image
        let menuSplash = this.add.sprite("MENU_BG", MenuLayers.MAIN);
        menuSplash.position.set(size.x, size.y);
        menuSplash.scale.set(1, 1.3);

        // Create each button
        let levelSelectBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y - 100),
                text: "Level Selection",
            }
        );
        let helpBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y),
                text: "Help",
            }
        );
        let controlsBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.MAIN,
            {
                position: new Vec2(size.x, size.y + 100),
                text: "Controls",
            }
        );
        let btnArr = [levelSelectBtn, helpBtn, controlsBtn];
        for (const btn of btnArr) {
            btn.backgroundColor = new Color(107, 192, 72, 1);
            btn.borderRadius = 0;
            btn.font = "Arial";
            btn.setPadding(new Vec2(50, 10));
        }
        levelSelectBtn.onClickEventId = MainMenuEvent.LEVELSELECT;
        helpBtn.onClickEventId = MainMenuEvent.HELP;
        controlsBtn.onClickEventId = MainMenuEvent.CONTROLS;
    }

    protected createControlsScreen(): void {
        let size = this.viewport.getHalfSize();

        let controlsSplash = this.add.sprite(
            "CONTROLS_BG",
            MenuLayers.CONTROLS
        );
        controlsSplash.position.set(size.x, size.y);
        controlsSplash.scale.set(1, 1.3);

        let controlsList: Array<String> = [
            "A - Move Left",
            "D - Move Right",
            "SPACE - Jump",
            "F - Cycle Character",
            "E - Use Special Ability",
            "X - Use Fizz",
            "ESC - Pauses the game",
            "Aim with mouse input",
        ];

        for (let i = 0; i < controlsList.length; i++) {
            this.add.uiElement(UIElementType.LABEL, MenuLayers.CONTROLS, {
                position: new Vec2(size.x, size.y - 200 + i * 50),
                text: controlsList[i],
            });
        }

        let backBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.CONTROLS,
            {
                position: new Vec2(size.x, size.y + 300),
                text: "Back",
            }
        );
        backBtn.backgroundColor = new Color(107, 192, 72, 1);
        backBtn.borderRadius = 0;
        backBtn.font = "Arial";
        backBtn.setPadding(new Vec2(50, 10));
        backBtn.onClickEventId = MainMenuEvent.MENU;
    }

    protected createLevelSelectScreen(): void {
        let size = this.viewport.getHalfSize();

        let levelSelectSplash = this.add.sprite(
            "LEVELSELECT_BG",
            MenuLayers.LEVELSELECT
        );
        levelSelectSplash.position.set(size.x, size.y);
        levelSelectSplash.scale.set(1, 1.3);

        let backBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x, size.y + 300),
                text: "Back",
            }
        );
        backBtn.backgroundColor = new Color(107, 192, 72, 1);
        backBtn.borderRadius = 0;
        backBtn.font = "Arial";
        backBtn.setPadding(new Vec2(50, 10));
        backBtn.onClickEventId = MainMenuEvent.MENU;

        // Level Select Buttons
        let levelOneBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x - 250, size.y - 200),
                text: "1",
            }
        );
        levelOneBtn.setPadding(new Vec2(50, 40));
        // TODO Added functionality only to first level for now, do rest later
        levelOneBtn.onClick = () => {
            this.sceneManager.changeToScene(Level1);
        };

        let levelTwoBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x, size.y - 200),
                text: "2",
            }
        );
        levelTwoBtn.setPadding(new Vec2(50, 40));

        levelTwoBtn.onClick = () => {
            if(!uncompleted_levels.includes(2))
                this.sceneManager.changeToScene(Level2);
        };
        if(uncompleted_levels.includes(2)) {
            let lockedIconLvTwo = this.add.sprite("ICON_LOCKEDLEVEL", MenuLayers.LEVELSELECT);
            lockedIconLvTwo.position.set(size.x, size.y-200);
            lockedIconLvTwo.scale.set(1, 1);
        }

        let levelThreeBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x + 250, size.y - 200),
                text: "3",
            }
        );
        levelThreeBtn.setPadding(new Vec2(50, 40));

        // levelThreeBtn.onClick = () => {
        //     if(!uncompleted_levels.includes(3))
        //         this.sceneManager.changeToScene(Level3);
        // };
        if(uncompleted_levels.includes(3)) {
            let lockedIconLvThree = this.add.sprite("ICON_LOCKEDLEVEL", MenuLayers.LEVELSELECT);
            lockedIconLvThree.position.set(size.x+250, size.y-200);
            lockedIconLvThree.scale.set(1, 1);
        }

        let levelFourBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x - 250, size.y),
                text: "4",
            }
        );
        levelFourBtn.setPadding(new Vec2(50, 40));

        // levelFourBtn.onClick = () => {
        //     if(!uncompleted_levels.includes(4))
        //         this.sceneManager.changeToScene(Level4);
        // };
        if(uncompleted_levels.includes(4)) {
            let lockedIconLvFour = this.add.sprite("ICON_LOCKEDLEVEL", MenuLayers.LEVELSELECT);
            lockedIconLvFour.position.set(size.x-250, size.y);
            lockedIconLvFour.scale.set(1, 1);
        }

        let levelFiveBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x, size.y),
                text: "5",
            }
        );
        levelFiveBtn.setPadding(new Vec2(50, 40));
        // levelFiveBtn.onClick = () => {
        //     if(!uncompleted_levels.includes(5))
        //         this.sceneManager.changeToScene(Level5);
        // };
        if(uncompleted_levels.includes(5)) {
            let lockedIconLvFive = this.add.sprite("ICON_LOCKEDLEVEL", MenuLayers.LEVELSELECT);
            lockedIconLvFive.position.set(size.x, size.y);
            lockedIconLvFive.scale.set(1, 1);
        }

        let levelSixBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.LEVELSELECT,
            {
                position: new Vec2(size.x + 250, size.y),
                text: "6",
            }
        );
        levelSixBtn.setPadding(new Vec2(50, 40));
        // levelSixBtn.onClick = () => {
        //     if(!uncompleted_levels.includes(6))
        //         this.sceneManager.changeToScene(Level6);
        // };
        if(uncompleted_levels.includes(6)) {
            let lockedIconLvSix = this.add.sprite("ICON_LOCKEDLEVEL", MenuLayers.LEVELSELECT);
            lockedIconLvSix.position.set(size.x+250, size.y);
            lockedIconLvSix.scale.set(1, 1);
        }
    }

    protected createHelpScreen(): void {
        let size = this.viewport.getHalfSize();

        let helpBg = this.add.graphic(GraphicType.RECT, MenuLayers.HELP, {
            size: new Vec2(1200, 800),
            position: new Vec2(size.x, size.y),
        });
        helpBg.color = new Color(107, 192, 72, 1);

        let backBtn = <Button>this.add.uiElement(
            UIElementType.BUTTON,
            MenuLayers.HELP,
            {
                position: new Vec2(size.x, size.y + 300),
                text: "Back",
            }
        );

        let titleOneText: String = "Backstory:";
        let titleOne: Label = <Label>this.add.uiElement(
            UIElementType.LABEL,
            MenuLayers.HELP,
            {
                position: new Vec2(size.x, size.y - 300),
                text: titleOneText,
            }
        );

        let stringArr: String[] = [
            `Coca-Cola, Fanta, and Sprite are having a fun time exploring Sodaopolis`,
            `when Baron Vender, the leader of the Vending Machines invades the city`,
            `and kidnaps Fanta and Sprite to keep as hostages. Coca-Cola’s task is to`,
            `save his friends and together defeat Baron Vender by going through 6`,
            `different platforming puzzles staged in the urban sprawl of Sodaopolis.`,
            `He and his friends have to use their abilities to break and move around`,
            `to get to the end of the stage while avoiding obstacles set by Baron Vender.`,
        ];

        for (let i = 0; i < stringArr.length; i++) {
            this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {
                position: new Vec2(size.x, size.y - 270 + i * 50),
                text: stringArr[i],
            });
        }

        let titleTwoText: String = "Cheat Codes provided in the in-game Help menu.";
        let titleTwo: Label = <Label>this.add.uiElement(
            UIElementType.LABEL,
            MenuLayers.HELP,
            {
                position: new Vec2(size.x - 220, size.y + 100),
                text: titleTwoText,
            }
        );
        titleTwo.textColor = Color.WHITE;

        // let cheatCodesList: Array<String> = ["enemy", "laser", "box"];
        // for (let i = 0; i < cheatCodesList.length; i++) {
        //     this.add.uiElement(UIElementType.LABEL, MenuLayers.HELP, {
        //         position: new Vec2(size.x - 20 + i * 150, size.y + 100),
        //         text: cheatCodesList[i],
        //     });
        // }

        // let enterText: String = "Enter Cheatcode:";

        // let enterLabel: Label = <Label>this.add.uiElement(
        //     UIElementType.LABEL,
        //     MenuLayers.HELP,
        //     {
        //         position: new Vec2(size.x - 200, size.y + 200),
        //         text: enterText,
        //     }
        // );

        // let inputBox: TextInput = <TextInput>this.add.uiElement(
        //     UIElementType.TEXT_INPUT,
        //     MenuLayers.HELP,
        //     {
        //         position: new Vec2(size.x + 175, size.y + 200),
        //         text: "",
        //     }
        // );
        // inputBox.setPadding(new Vec2(250, 7.5));
        // inputBox.backgroundColor = new Color(255, 255, 255);

        backBtn.backgroundColor = new Color(153, 217, 234, 1);
        backBtn.borderRadius = 0;
        backBtn.font = "Arial";
        backBtn.setPadding(new Vec2(50, 10));
        backBtn.onClickEventId = MainMenuEvent.MENU;
    }
}
