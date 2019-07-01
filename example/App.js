import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  Alert,
} from 'react-native';

import LayoutAnimationProvider, { withLayoutAnimation } from './LayoutAnimationProvider';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    halfScreen: {
      flex: 1,
      borderWidth: 4,
    },
    heading: {
      position: 'absolute',
      width,
      backgroundColor: '#00000088',
      fontWeight: 'bold',
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      padding: 5,
    },
  },
);

class Collapsible extends React.Component {
  state = {
    collapsed: false,
  }
  onPress = (e) => {
    const {
      useLayoutAnimationProvider,
    } = this.props;
    const {
      collapsed,
    } = this.state;
    const nextState = {
      collapsed: !collapsed,
    };
    if (useLayoutAnimationProvider) {
      this.setStateWithAnimation(
        nextState,
      );
    } else {
      LayoutAnimation
        .configureNext(
          LayoutAnimation.Presets.spring,
        );
      this.setState(
        nextState,
      );
    }
  }
  render() {
    const {
      height,
      color: backgroundColor,
      ...extraProps
    } = this.props;
    const { collapsed } = this.state;
    return (
      <TouchableOpacity
        {...extraProps}
        style={{
          width,
          height: collapsed ? 0 : height,
          backgroundColor,
        }}
        onPress={this.onPress}
      />
    );
  }
};

Collapsible.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string.isRequired,
  useLayoutAnimationProvider: PropTypes.bool,
};

Collapsible.defaultProps = {
  height: 60,
  useLayoutAnimationProvider: true,
};

const LayoutAnimatable = withLayoutAnimation(
  Collapsible,
);

const prideColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const numberOfFlags = 20;

export default class App extends React.Component {
  __getFlag(useLayoutAnimationProvider = true) {
    return (
      <View
      >
      {[...Array(numberOfFlags)]
        .map(() => (
          <View
          >
            {prideColors
              .map(color => (
                <LayoutAnimatable
                  useLayoutAnimationProvider={useLayoutAnimationProvider}
                  color={color}
                />
              ))}
          </View>
        ))}
      </View>
    );
  }
  render() {
    return (
      <LayoutAnimationProvider
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.halfScreen}
          >
            {this.__getFlag(false)}
            <Text
              style={styles.heading}
              pointerEvents="none"
            >
              {'Without LayoutAnimationProvider'}
            </Text>
          </View>
          <View
            style={styles.halfScreen}
          >
            {this.__getFlag(true)}
            <Text
              style={styles.heading}
              pointerEvents="none"
            >
              {'With LayoutAnimationProvider'}
            </Text>
          </View>
        </View>
      </LayoutAnimationProvider>
    );
  }
};
