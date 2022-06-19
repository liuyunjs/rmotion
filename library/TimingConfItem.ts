import Animated, {
  Easing,
  EasingNode,
  Value,
  timing,
} from 'react-native-reanimated';
import { BasisConfItem } from './BasisConfItem';
import { TimingAnimConf } from './types';

export class TimingConfItem extends BasisConfItem<TimingAnimConf> {
  private readonly _frameTime = new Value(0);

  // @ts-ignore
  protected readonly _defaultConf: Required<Omit<TimingAnimConf, 'type'>> = {
    easing: (EasingNode || Easing).ease,
    duration: 300,
  };

  protected _getAnimNode(): Animated.Node<number> {
    const state: Animated.TimingState = {
      position: this._position,
      finished: this._finished,
      frameTime: this._frameTime,
      time: this._time,
    };
    return timing(this._clock, state, this._getConf());
  }
}
