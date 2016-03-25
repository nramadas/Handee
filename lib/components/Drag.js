import React from 'react';

const T = React.PropTypes;

export default class Drag extends React.Component {
  static propTypes = {
    children: T.func.isRequired,
    start: T.object.isRequired,
  };

  constructor(props) {
    super(props);

    if (typeof props.children !== 'function') {
      throw new Error('Children of Drag must be a function');
    }

    this.state = {
      grabbed: false,
      baseX: props.start.x,
      baseY: props.start.y,
      startX: 0,
      startY: 0,
      newX: props.start.x,
      newY: props.start.y,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) return true;
    return (nextState.newX !== this.state.newX || nextState.newY !== this.state.newY);
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleMouseMove);
  }

  handleMouseDown(event, child) {
    event.stopPropagation();

    // if the child has a handler defined for this event, call it
    if (child.props.onMouseDown) child.props.onMouseDown(e);
    const e = event.nativeEvent;
    const { clientX, clientY } = e.touches && e.touches.length ? e.touches[0] : e;

    this.setState({
      grabbed: true,
      startX: clientX,
      startY: clientY,
    });
  }

  handleMouseMove = e => {
    if (!this.state.grabbed) return;
    e.stopPropagation();

    const { clientX, clientY } = e.touches && e.touches.length ? e.touches[0] : e;

    this.setState({
      newX: this.state.baseX + clientX - this.state.startX,
      newY: this.state.baseY + clientY - this.state.startY,
    });
  }

  handleMouseUp(e, child) {
    e.stopPropagation();

    // if the child has a handler defined for this event, call it
    if (child.props.onMouseUp) child.props.onMouseUp(e);

    this.setState({
      grabbed: false,
      startX: 0,
      startY: 0,
      baseX: this.state.newX,
      baseY: this.state.newY,
    });
  }

  handleTouchStart(e, child) {
    // if the child has a handler defined for this event, call it
    if (child.props.onTouchStart) child.props.onTouchStart(e);

    // kill the event, and interpret it as a mouse event instead
    e.stopPropagation();
    e.preventDefault();
    this.handleMouseDown(e, child);
  }

  handleTouchEnd(e, child) {
    // if the child has a handler defined for this event, call it
    if (child.props.onTouchEnd) child.props.onTouchEnd(e);

    // kill the event, and interpret it as a mouse event instead
    e.stopPropagation();
    e.preventDefault();
    this.handleMouseUp(e, child);
  }

  handleTouchCancel(e, child) {
    // if the child has a handler defined for this event, call it
    if (child.props.onTouchCancel) child.props.onTouchCancel(e);

    // kill the event, and interpret it as a mouse event instead
    e.stopPropagation();
    e.preventDefault();
    this.handleMouseUp(e, child);
  }

  handleTouchMove = e => {
    // kill the event, and interpret it as a mouse event instead
    e.stopPropagation();
    e.preventDefault();
    this.handleMouseMove(e);
  }

  render() {
    const { children } = this.props;
    const { newX, newY } = this.state;
    const child = children(newX, newY);

    // instead of wrapping the child in a DOM element, clone the child and
    // return the close instead, but with its props merged with our callbacks
    return React.cloneElement(React.Children.only(child), {
      onMouseDown: e => this.handleMouseDown(e, child),
      onMouseUp: e => this.handleMouseUp(e, child),
      onTouchStart: e => this.handleTouchStart(e, child),
      onTouchEnd: e => this.handleTouchEnd(e, child),
      onTouchCancel: e => this.handleTouchCancel(e, child),
    });
  }
}
