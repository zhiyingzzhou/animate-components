// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import shallowCompare from 'react-addons-shallow-compare';

type Props = {
  duration: string,
  timingFunction: string,
  delay: string,
  direction: string,
  iterations: string,
  backfaceVisible: string,
  fillMode: string,
  playState: string,
  children: React$Element<*>
};

type DefaultProps = {
  duration: string,
  timingFunction: string,
  delay: string,
  direction: string,
  iterations: string,
  backfaceVisible: string,
  fillMode: string,
  playState: string
};

type State = {
  styles: Object
};

/**
 * High Order Component
 * @param {string} componentName - Name of the animation component
 * @param {string} keyframes - Keyframes defined for the animation
 */
let HOC = (ComposedComponent: string, AnimationName: string) => class
  extends Component<DefaultProps, Props, State> {
  state = {
    styles: {}
  };

  static propTypes = {
    direction: PropTypes.oneOf([
      "normal",
      "reverse",
      "alternate",
      "alternate-reverse",
      "initial",
      "inherit"
    ]),
    fillMode: PropTypes.oneOf(["none", "forwards", "backwards", "both"]),
    playState: PropTypes.oneOf(["paused", "running"]),
    timingFunction: PropTypes.oneOf([
      "linear",
      "ease",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "step-start",
      "step-end",
      "steps(int, start|end)",
      "cubic-bezier(n,n,n,n)"
    ]),
    backfaceVisible: PropTypes.oneOf(["visible", "hidden"]),
    children: (props, propName, componentName) => {
      let prop = props[propName];

      if (React.Children.count(prop) === 0) {
        return new Error(
          `${ComposedComponent} should have atleast a single child element to perform the animation.`
        );
      } else { return; }
    }
  };

  static defaultProps = {
    duration: "1s",
    timingFunction: "ease",
    delay: "0s",
    direction: "normal",
    iterations: "1",
    backfaceVisible: "visible",
    fillMode: "none",
    playState: "running"
  };

  componentDidMount = () => {
    this.store(this.props);
  };

  store = (props: Props) => {
    const {
      duration,
      timingFunction,
      delay,
      direction,
      iterations,
      backfaceVisible,
      fillMode,
      playState
    } = props;

    this.setState({
      styles: {
        // All the animations have vendor prefixes so just simply setState.
        animation: `
            ${AnimationName} ${duration} ${timingFunction} ${delay} ${iterations} ${direction}
            ${fillMode} ${playState}
          `,
        backfaceVisibility: `${backfaceVisible}`
      }
    });
  };

  // Avoid re-render (Performance bottleneck)
  shouldComponentUpdate = (nextProps: Props, nextState: State) => {
    return shallowCompare(this, nextProps, nextState);
  }

  renderRootWithBlock = (): ?React$Element<*> => {
    const styles = Object.assign({}, this.state.styles, {
      display: "block"
    });
    return (
      <div style={styles}>
        {this.props.children}
      </div>
    );
  };

  renderRootWithInline = (): ?React$Element<*> => {
    const styles = Object.assign({}, this.state.styles, {
      display: "inline-block"
    });

    return (
      <span style={styles}>
        {this.props.children}
      </span>
    );
  };

  render(): ?React$Element<*> {
    return this.props.block
      ? this.renderRootWithBlock()
      : this.renderRootWithInline();
  }
};

export default HOC;
