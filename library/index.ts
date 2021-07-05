import React from 'react';
import { View, Image, Text } from 'react-native';

// @ts-ignore
import { AnimatePresence as AP } from 'framer-motion/dist/es/components/AnimatePresence';
import { rmotion } from './rmotion';
import { AnimatePresenceProps } from './types';

export * from './types';

export const RMotionView = rmotion(View);
export const RMotionImage = rmotion(Image);
export const RMotionText = rmotion(Text);
export { rmotion };

export const AnimatePresence = AP as React.FC<AnimatePresenceProps>;
