const createIs = (arr: string[]) => (styleKey: string) =>
  arr.indexOf(styleKey) !== -1;

export const isTransform = createIs([
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'skewX',
  'skewY',
]);

export const isColor = createIs([
  'color',
  'backgroundColor',
  'borderBottomColor',
  'borderColor',
  'borderEndColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderTopColor',
  'shadowColor',
  'overlayColor',
  'tintColor',
  'textShadowColor',
  'textDecorationColor',
]);
