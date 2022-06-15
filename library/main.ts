import * as React from 'react';
import { View, Image, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { AnimatePresence as AP } from 'framer-motion';
import { rmotion } from './rmotion';
import { AnimatePresenceProps } from './types';

export * from './types';

export const RMotionView = rmotion(View);
export const RMotionImage = rmotion(Image);
export const RMotionText = rmotion(Text);
export { rmotion };

export const AnimatePresence = AP as React.FC<AnimatePresenceProps>;
