import Animated from 'react-native-reanimated';
import { OneOfAnimConf, WithConf } from './types';
import { SpringConfItem } from './SpringConfItem';
import { TimingConfItem } from './TimingConfItem';
import { BasisConfItem } from './BasisConfItem';

const { Value } = Animated;

export class BasisConf {
  readonly value: Animated.Value<number>;
  private _items: BasisConfItem<any>[] = [];

  constructor(startValue: number | WithConf<number>) {
    this.value = new Value<number>(
      typeof startValue === 'number' ? startValue : startValue.value,
    );
  }

  add(
    value: number | WithConf<number>,
    localConf?: OneOfAnimConf,
    globalConf?: OneOfAnimConf,
  ) {
    const conf = typeof value === 'number' ? { value } : value;

    const confType =
      (conf.config && conf.config.type) ||
      (localConf && localConf.type) ||
      (globalConf && globalConf.type);

    const ConfItem = confType === 'spring' ? SpringConfItem : TimingConfItem;

    // @ts-ignore
    this._items.push(new ConfItem(this.value, conf, localConf, globalConf));
  }

  clear() {
    this._items = [];
  }

  start() {
    return this._items.reduceRight(
      (previousValue: Animated.Adaptable<any>, currentValue) => {
        return currentValue.anim(previousValue);
      },
      0,
    );
  }
}
