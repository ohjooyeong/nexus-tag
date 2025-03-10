import chroma from 'chroma-js';
import { DEFAULT_OPACITY } from '../../_constants/constants';
import { BLACK, WHITE } from '../../_constants/colors';

// 색상 문자열을 RGBA 객체로 변환
// defaultOpacity가 true면 기본 투명도 사용, false면 원본 투명도 사용
export const generateRGBA = (color: string, defaultOpacity = true) => {
  const [r, g, b, opacity] = chroma(color).rgba();
  const a = defaultOpacity ? DEFAULT_OPACITY : opacity;
  return { r, g, b, a };
};

// 색상의 투명도를 변경
// addition이 true면 현재 투명도에 opacityChange를 더함
// false면 투명도를 opacityChange 값으로 직접 설정
export const adaptColorWithOpacity = (
  color: string,
  opacityChange: number,
  addition = true,
) => {
  const rgba = generateRGBA(color, false);

  if (addition) {
    rgba.a = rgba.a + opacityChange > 1 ? 1 : rgba.a + opacityChange;
  } else {
    rgba.a = opacityChange;
  }

  return chroma(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`).hex('rgba');
};

// 임계값(threshold)을 기준으로 색상의 투명도를 다르게 조정
// 투명도가 임계값보다 높으면 lowOverride만큼 증가
// 낮으면 highOverride 값으로 설정
export const getColorWithContrastingOpacityOverride = (
  color: string,
  threshold: number,
  lowOverride: number,
  highOverride: number,
) => {
  const rgba = generateRGBA(color, false);

  if (rgba.a > threshold) {
    rgba.a = rgba.a + lowOverride > 1 ? 1 : rgba.a + lowOverride;
  } else {
    rgba.a = highOverride;
  }

  return chroma(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`).hex('rgba');
};

// 색상의 투명도가 주어진 임계값보다 높은지 확인
export const isColorOpacityAboveThreshold = (
  color: string,
  threshold: number,
) => {
  const rgba = generateRGBA(color, false);

  return rgba.a > threshold;
};

// 두 색상 간의 대비가 충분한지 확인 (대비값이 2보다 큰지)
export const isEnoughContrast = (color1: string, color2: string) =>
  chroma.contrast(color1, color2) > 2;

// 주어진 색상과 가장 대비가 높은 색상을 반환
// compare1(기본값: 흰색)과 compare2(기본값: 검정색) 중에서 선택
export const getBetterContrastingColor = (
  color: string,
  compare1 = WHITE,
  compare2 = BLACK,
) => {
  const colors = [compare1, compare2];
  const contrasts = colors.map((compare) => chroma.contrast(color, compare));

  return colors[contrasts.indexOf(Math.max(...contrasts))];
};

// 배경색과 충분한 대비를 가지는 테두리 색상을 생성
// 충분한 대비가 될 때까지 점진적으로 밝게 조정
export const getBorderColor = (rectColor: string, background: string) => {
  const step = 0.2;
  const defaultColor = WHITE;
  let currentColor = rectColor;
  let keepAdjusting;

  do {
    let chromaColor;
    try {
      chromaColor = chroma(currentColor);
    } catch (e) {
      chromaColor = chroma(defaultColor);
    }
    const brighterColor = chromaColor.brighten(step).hex();
    keepAdjusting =
      !isEnoughContrast(background, brighterColor) &&
      currentColor !== brighterColor;
    currentColor = brighterColor;
  } while (keepAdjusting);

  return currentColor;
};
