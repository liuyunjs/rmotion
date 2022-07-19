import { View, Image, Text } from 'react-native';
export { AnimatePresence } from 'framer-motion';
import { rmotion } from './rmotion';
export * from './types';
export type { AnimatePresenceProps } from 'framer-motion';

export const RMotionView = rmotion(View);
export const RMotionImage = rmotion(Image);
export const RMotionText = rmotion(Text);
export { rmotion };
