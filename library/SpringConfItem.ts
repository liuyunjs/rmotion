import Animated from 'react-native-reanimated';
import { BasisConfItem } from './BasisConfItem';
import { SpringAnimConf } from './types';

const { Value, spring } = Animated;

export class SpringConfItem extends BasisConfItem<SpringAnimConf> {
  private readonly _velocity = new Value(0);

  protected readonly _defaultConf = {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  protected _getAnimNode(): Animated.Node<number> {
    const state: Animated.SpringState = {
      position: this._position,
      finished: this._finished,
      velocity: this._velocity,
      time: this._time,
    };
    return spring(this._clock, state, this._getConf());
  }
}
