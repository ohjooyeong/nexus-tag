declare module 'magic-wand-tool' {
  interface MaskData {
    x: number;
    y: number;
    width: number;
    height: number;
    bounds: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    };
    data: Uint8Array;
  }

  interface ColorPoint {
    x: number;
    y: number;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }

  interface Options {
    tolerance: number;
    useAlpha?: boolean;
    colorType?: number;
    blurRadius?: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Contour {
    inner: boolean;
    label: number;
    points: Point[];
    initialCount?: number;
  }

  interface MagicWand {
    floodFill: (
      imageData: ImageData,
      startX: number,
      startY: number,
      tolerance: number,
      useAlpha?: boolean,
      colorType?: number,
    ) => MaskData;
    gaussBlur: (mask: MaskData, radius: number) => void;
    traceContours: (mask: MaskData) => Array<Array<ColorPoint>>;
    simplifyContours: (
      contours: Contour[],
      simplifyTolerant: number,
      simplifyCount: number,
    ) => Contour[];
  }

  const magicWand: MagicWand;
  export default magicWand;
}
