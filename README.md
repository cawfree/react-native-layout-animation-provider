# react-native-layout-animation-provider
A React Native &lt;Provider/> for synchronizing your LayoutAnimations.

<p align="center">
  <img src="./bin/demo.gif" alt="react-native-layout-animation-provider" width="600" height="1200">
</p>

## 🤔 What is this for?
React Native [`LayoutAnimation`](https://facebook.github.io/react-native/docs/layoutanimation)s can be tricky. Depending on your application state, you may find multiple child components competing for the next call to `configureNext()`, which has adverse effects on the animated result; resulting animations can be choppy, since your application has to work through multiple competing animations.

The `LayoutAnimationProvider` exported by this library can be used to de-dup multiple competing attempts to execute the next layout animation; at its root, you define one `animationConfig` to transition all nested children who have registered themselves using `withLayoutAnimation`.

To execute an animation, a child consumer simply makes a call to the injected `setStateWithAnimation` mixin, which is appended to the class `prototype` when wrapped with `withLayoutAnimation`. Finally, instead of using `setState` to trigger a layout animation, just replace the call with `setStateWithAnimation`.

Used in:
[react-native-windowed-collapsible](https://github.com/cawfree/react-native-windowed-collapsible)

## 🚀 Getting Started
Using [npm](https://www.npmjs.com/package/@cawfree/react-native-layout-animation-provider)
```bash
npm install --save @cawfree/react-native-layout-animation-provider
```

Using [yarn](https://www.npmjs.com/package/@cawfree/react-native-layout-animation-provider):
```bash
yarn add @cawfree/react-native-layout-animation-provider
```

## ✍️ Example
You can execute the example below by heading into the `/example` directory and executing either:

```bash
react-native run-android # for android
react-native run-ios # for ios
```
_This library is not compatible with [React Native Web](), as support for LayoutAnimation is a little patchy._

```javascript
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

import LayoutAnimationProvider, { withLayoutAnimation } from '@cawfree/react-native-layout-animation-provider';

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
```

## 📌 Prop Types

| Name            | Data Type           | Required | Default                        | Description                                                                                                                                                    |
|-----------------|---------------------|----------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| animationConfig | PropTypes.shape({}) | false    | LayoutAnimation.Presets.spring | The type of LayoutAnimation to perform for all children wrapped using  `withLayoutAnimation`.                                                                  |
| debounce        | PropTypes.number    | false    | 200                            | The number of milliseconds to debounce successive calls to setStateWithAnimation before the `LayoutAnimationProvider` attempts to `configureNext()` animation. |

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://www.buymeacoffee.com/cawfree">
    <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy @cawfree a coffee" width="232" height="50" />
  </a>
</p>
