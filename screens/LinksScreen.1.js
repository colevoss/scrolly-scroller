import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Animated,
  StyleSheet,
  PanResponder,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

const HEADER_HEIGHT = 300;

const arr = Array(100)
  .fill(0)
  .map((_, i) => i);

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  constructor(props) {
    super(props);

    this.anim = new Animated.Value(0);
    this.val = 0;

    this.scrollViewProps = {
      scrollEventThrottle: 16,
      onScroll: Animated.event(
        [
          {
            nativeEvent: { contentOffset: { y: this.anim } },
          },
        ],
        { useNativeDriver: true },
      ),
    };
  }

  componentDidMount() {
    this.anim.addListener(({ value }) => (this.val = value));
  }

  render() {
    const scrollerStyle = {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      transform: [
        {
          translateY: this.anim.interpolate({
            inputRange: [0, HEADER_HEIGHT],
            outputRange: [HEADER_HEIGHT, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    const headerStyle = {
      height: HEADER_HEIGHT,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,

      opacity: this.anim.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),

      transform: [
        {
          translateY: this.anim.interpolate({
            inputRange: [0, HEADER_HEIGHT],
            outputRange: [0, -HEADER_HEIGHT],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    return (
      <View style={styles.container}>
        <Animated.ScrollView
          {...this.scrollViewProps}
          contentContainerStyle={{ marginTop: HEADER_HEIGHT }}
        >
          {arr.map((i) => {
            return (
              <View key={i} style={styles.item}>
                <Text>Item {i}</Text>
              </View>
            );
          })}
        </Animated.ScrollView>

        <Animated.View style={headerStyle}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity>
              <Text>HEADER</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 15,
  },

  item: {
    padding: 16,
  },
});
