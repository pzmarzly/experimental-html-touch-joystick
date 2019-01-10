const DEBUG = true;

class Control {
    constructor(type, id, updateStateCallback) {
        this.element = document.createElement('div');
        this.element.className = 'control ' + type;
        this.element.style.gridArea = id;
        // this.element.id = id;
        this.element.addEventListener('touchstart', this.onTouch.bind(this), false);
        this.element.addEventListener('touchmove', this.onTouch.bind(this), false);
        this.element.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        this.gridArea = id;
        this.updateStateCallback = updateStateCallback;
    }
    onTouch() {
        console.warn('Virtual function called!');
    }
    onTouchEnd() {
        console.warn('Virtual function called!');
    }
    state() {
        console.warn('Virtual function called!');
    }
}

class Joystick extends Control {
    constructor(id, updateStateCallback) {
        super('joystick', 'j' + id, updateStateCallback);
    }
    state() {
        return '0,0';
    }
}

class Button extends Control {
    constructor(id, updateStateCallback) {
        super('button', 'b' + id, updateStateCallback);
        this._state = 0;
    }
    onTouch() {
        this._state = 1;
        this.updateStateCallback();
    }
    onTouchEnd() {
        this._state = 0;
        this.updateStateCallback();
    }
    state() {
        return this._state.toString();
    }
}

class Joypad {
    constructor() {
        let updateStateCallback = this.updateState.bind(this);

        this.controls = [
            new Joystick('l', updateStateCallback),
            new Joystick('r', updateStateCallback),
        ];
        for (let i = 1; i <= 32; i++) {
            this.controls.push(new Button(i, updateStateCallback));
        }

        let joypad = document.getElementById('joypad');
        let gridAreas = getComputedStyle(joypad)
            .gridTemplateAreas
            .split('"').join('')
            .split(' ')
            .filter(x => x != '' && x != '.');
        this.controls.forEach(control => {
            if (gridAreas.includes(control.gridArea)) {
                joypad.appendChild(control.element);
            }
        });

        if (DEBUG) {
            this.debugLabel = new Control('debug', 'dbg');
            joypad.appendChild(this.debugLabel.element);
        }
    }
    updateState() {
        let state = this.controls.map(control => control.state()).join(',');
        if (DEBUG) {
            this.debugLabel.element.innerHTML = state;
        }
        // console.log(state);
    }
}

window.addEventListener('load', () => new Joypad());