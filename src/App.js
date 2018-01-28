import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {EventEmitter} from 'events';
import {Dispatcher} from 'flux';

const AppDispatcher = new Dispatcher();
const CHANGE_EVENT = 'CHANGE';

let _count = 0;

const CounterStore = Object.assign({}, EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getCount() {
        return _count;
    }

});

AppDispatcher.register(action => {
    if (action.type === 'INCREMENT') {
        _count++;
        CounterStore.emitChange();
    }
    else if (action.type === 'DECREMENT') {
        _count--;
        CounterStore.emitChange();
    }
});

function increment() {
    AppDispatcher.dispatch({
        type: 'INCREMENT'
    });
}

function decrement() {
    AppDispatcher.dispatch({
        type: 'DECREMENT'
    });
}

class Counter extends Component {
    constructor() {
        super();
        this.state = this.getStateFromFlux();
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        CounterStore.addChangeListener(this.updateState);
    }

    componentWillUnmount() {
        CounterStore.removeChangeListener(this.updateState);
    }


    getStateFromFlux() {
        return {
            count: CounterStore.getCount()
        };
    }

    updateState() {
        this.setState(this.getStateFromFlux());
    }

    render() {
        return (
            <div>
                <button onClick={decrement}>-</button>
                {this.state.count}
                <button onClick={increment}>+</button>
            </div>


        );
    }
}

class App extends Component {
    render() {
        return (
            <div>
            <Counter/>
            <button onClick={increment}>PLUS</button>
            </div>
        );
    }
}

export default App;
