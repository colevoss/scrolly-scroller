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

    this.state = {
      scroll: true,
    };

    // this.scrollViewProps = {
    //   scrollEventThrottle: 16,
    //   onScroll: Animated.event(
    //     [
    //       {
    //         nativeEvent: { contentOffset: { y: this.anim } },
    //       },
    //     ],
    //     { useNativeDriver: true },
    //   ),
    // };
  }

  componentDidMount() {
    this.anim.addListener(({ value }) => (this.val = value));
  }

  onScroll = ({ nativeEvent }) => {
    const {
      contentOffset: { y },
    } = nativeEvent;

    if (y >= 200 && this.state.scroll) {
      this.setState({ scroll: false });

      return;
    }

    if (y < 200 && !this.state.scroll) {
      this.setState({ scroll: true });

      return;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ backgroundColor: 'pink', flex: 1, marginBottom: 20 }}
          scrollEventThrottle={16}
          contentInset={{ top: 20 }}
        >
          {arr.map((i) => {
            return <Text key={i}>Hello {i}</Text>;
          })}
        </ScrollView>
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
