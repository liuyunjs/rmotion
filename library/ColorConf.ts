import { processColor } from 'react-native';
import Animated, { color, block } from 'react-native-reanimated';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { BasisConf } from './BasisConf';
import { OneOfAnimConf, WithConf } from './types';

function red(c: number) {
  return (c >> 16) & 255;
}
function green(c: number) {
  return (c >> 8) & 255;
}
function blue(c: number) {
  return c & 255;
}
function opacity(c: number) {
  return ((c >> 24) & 255) / 255;
}

const parseValue = (
  startValue: number | WithConf<number | string> | string,
) => {
  if (typeof startValue === 'number') {
    return startValue;
  }
  if (typeof startValue === 'string') {
    return processColor(startValue) as number;
  }
  if (typeof startValue.value === 'number') {
    return startValue.value;
  }
  return processColor(startValue.value) as number;
};

export class ColorConf {
  readonly value: Animated.Node<number | string>;

  private readonly _r: BasisConf;
  private readonly _g: BasisConf;
  private readonly _b: BasisConf;
  private readonly _a: BasisConf;

  constructor(startValue: WithConf<number | string>) {
    const value = parseValue(startValue);

    this._r = new BasisConf(red(value));
    this._g = new BasisConf(green(value));
    this._b = new BasisConf(blue(value));
    this._a = new BasisConf(opacity(value));

    this.value = color(
      this._r.value,
      this._g.value,
      this._b.value,
      this._a.value,
    );
  }

  add(
    value: number | WithConf<number | string> | string,
    globalConf?: OneOfAnimConf,
  ) {
    const currentConf = isAnyObject(value) ? (value as any).config : undefined;
    const val = parseValue(value);

    this._r.add(
      {
        value: red(val),
        config: currentConf,
      },
      globalConf,
    );
    this._g.add(
      {
        value: green(val),
        config: currentConf,
      },
      globalConf,
    );
    this._b.add(
      {
        value: blue(val),
        config: currentConf,
      },
      globalConf,
    );
    this._a.add(
      {
        value: opacity(val),
        config: currentConf,
      },
      globalConf,
    );
  }

  clear() {
    this._r.clear();
    this._g.clear();
    this._b.clear();
    this._a.clear();
  }

  start() {
    return block([
      this._r.start(),
      this._g.start(),
      this._b.start(),
      this._a.start(),
    ]);
  }
}
