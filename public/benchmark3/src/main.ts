import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./FizzRun/Scenes/MainMenu";
import { FizzRun_Controls } from "./FizzRun/FizzRun_Controls";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 34, g: 32, b: 52},   // The color the game clears to
        inputs: [
            {name: FizzRun_Controls.MOVE_LEFT, keys: ["a"]},
            {name: FizzRun_Controls.MOVE_RIGHT, keys: ["d"]},
            {name: FizzRun_Controls.JUMP, keys: ["w", "space"]},
            {name: FizzRun_Controls.ATTACK, keys: ["e"]},
            {name: FizzRun_Controls.SWITCH, keys: ["f"]},
            {name: FizzRun_Controls.FIZZ, keys: ["x"]},
            {name: FizzRun_Controls.PAUSE_GAME, keys: ["escape"]},
            {name: FizzRun_Controls.RESTART_GAME, keys: ["6"]},
            {name: FizzRun_Controls.DISPLAY_CONTROLS, keys: ["7"]},
            {name: FizzRun_Controls.DISPLAY_HELP, keys: ["8"]},
            {name: FizzRun_Controls.MAIN_MENU, keys: ["9"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(MainMenu, {});
})();