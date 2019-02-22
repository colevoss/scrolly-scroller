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

    this.scrollY = this.props.animValue || new Animated.Value(0);

    this.scrollEvent = Animated.event(
      [
        {
          nativeEvent: { contentOffset: { y: this.scrollY } },
        },
      ],
      { useNativeDriver: true },
    );

    const tabs = this.tabsData();
    this.scrollViewRefs = tabs.map(React.createRef);

    this.scrollViewValues = tabs.map(() => 0);

    this.state = {
      tabBarHeight: 0,
      headerHeight: 0,
    };
  }

  tabsData() {
    return React.Children.map(this.props.children, (child) => {
      return child.props.tab;
    });
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
    const tabs = this.tabsData();

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

      this.scrollComponentByIndex(i, newScrollValue);
      this.scrollViewValues[i] = newScrollValue;
    }

    this.scrollComponentByIndex(index, scrollValue);
  }

  getRefByIndex(index) {
    return this.scrollViewRefs[index];
  }

  scrollComponentByIndex(index, scrollValue) {
    const component = this.getRefByIndex(index).current._component;

    if (component.scrollTo) {
      component.scrollTo({
        x: 0,
        y: scrollValue,
        animated: false,
      });
    } else {
      component.scrollToOffset({
        offset: scrollValue,
        animated: false,
      });
    }
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
    return React.Children.map(this.props.children, (child, i) => {
      return React.cloneElement(child, {
        style: styles.scene,
        ...this.generateScrollViewProps(i),
      });
    });
  }

  render() {
    const { headerHeight } = this.state;
    const interpolatedYValue = this.scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp',
    });

    const tabTransform = [
      {
        translateY: interpolatedYValue,
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
          {this.props.header({
            onLayout: this.onHeaderLayout,
            height: headerHeight,
          })}

          <TabBar
            scrollX={this.scrollX}
            scrollValue={this.scrollValue}
            onTabTap={this.onTabTap}
            tabs={this.tabsData()}
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
