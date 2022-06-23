import { defineTimingAnimate, radian } from './utils';

export const bounce = {
  translateY: defineTimingAnimate([
    0,
    [0, 0.2],
    [-30, 0.2],
    [-30, 0.03],
    [0, 0.1],
    [-15, 0.17],
    [0, 0.1],
    [-4, 0.1],
    [0, 0.1],
  ]),
};

export const flash = {
  opacity: defineTimingAnimate([0, [0, 0.25], [1, 0.25], [0, 0.25], [1, 0.25]]),
};

const jelloSkew = defineTimingAnimate([
  0,
  [radian(0), 0.111],
  [radian(-12.5), 0.111],
  [radian(6.25), 0.111],
  [radian(-3.125), 0.111],
  [radian(1.5625), 0.111],
  [radian(-0.78125), 0.111],
  [radian(0.390625), 0.111],
  [radian(-0.1953125), 0.111],
  [radian(0), 0.112],
]);

export const jello = {
  skewX: jelloSkew,
  skewY: jelloSkew,
};

export const pulse = {
  scale: defineTimingAnimate([1, [1.05, 0.5], [1, 0.5]]),
};

export const rotate = {
  rotate: defineTimingAnimate([
    0,
    [radian(90), 0.25],
    [radian(180), 0.25],
    [radian(270), 0.25],
    [radian(360), 0.25],
  ]),
};

export const shake = {
  translateX: defineTimingAnimate([
    0,
    [-10, 0.1],
    [10, 0.1],
    [-10, 0.1],
    [10, 0.1],
    [-10, 0.1],
    [10, 0.1],
    [-10, 0.1],
    [10, 0.1],
    [-10, 0.1],
    [0, 0.1],
  ]),
};

export const swing = {
  rotate: defineTimingAnimate([
    0,
    [radian(15), 0.2],
    [radian(-10), 0.2],
    [radian(5), 0.2],
    [radian(-5), 0.2],
    [radian(0), 0.2],
  ]),
};

export const rubberBand = {
  scaleX: defineTimingAnimate([
    1,
    [1.25, 0.3],
    [0.75, 0.1],
    [1.15, 0.1],
    [0.95, 0.15],
    [1.05, 0.1],
    [1, 0.25],
  ]),
  scaleY: defineTimingAnimate([
    1,
    [0.75, 0.3],
    [1.25, 0.1],
    [0.85, 0.1],
    [1.05, 0.15],
    [0.95, 0.1],
    [1, 0.25],
  ]),
};

export const tada = {
  scale: defineTimingAnimate([
    1,
    [0.9, 0.1],
    [0.9, 0.1],
    [1.1, 0.1],
    [1.1, 0.6],
    [1, 0.1],
  ]),
  rotate: defineTimingAnimate([
    0,
    [radian(-3), 0.1],
    [radian(-3), 0.2],
    [radian(3), 0.1],
    [radian(-3), 0.1],
    [radian(3), 0.1],
    [radian(-3), 0.1],
    [radian(3), 0.1],
    [radian(3), 0.1],
    [radian(0), 0.1],
  ]),
};

export const wobble = {
  translateX: defineTimingAnimate([
    0,
    [-25, 0.15],
    [20, 0.15],
    [-15, 0.15],
    [10, 0.15],
    [-5, 0.15],
    [0, 0.25],
  ]),
  rotate: defineTimingAnimate([
    0,
    [radian(-5), 0.15],
    [radian(3), 0.15],
    [radian(-3), 0.15],
    [radian(2), 0.15],
    [radian(-1), 0.15],
    [radian(0), 0.25],
  ]),
};
