class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error('config');
        this.config = config;
        this.states = config.states;
        this.currentState = config.initial;
        this.history = [];
        this.undoHistory = [];
        return this;
    }
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states[state]) {
            this.history.push(this.currentState);
            this.currentState = state;
            this.undoHistory = [];
        } else {
            throw new Error('Wrong state name');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const curState = this.currentState;
        const evState = this.config.states[curState].transitions[event];
        if (evState) {
            this.history.push(curState);
            this.currentState = evState;
            this.undoHistory = [];
        } else {
            //console.log(this.states, "-------------------", this.states[curState], "=======================",
              //  this.states[curState].transitions);
            //console.log(evState, event);
            throw Error('Wrong event');
        }

        return this;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.config.initial;
        this.undoHistory = [];
        this.history = [];
        //this.history = [this.currentState];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = Object.keys(this.states)
        if (!event) {
            return states;
        }
        let statesWithEvent = [];
        states.forEach(state => {
            if (this.states[state].transitions[event]) statesWithEvent.push(state);
        })

        return statesWithEvent;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length == 0) {
            return false;
        }
        let cur = this.currentState;
        this.undoHistory.push(cur);

        this.currentState = this.history.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoHistory.length == 0) { return false; }
        this.history.push(this.currentState);
        this.currentState = this.undoHistory.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undoHistory = [];
        this.history = [];

    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

/*const config1 = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

let fsm = new FSM(config1);
console.log('state:', fsm.currentState, '   hist:', fsm.history, '   undo:', fsm.undoHistory);
//fsm.changeState('normal');
//console.log('state:',fsm.currentState,'   hist:',fsm.history,'   undo:', fsm.undoHistory);
fsm.trigger('study');
console.log('state:', fsm.currentState, '   hist:', fsm.history, '   undo:', fsm.undoHistory);

fsm.undo();
console.log('state:', fsm.currentState, '   hist:', fsm.history, '   undo:', fsm.undoHistory);

fsm.redo();
console.log('state:', fsm.currentState, '   hist:', fsm.history, '   undo:', fsm.undoHistory);

*/