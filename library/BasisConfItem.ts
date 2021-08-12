import Animated from 'react-native-reanimated';
import { WithConf } from './types';

const {
  Value,
  Clock,
  set,
  block,
  cond,
  not,
  stopClock,
  startClock,
  clockRunning,
} = Animated;

export class BasisConfItem<Config> {
  protected readonly _finished = new Value(0);
  protected readonly _time = new Value(0);
  protected readonly _position: Animated.Value<number>;
  protected readonly _clock = new Clock();

  protected readonly _toValue: Animated.Adaptable<number>;
  protected readonly _localConf?: Config;
  protected readonly _globalConf?: Config;
  protected readonly _currentConf?: Config;
  protected readonly _defaultConf!: Required<Omit<Config, 'type'>>;

  // @ts-ignore
  protected _getAnimNode(): Animated.Node<number>;

  constructor(
    position: Animated.Value<number>,
    anim: WithConf<number, Config>,
    localConf?: Config,
    globalConf?: Config,
  ) {
    this._position = position;
    this._toValue = anim.value;
    this._currentConf = anim.config;
    this._localConf = localConf;
    this._globalConf = globalConf;
  }

  protected _getConf(): Required<Omit<Config, 'type'>> & {
    toValue: Animated.Value<number>;
  } {
    const config = Object.assign(
      {},
      this._defaultConf,
      this._globalConf,
      this._localConf,
      this._currentConf,
    );
    delete config.type;
    config.toValue = this._toValue;
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
