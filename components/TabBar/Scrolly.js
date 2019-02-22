import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import TabBar from './TabBar';

const WIDTH = Dimensions.get('window').width;

export default class Scrolly extends React.Component {
  constructor(props) {
    super(props);

    this.scrollPage = 0;

    this.scrollView = React.createRef();
    this.scrollX = new Animated.Value(0);

    this.scrollY = new Animated.Value(0);
    this.scrollEvent = Animated.event(
      [
        {
          nativeEvent: { contentOffset: { y: this.scrollY } },
        },
      ],
      { useNativeDriver: true },
    );

    this.scrollViewRefs = this.props.tabs.map(React.createRef);

    this.scrollViewValues = this.props.tabs.map(() => 0);

    this.state = {
      tabBarHeight: 0,
      headerHeight: 0,
    };
  }

  generateScrollViewProps = (index) => {
    return {
      scrollEventThrottle: 16,

      onScroll: this.scrollEvent,

      contentContainerStyle: {
        paddingTop: this.state.headerHeight + this.state.tabBarHeight,
      },

      onScrollEndDrag: (event) => {
        if (event.nativeEvent.velocity.y !== 0) return;

        const scrollValue = event.nativeEvent.contentOffset.y;

        this.updateOtherScrollViews(index, scrollValue);
      },

      onMomentumScrollEnd: (event) => {
        const scrollValue = event.nativeEvent.contentOffset.y;
        this.updateOtherScrollViews(index, scrollValue);
      },

      ref: this.scrollViewRefs[index],
    };
  };

  updateOtherScrollViews(index, scrollValue) {
    const { headerHeight } = this.state;
    const { tabs } = this.props;

    for (let i = 0; i < tabs.length; i++) {
      if (i === index) continue;

      const scrollValueForTab = this.scrollViewValues[i];

      let newScrollValue = scrollValueForTab;

      if (scrollValue >= headerHeight) {
        newScrollValue = Math.max(scrollValueForTab, headerHeight);
      } else if (scrollValue < headerHeight && scrollValue > 0) {
        newScrollValue = Math.max(scrollValue, scrollValueForTab);
      } else if (scrollValue <= 0) {
        newScrollValue = 0;
      }

      this.getRefByIndex(i).current._component.scrollTo({
        x: 0,
        y: newScrollValue,
        animated: false,
      });

      this.scrollViewValues[i] = newScrollValue;
    }

    this.getRefByIndex(index).current._component.scrollTo({
      x: 0,
      y: scrollValue,
      animated: false,
    });
  }

  getRefByIndex(index) {
    return this.scrollViewRefs[index];
  }

  componentDidMount() {
    this.scrollX.addListener(({ value }) => {
      this.scrollPage = value / WIDTH;
    });

    this.scrollY.addListener(this.onScrollY);

    if (this.props.activeTabIndex !== 0) {
      this.scrollToTab(false);
    }
  }

  onScrollY = ({ value }) => {
    this.scrollViewValues[this.props.activeTabIndex] = value;
  };

  scrollToTab(animated = true) {
    this.scrollView.current._component.scrollTo({
      x: this.tabIndexToScrollValue(this.props.activeTabIndex),
      animated,
    });
  }

  componentDidUpdate(prevProps) {
    const { activeTabIndex } = this.props;

    if (activeTabIndex !== prevProps.activeTabIndex) {
      // this.scrollY.setValue(this.scrollViewValues[activeTabIndex]);
      this.scrollToTab();
    }
  }

  onMomentumScrollEnd = () => {
    this.props.onUpdateTab(this.scrollPage);
  };

  tabIndexToScrollValue = (index) => {
    return index * WIDTH;
  };

  onTabTap = (index) => {
    this.props.onUpdateTab(index);
  };

  onTabBarLayout = (layout) => {
    this.setState({ tabBarHeight: layout.height });
  };

  onHeaderLayout = (e) => {
    const { layout } = e.nativeEvent;

    this.setState({ headerHeight: layout.height });
  };

  renderScenes() {
    const { tabs } = this.props;

    return tabs.map((tab, i) => {
      return (
        <Animated.ScrollView
          style={styles.scene}
          key={tab.key}
          {...this.generateScrollViewProps(i)}
        >
          {Array(200)
            .fill(0)
            .map((_, i) => {
              return (
                <Text key={i}>
                  {tab.label} {i}
                </Text>
              );
            })}
        </Animated.ScrollView>
      );
    });
  }

  render() {
    const { tabs } = this.props;
    const { tabBarHeight, headerHeight } = this.state;

    const tabTransform = [
      {
        translateY: this.scrollY.interpolate({
          inputRange: [0, headerHeight],
          outputRange: [0, -headerHeight],
          extrapolate: 'clamp',
        }),
      },
    ];

    return (
      <View style={styles.container}>
        <Animated.ScrollView
          style={styles.scrollContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          ref={this.scrollView}
          scrollEventThrottle={16}
          bounces={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { x: this.scrollX } },
              },
            ],
            { useNativeDriver: true },
          )}
        >
          {this.renderScenes()}
        </Animated.ScrollView>

        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: tabTransform,
          }}
        >
          <View
            onLayout={this.onHeaderLayout}
            style={{
              height: 200,
              width: WIDTH,
              backgroundColor: 'lightgreen',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>HEADER</Text>
          </View>

          <TabBar
            scrollX={this.scrollX}
            scrollValue={this.scrollValue}
            onTabTap={this.onTabTap}
            tabs={tabs}
            onLayout={this.onTabBarLayout}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
  },

  scrollContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: WIDTH,
  },

  scene: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: WIDTH,
    // flex: 1,
    backgroundColor: 'lightblue',
  },
});
