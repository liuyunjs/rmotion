/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { Text, Button, ScrollView } from 'react-native';
import * as animations from './library/animations/main';
import { RMotionView, AnimatePresence } from './library/main';
import { keys } from './library/animations/utils';
const animationKeys = keys(animations);
const App = () => {
  const [animation, setAnimation] = React.useState<keyof typeof animations>(
    animationKeys[0],
  );
  const [visible, setVisible] = React.useState(true);

  return (
    <ScrollView style={{ paddingVertical: 44 }}>
      <Button
        title="切换"
        onPress={() => {
          setVisible(!visible);
          const index = animationKeys.indexOf(animation) + 1;
          setAnimation(animationKeys[index % animationKeys.length]);
        }}
      />

      <AnimatePresence>
        {visible && (
          <RMotionView
            pointerEvents="none"
            keyframes
            duration={300}
            onWillAnimate={() => console.log('onWillAnimate')}
            onDidAnimate={() => console.log('onDidAnimate')}
            animate={animations.fadeInLeft}
            exit={animations.fadeOutLeft}
            style={{
              backgroundColor: 'red',
              width: 300,
              height: 300,
              opacity: 1,
            }}>
            <Text style={{ fontSize: 40 }}>RMotion</Text>
          </RMotionView>
        )}
      </AnimatePresence>
    </ScrollView>
  );
};

export default App;
