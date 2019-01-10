const DEBUG_MSG_LABEL = true;

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
        this._stateX = 0.5;
        this._stateY = 0.5;
        this.locking = false;
    }
    onTouch(ev) {
        let pos = ev.targetTouches[0];
        let offset = this.element.getBoundingClientRect();
        this._stateX = this._truncate((pos.pageX - offset.x) / offset.width);
        this._stateY = this._truncate((pos.pageY - offset.y) / offset.height);
        this.updateStateCallback();
    }
    _truncate(f) {
        if (f < 0) return 0;
        if (f > 1) return 1;
        return f;
    }
    onTouchEnd() {
        if (!this.locking) {
            this._stateX = 0.5;
            this._stateY = 0.5;
            this.updateStateCallback();
        }
    }
    state() {
        return this._stateX.toString() + ',' + this._stateY.toString();
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

        if (DEBUG_MSG_LABEL) {
            this.debugLabel = new Control('debug', 'dbg');
            this.debugLabel.element.style.wordWrap = "break-word";
            joypad.appendChild(this.debugLabel.element);
        }
    }
    updateState() {
        let state = this.controls.map(control => control.state()).join(',');
        if (DEBUG_MSG_LABEL) {
            this.debugLabel.element.innerHTML = state;
        }
        // console.log(state);
    }
}

window.addEventListener('load', () => new Joypad());