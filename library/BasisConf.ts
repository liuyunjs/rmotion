import Animated, { Value } from 'react-native-reanimated';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { OneOfAnimConf, WithConf } from './types';
import { SpringConfItem } from './SpringConfItem';
import { TimingConfItem } from './TimingConfItem';
import { BasisConfItem } from './BasisConfItem';

export class BasisConf {
  readonly value: Animated.Value<number>;
  private _items: BasisConfItem<any>[] = [];

  constructor(startValue: WithConf<number>) {
    this.value = new Value<number>(
      typeof startValue === 'object' ? startValue.value : startValue,
    );
  }

  add(value: WithConf<number>, globalConf?: OneOfAnimConf) {
    const conf = isAnyObject(value) ? value : { value };
    const confType = (conf as any).config?.type || globalConf?.type;
    const ConfItem = confType === 'spring' ? SpringConfItem : TimingConfItem;
    // @ts-ignore
    this._items.push(new ConfItem(this.value, conf, globalConf));
  }

  clear() {
    this._items = [];
  }

  start(): Animated.Adaptable<any> {
    return this._items.reduceRight(
      (previousValue: Animated.Adaptable<any>, currentValue) => {
        return currentValue.anim(previousValue);
      },
      1,
    );
  }
}
