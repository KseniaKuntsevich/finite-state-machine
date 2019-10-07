class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.state = config.initial;
        this.states = config.states;
        this.history = [this.state];
        this.currentStage = 0;
        this.statesList = [];
        this.eventsStates = {};

        for(let state in this.states) {
            this.statesList.push(state);

            for(let key in this.states[state]['transitions']) {
                if(this.eventsStates[key]){ 
                    this.eventsStates[key].push(state);
                } else { 
                    this.eventsStates[key] = [state];
                }
            }
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!this.states[state]) {
            throw new Error ('Not correct state');
            return;
        }

        this.state = state;
        this.currentStage++;
        this.history[this.currentStage] = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let state = this.states[this.state]['transitions'][event];

        if(!state){
            throw new Error('Not correct event');
            return;
        } 

        this.changeState(state);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.history[0])
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(!arguments.length) return this.statesList;

        if(this.eventsStates[event]) return this.eventsStates[event];

        return [];
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
       let prev = this.history[this.currentStage - 1];

       if(!prev) return false;

       this.state = prev;
       this.currentStage--;
       return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let second = this.history[this.currentStage + 1];

        if(!second) return false;

        this.state = second;
        this.currentStage++;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.state];
        this.currentStage = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/