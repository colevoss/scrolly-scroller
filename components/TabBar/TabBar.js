import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollView: {
    flex: 0,
    width: '100%',
  },

  tabContainer: {
    flexDirection: 'row',
  },

  tabUnderline: {
    position: 'absolute',
    height: 5,
    backgroundColor: 'black',
    bottom: 0,
    width: 1,
  },

  tab: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 5,
  },
});

export default class TabBar extends React.Component {
  state = {
    width: null,
  };

  constructor(props) {
    super(props);

    this.tabMeasurements = [];
    this.widthTabUnderline = new Animated.Value(0);
    this.leftTabUnderline = new Animated.Value(0);
    this.underlineStyles = {
      transform: [
        { translateX: this.leftTabUnderline },
        {
          scaleX: this.widthTabUnderline,
        },
      ],
    };
  }

  componentDidMount() {
    this.props.scrollX.addListener(({ value }) => {
      this.updateAnimatedValues(value);
    });
  }

  createOnTabLayout = (index) => (e) => {
    this.tabMeasurements[index] = e.nativeEvent.layout;

    if (this.props.tabs.length === index + 1) {
      this.updateAnimatedValues();
    }
  };

  onContainerLayout = (e) => {
    const { layout } = e.nativeEvent;

    this.setState({ width: layout.width });

    this.containerLayout = layout;

    if (this.props.onLayout) {
      this.props.onLayout(this.containerLayout);
    }
  };

  onTabContainerLayout = (e) => {
    const { layout } = e.nativeEvent;

    this.tabContainerLayout = layout;
  };

  updateAnimatedValues(scrollX = 0) {
    const value = scrollX / WIDTH;
    const activeTabIndex = Math.floor(value);
    const offset = value % 1;

    const tabMeasurement = this.tabMeasurements[activeTabIndex];

    if (!tabMeasurement) return null;

    const { x, width } = tabMeasurement;

    if (activeTabIndex === this.props.tabs.length - 1) {
      const leftCoord = x + width / 2;
      this.widthTabUnderline.setValue(width);
      this.leftTabUnderline.setValue(leftCoord);

      return;
    }

    const nextCoord = this.tabMeasurements[activeTabIndex + 1];

    const { x: nextX, width: nextWidth } = nextCoord;

    const newWidth = width + -((width - nextWidth) * offset);
    const newX = x + -((x - nextX) * offset);

    const newLeftCoord = newX + newWidth / 2;

    this.widthTabUnderline.setValue(newWidth);
    this.leftTabUnderline.setValue(newLeftCoord);
  }

  renderTab = (tab, i) => {
    return (
      <TouchableOpacity
        activeOpacity={0.3}
        style={styles.tab}
        onPress={() => this.props.onTabTap(i)}
        key={tab.key}
        onLayout={this.createOnTabLayout(i)}
      >
        <Text>{tab.label}</Text>
      </TouchableOpacity>
    );
  };

  getUnderlineStyles() {
    const style = {
      transform: [
        { translateX: this.leftTabUnderline },
        {
          scaleX: this.widthTabUnderline,
        },
      ],
    };

    return style;
  }

  render() {
    const { tabs } = this.props;
    const { width } = this.state;

    return (
      <View
        onLayout={this.onContainerLayout}
        style={{ width: width ? width : WIDTH, backgroundColor: 'white' }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={styles.tabContainer}
            onLayout={this.onTabContainerLayout}
          >
            {tabs.map(this.renderTab)}

            <Animated.View
              style={[styles.tabUnderline, this.underlineStyles]}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
