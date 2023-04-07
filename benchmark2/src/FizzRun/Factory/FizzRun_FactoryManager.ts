import Graphic from "../../Wolfie2D/Nodes/Graphic";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Tilemap from "../../Wolfie2D/Nodes/Tilemap";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import FactoryManager from "../../Wolfie2D/Scene/Factories/FactoryManager";
import FizzRun_AnimatedSprite from "../Nodes/FizzRun_AnimatedSprite";
import FizzRun_Level, { FizzRun_Layers } from "../Scenes/FizzRun_Level";
import FizzRun_CanvasNodeFactory from "./FizzRun_CanvasNodeFactory";

/**
 * An extension of Wolfie2ds FactoryManager. I'm creating a more specific factory for my custom HW3Level. If you want to get custom
 * GameNodes into your scenes (with more specific properties) you'll have to extend the factory classes.
 */
export default class FizzRun_FactoryManager extends FactoryManager {

    private fizzrunCanvasNodeFactory: FizzRun_CanvasNodeFactory;

    public constructor(scene: FizzRun_Level, tilemaps: Tilemap[]) {
        super(scene, tilemaps)
        this.fizzrunCanvasNodeFactory = new FizzRun_CanvasNodeFactory();
        this.fizzrunCanvasNodeFactory.init(scene);
    }

    public animatedSprite(key: string, layerName: FizzRun_Layers): FizzRun_AnimatedSprite {
        return this.fizzrunCanvasNodeFactory.addAnimatedSprite(key, layerName);
    }

    public uiElement(type: string, layerName: FizzRun_Layers, options?: Record<string, any>): UIElement {
        return super.uiElement(type, layerName, options);
    }

    public graphic(type: string, layerName: FizzRun_Layers, options?: Record<string, any>): Graphic {
        return super.graphic(type, layerName, options);
    }

    public sprite(key: string, layerName: FizzRun_Layers): Sprite {
        return super.sprite(key, layerName);
    }
}