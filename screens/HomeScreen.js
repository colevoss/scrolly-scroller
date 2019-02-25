import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  SafeAreaView,
  Animated,
  FlatList,
  SectionList,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import Scrolly from '../components/TabBar/Scrolly';

const AnimatedFlatLIst = Animated.createAnimatedComponent(FlatList);
const AniamtedSectionLIst = Animated.createAnimatedComponent(SectionList);

import { MonoText } from '../components/StyledText';

const tabs = [
  {
    key: 'tab1',
    label: 'Projects',
  },
  {
    key: 'tab2',
    label: 'Photos',
  },
  {
    key: 'tab3',
    label: 'Activity yeap!!!!!!',
  },
  {
    key: 'tab4',
    label: 'Activity yeap',
  },
];

const dataArray = Array(200)
  .fill(0)
  .map((_, i) => i);

const data = dataArray.map((i) => {
  return <Text key={i}>{i}</Text>;
});

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.val = new Animated.Value(0);
  }

  state = {
    activeTab: 0,
  };

  updateTab = (activeTab) => {
    // console.log({ activeTab });
    this.setState(() => ({
      activeTab,
    }));
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Scrolly
          tabs={tabs}
          animValue={this.val}
          activeTabIndex={this.state.activeTab}
          onUpdateTab={this.updateTab}
          header={({ onLayout, height }) => {
            return (
              <View
                onLayout={onLayout}
                style={{
                  height: 300,
                  opacity: this.val.interpolate({
                    inputRange: [0, height],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  }),
                  width: '100%',
                  backgroundColor: 'lightgreen',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text>HEADER</Text>
              </View>
            );
          }}
        >
          <Animated.ScrollView tab={{ key: 'tab1', label: 'ScrollView 1' }}>
            {data}
          </Animated.ScrollView>

          <AnimatedFlatLIst
            tab={{ key: 'tabr', label: 'FlatList' }}
            keyExtractor={(i) => i.toString()}
            data={dataArray}
            renderItem={({ item }) => {
              return <Text>{item}</Text>;
            }}
          />

          {/* <AniamtedSectionLIst
            tab={{ key: 'tabsection', label: 'Sectione' }}
            renderItem={({ item, index, section }) => (
              <Text style={{ paddingVertical: 10 }} key={index}>
                {item}
              </Text>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            )}
            sections={[
              { title: 'Title1', data: ['item1', 'item2'] },
              { title: 'Title2', data: ['item3', 'item4'] },
              { title: 'Title3', data: ['item5', 'item6'] },
              { title: 'Title4', data: ['item5', 'item6'] },
              { title: 'Title5', data: ['item5', 'item6'] },
              { title: 'Title6', data: ['item5', 'item6'] },
              { title: 'Title7', data: ['item5', 'item6'] },
              { title: 'Title7', data: ['item5', 'item6'] },
            ]}
            keyExtractor={(item, index) => item + index}
          /> */}

          <Animated.ScrollView tab={{ key: 'tab2', label: 'ScrollView 2' }}>
            {data}
          </Animated.ScrollView>
        </Scrolly>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 60,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
