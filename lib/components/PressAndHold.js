import React from 'react';

const T = React.PropTypes;

export default class PressAndHold extends React.Component {
  static propTypes = {
    children: T.oneOfType([T.func, T.element]).isRequired,
    duration: T.number,
    onHoldComplete: T.func,
  };

  static defaultProps = {
    duration: 3000,
    onHoldComplete: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      currentHoldLength: 0,
      hold: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;

    // if the child is not a function, it does not need to update during the
    // duration of the hold.
    if (typeof this.props.children !== 'function') return false;

    // if the child is a function, it only needs to update during presses
    return nextState.currentHoldLength !== this.state.currentHoldLength;
  }

  handleMouseDown(e, child) {
    // keep a copy of the target
    const target = e.target;

    // if the child has a handler defined for this event, call it
    if (child.props.onMouseDown) child.props.onMouseDown(e);

    // indicate that we're starting a hold
    this.setState({hold: true});

    // in a new callstack, run the hold timer
    setTimeout(() => {
      this.runTimer(new Date().getTime(), new Date().getTime(), target);
    }, 0);
  }

  handleMouseUp(e, child) {
    // if the child has a handler defined for this event, call it
    if (child.props.onMouseUp) child.props.onMouseUp(e);

    // kill the hold timer we have running
    this.endTimer();
  }

  runTimer(start, current, target) {
    // if we're not in a hold state, return
    if (!this.state.hold) return;

    if (current - start >= this.props.duration) { // the hold is complete
      this.setState({currentHoldLength: this.props.duration});
      this.props.onHoldComplete(target);
    } else {
      this.setState({currentHoldLength: current - start});
      requestAnimationFrame(() => this.runTimer(start, new Date().getTime(), target));
    }
  }

  endTimer() {
    this.setState({currentHoldLength: 0, hold: false});
  }

  render() {
    const { duration, children } = this.props;
    const { currentHoldLength } = this.state;
    const perCentComplete = Math.min(currentHoldLength / duration, 1);
    const child = typeof children === 'function' ? children(perCentComplete) : children;

    // instead of wrapping the child in a DOM element, clone the child and
    // return the close instead, but with its props merged with our callbacks
    return React.cloneElement(React.Children.only(child), {
      onMouseDown: e => this.handleMouseDown(e, child),
      onMouseUp: e => this.handleMouseUp(e, child),
    });
  }
}
