import React, { Component } from 'react';
import './App.css';

const items = [
    "Test 1",
    "Test 2",
    "Test 3",
];

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="list">
                    {items.map((item, index) => (
                        <Item key={index} className="item">
                            {item}
                        </Item>
                    ))}
                </div>
            </div>
        );
    }
}

export default App;

class Item extends React.Component {
    // DOM refs
    item = null;
    
    // Drag
    swipeStartX = null;
    isSwipping = false;
    shift = 0;

    // FPS limit
    startTime = null;
    fpsInterval = 1000 / 60;

    componentDidMount() {
        console.log(this.item);
    }
    handleSwipeStart = (event) => {
        console.log("Swipe start");
        this.swipeStartX = event.clientX;
        this.isSwipping = true;
        this.startTime = Date.now();
        window.addEventListener("mouseup", this.handleSwipeStop);
        window.addEventListener("mousemove", this.handleSwipping);
        requestAnimationFrame(this.updatePosition);
    }
    handleSwipeStop = (event) => {
        console.log("Swipe stop");
        this.isSwipping = false;
        // Animate only when item was shifted
        if(Math.abs(this.shift) > 0) {
            this.item.classList.add('returning');
        }
        this.shift = 0;
        this.item.style.transform = `translateX(${this.shift}px)`;
        window.removeEventListener("mouseup", this.handleSwipeStop);
        window.removeEventListener("mousemove", this.handleSwipping);
    }
    handleSwipping = (event) => {
        this.shift = event.clientX - this.swipeStartX < 0 ? event.clientX - this.swipeStartX : 0;
    }
    handleTransitionEnd = (event) => {
        this.item.classList.remove('returning');
    }
    updatePosition = () => {
        if(this.isSwipping) requestAnimationFrame(this.updatePosition);
        const now = Date.now();
        const elapsed = now - this.startTime;
        if (this.isSwipping && elapsed > this.fpsInterval) {
            this.startTime = Date.now();
            this.item.style.transform = `translateX(${this.shift}px)`;
        }
    }
    render() {
        const { children, className } = this.props;
        return(
            <div
                ref={(element => this.item = element)}
                className={`${className} listItem`}
                onMouseDown={this.handleSwipeStart}
                onTransitionEnd={this.handleTransitionEnd}
            >
                {children}
            </div>
        );
    }
}