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
import { SafeAreaView, StyleSheet, Text, Button, View } from 'react-native';
// import { Portal, PortalStore, PortalProvider } from 'react-native-portal-view';
import { RMotionView, AnimatePresence } from './library/main';
//
// const Modal = ({ visible }: { visible: boolean }) => {
//   return (
//     visible && (
//       <Portal key="modal">
//         <RMotionView
//           style={[
//             StyleSheet.absoluteFill,
//             { backgroundColor: 'rgba(0,0,0,.1)', zIndex: 1 },
//           ]}
//           from={{ opacity: 0 }}
//           animate={{ opacity: [1] }}
//           exit={{ opacity: 0 }}
//         />
//         <RMotionView
//           exit={{ opacity: 0, translateY: -400 }}
//           from={{ opacity: 0.3, translateY: 400 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           style={[
//             StyleSheet.absoluteFill,
//             { height: 400, width: 400, backgroundColor: 'red' },
//           ]}>
//           <Text style={[{ fontSize: 20, color: '#fff' }]}>rmotion modal</Text>
//         </RMotionView>
//       </Portal>
//     )
//   );
// };
//
// const App = () => {
//   const [visible, setVisible] = React.useState(false);
//   const ref = React.useRef();
//   console.log(11);
//   return (
//     <SafeAreaView>
//       <Text onPress={() => setVisible(!visible)} style={{ fontSize: 30 }}>
//         toggle
//       </Text>
//       <Text
//         onPress={() => {
//           if (ref.current) {
//             PortalStore.getUpdater('default').remove(ref.current);
//             ref.current = undefined;
//             return;
//           }
//           ref.current = PortalStore.getUpdater('default').add(
//             <RMotionView
//               // config={{ type: 'spring' }}
//               onDidAnimate={console.log}
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
//       <PortalProvider />
//     </SafeAreaView>
//   );
// };

const App = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{ paddingTop: 100 }}>
      <Button title="toggle" onPress={() => setVisible(!visible)} />
      <AnimatePresence>
        {visible && (
          <RMotionView
            style={{ backgroundColor: 'red' }}
            from={{ opacity: 0 }}
            config={{ duration: 400 }}
            exit={{
              opacity: 0,
              translateX: 0,
              translateY: 200,
            }}
            animate={{
              opacity: [0.5, 1],
              translateY: 0,
              translateX: [
                0,
                // delay
                { value: 0, config: { duration: 3000 } },
                { value: 200, config: { duration: 1000 } },
              ],
            }}>
            <Text style={{ fontSize: 40 }}>RMotion</Text>
          </RMotionView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default App;
