import Animated, {
  Value,
  Clock,
  set,
  block,
  cond,
  not,
  stopClock,
  startClock,
  clockRunning,
} from 'react-native-reanimated';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { WithConf } from './types';

export class BasisConfItem<Config> {
  protected readonly _finished = new Value(0);
  protected readonly _time = new Value(0);
  protected readonly _position: Animated.Value<number>;
  protected readonly _clock = new Clock();

  protected readonly _toValue: Animated.Adaptable<number>;
  protected readonly _globalConf?: Config;
  protected readonly _currentConf?: Config;
  protected readonly _defaultConf!: Required<Omit<Config, 'type'>>;

  // @ts-ignore
  protected _getAnimNode(): Animated.Node<number>;

  constructor(
    position: Animated.Value<number>,
    anim: WithConf<number, Config>,
    globalConf?: Config,
  ) {
    const conf = isAnyObject(anim) ? anim : { value: anim };

    this._position = position;
    this._toValue = (conf as any).value;
    this._currentConf = (conf as any).config;
    this._globalConf = globalConf;
  }

  protected _getConf(): Required<Omit<Config, 'type'>> & {
    toValue: Animated.Adaptable<number>;
  } {
    const config = Object.assign(
      {},
      this._defaultConf,
      this._globalConf,
      this._currentConf,
    );
    // @ts-ignore
    delete config.type;
    // @ts-ignore
    config.toValue = this._toValue;
    // @ts-ignore
    return config;
  }

  anim(node: Animated.Adaptable<any>) {
    return block([
      cond(not(this._finished), [
        cond(not(clockRunning(this._clock)), [
          set(this._finished, 0),
          set(this._time, 0),
          startClock(this._clock),
        ]),
        this._getAnimNode(),
      ]),

      cond(this._finished, [
        cond(clockRunning(this._clock), stopClock(this._clock)),
        node,
      ]),
      this._finished,
    ]);
  }
}
