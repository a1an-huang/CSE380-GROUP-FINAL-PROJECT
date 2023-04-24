/**
 * A set of events 
 */
export const FizzRun_Events = {
    // An event that tells the HW4 level to start. Has data: {}
    LEVEL_START: "LEVEL_START",
    // An event that tells the HW4 level to end. Has data: {}
    LEVEL_END: "LEVEL_END",

    // An event triggered when the player enters an area designated as a "level end" location. Had data: {}
    PLAYER_ENTERED_LEVEL_END: "PLAYER_ENTERED_LEVEL_END",

    PARTICLE_HIT_DESTRUCT: "PARTICLE_HIT_DESTRUCT",

    /**
     * The event that gets emitted when the player's health changes
     * Has data: { curhp: number, maxhp: number }
     */
    HEALTH_CHANGE: "HEALTH_CHANGE",

    // The event sent when the player dies. Gets sent after the player's death animation
    PLAYER_DEAD: "PLAYER_DEAD",
    // Switch event for switching current character
    PLAYER_SWITCH: "PLAYER_SWITCH",
    // Used for sugar but could use for other power ups
    PLAYER_POWERUP: "PLAYER_POWERUP",

    RESTART_GAME: "RESTART_GAME",
    MAIN_MENU: "MAIN_MENU",

    PLAYER_MENTOS_COLLISION: "PLAYER_MENTOS_COLLISION",
    PLAYER_ROBOT_COLLISION: "PLAYER_ROBOT_COLLISION",
    /**
     * Has data: { robotId: robot.id }
     */
    INKSACK_ROBOT_COLLISION: "INKSACK_ROBOT_COLLISION",

    /** 
     * The event that gets emitted when the player uses an inksack
     * Has data: { position: Vec2 }
     */
    ACTIVATE_INKSACK: "ACTIVATE_INKSACK",
    
    /**
     * The event that gets emitted when the player's fizz changes
     * Has data: { curfizz: number, maxfizz: number }
     */
    FIZZ_CHANGE: "FIZZ_CHANGE",

    /**
     * Has data: { debuffKey: String, debuffDurationSeconds: number, position: Vec2 }
     */
    PLACE_DEBUFF_ICON: "PLACE_DEBUFF_ICON",

    /**
     * Has data: { cheatCodeKey: String }
     */
    HANDLE_CHEAT_CODE: "HANDLE_CHEAT_CODE",
    
    OBSTACLE_DEATH: "OBSTACLE_DEATH",

    WATER_DEATH: "WATER_DEATH",
    
} as const;
