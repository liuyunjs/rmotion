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
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
} from 'react-native';
import { Portal, DefaultStore } from 'react-native-portal-view';
import { RMotionView, AnimatePresence } from './library/main';
import * as animations from './library/animations/main';
import * as attentions from './library/animations/attentionSeekers';
import * as fade from './library/animations/fade';
import * as bounce from './library/animations/bounce';
import { keys } from './library/animations/utils';

// DefaultStore.getUpdater('default').setContainer(AnimatePresence);
//
// DefaultStore.getUpdater('modal').setContainer(AnimatePresence);
//
// const Modal = ({ visible }: { visible: boolean }) => {
//   return (
//     <Portal namespace="modal">
//       {visible && (
//         <>
//           <RMotionView
//             // config={{ duration: 3000 }}
//             style={[
//               StyleSheet.absoluteFill,
//               { backgroundColor: 'rgba(0,0,0,.1)', zIndex: 1, top: 200 },
//             ]}
//             from={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           />
//           <RMotionView
//             // onDidAnimate={console.log}
//             // config={{ duration: 3000 }}
//             exit={{ opacity: 0, translateY: -400 }}
//             from={{ opacity: 0.3, translateY: 400 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             style={[
//               StyleSheet.absoluteFill,
//               { height: 400, width: 400, top: 200 },
//             ]}>
//             <Text style={[{ fontSize: 20, color: '#000' }]}>rmotion modal</Text>
//           </RMotionView>
//         </>
//       )}
//     </Portal>
//   );
// };
//
// const App = () => {
//   const [visible, setVisible] = React.useState(false);
//   const ref = React.useRef<string>();
//   return (
//     <SafeAreaView>
//       <Text onPress={() => setVisible(!visible)} style={{ fontSize: 30 }}>
//         toggle
//       </Text>
//       <Text
//         onPress={() => {
//           if (ref.current) {
//             DefaultStore.getUpdater('default').remove(ref.current);
//             ref.current = undefined;
//             return;
//           }
//           ref.current = DefaultStore.getUpdater('default').add(
//             <RMotionView
//               // config={{ type: 'spring' }}
//               // onDidAnimate={console.log}
//               exit={{ opacity: 0, translateY: -400 }}
//               from={{ opacity: 0.3, translateY: 400 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               style={{ height: 400, width: 400, backgroundColor: 'red' }}>
//               <Text style={{ fontSize: 20, color: '#fff' }}>
//                 rmotion portal
//               </Text>
//             </RMotionView>,
//           );
//         }}
//         style={{ fontSize: 30 }}>
//         show portal
//       </Text>
//       <Modal visible={visible} />
//     </SafeAreaView>
//   );
// };

const animationKeys = keys(bounce);

const App = () => {
  const [animation, setAnimation] = React.useState<keyof typeof bounce>(
    animationKeys[0],
  );
  const [visible, setVisible] = React.useState(false);

  console.log('animation', animation);

  return (
    <ScrollView style={{ paddingVertical: 44 }}>
      <Button
        title="切换"
        onPress={() => {
          setVisible(!visible);
          // const index = animationKeys.indexOf(animation) + 1;
          // setAnimation(animationKeys[index % animationKeys.length]);
        }}
      />
      <AnimatePresence>
        {visible && (
          <RMotionView
            onWillAnimate={(exit) => setVisible(!exit)}
            style={{ backgroundColor: 'red', marginVertical: 10 }}
            animate={animations.slideUpIn}
            exit={animations.slideUpOut}>
            <Text style={{ fontSize: 40 }}>RMotion</Text>
          </RMotionView>
        )}
      </AnimatePresence>
    </ScrollView>
  );
};

export default App;
