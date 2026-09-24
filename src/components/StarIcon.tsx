import Svg, { Polygon } from 'react-native-svg';
import { COLORS } from '../constants/colors';

export default function StarIcon() {
  // 5-point star path coordinates
  const points = "10,1 12.5,7 19,7.5 14,11.5 15.5,18 10,14.5 4.5,18 6,11.5 1,7.5 7.5,7";

  return (
    <Svg width={18} height={18} viewBox="0 0 20 20">
      <Polygon
        points={points}
        fill="#FFFFFF"
        stroke={COLORS.primary}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
