import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { debounce } from 'lodash';

const LayoutAnimationContext = React.createContext(
  null,
);

export const withLayoutAnimation = AnimationConsumer => class LayoutAnimationConsumer extends React.Component {
  static contextType = LayoutAnimationContext;
  render() {
    const {
      requestSync,
      // TODO: some props here
    } = this.context;
    Object.assign(
      AnimationConsumer.prototype,
      {
        setStateWithAnimation(nextState, onRenderFinish) {
          return new Promise((resolve) => {
            return requestSync(
              () => this.setState(
                nextState,
                onRenderFinish,
              ),
            );
          })
            .then(onRenderFinish);
        },
      },
    );
    return (
      <AnimationConsumer
        {...this.props}
      />
    );
  }
};

class LayoutAnimationProvider extends React.Component {
  constructor(props) {
    super(props);
    const {
      debounce: debounceRate,
    } = props;
    this.requests = [];
    this.__requestSync = this.__requestSync.bind(this);
    this.__executeSync = debounce(
      this.__executeSync,
      debounceRate,
      {
        trailing: true,
      },
    );
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  __requestSync(fn) {
    this.requests.push(fn);
    this.__executeSync();
  }
  __executeSync() {
    const { animationConfig } = this.props;
    LayoutAnimation.configureNext(
      animationConfig,
    );
    this.requests.map(fn => fn());
    this.requests = [];
  }
  render() {
    const {
      children,
      ...extraProps
    } = this.props;
    return (
      <LayoutAnimationContext.Provider
        value={{
          requestSync: this.__requestSync,
        }}
      >
      {children}
      </LayoutAnimationContext.Provider>
    );
  }
}

LayoutAnimationProvider.propTypes = {
  animationConfig: PropTypes.shape({}),
  debounce: PropTypes.number,
};

LayoutAnimationProvider.defaultProps = {
  animationConfig: LayoutAnimation.Presets.spring,
  debounce: 200,
};

export default LayoutAnimationProvider;
