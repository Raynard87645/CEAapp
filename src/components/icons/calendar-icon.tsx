import Svg, {
  Circle,
  G,
  Path,
  Rect,
} from 'react-native-svg';

import { Palette } from '@/constants/theme';

type CalendarIconProps = {
  size?: number;
  color?: string;
};

export function CalendarIcon({
  size = 22,
  color = Palette.muted,
}: CalendarIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none">
      <G
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Rect
          x="3.5"
          y="4.5"
          width="17"
          height="16"
          rx="3"
        />
        <Path d="M7.5 2.75v3.5M16.5 2.75v3.5M3.5 8.5h17" />
      </G>

      <G fill={color}>
        <Circle cx="7.5" cy="11.5" r=".75" />
        <Circle cx="12" cy="11.5" r=".75" />
        <Circle cx="16.5" cy="11.5" r=".75" />
        <Circle cx="7.5" cy="15.75" r=".75" />
        <Rect
          x="10.25"
          y="14"
          width="3.5"
          height="3.5"
          rx=".8"
        />
        <Circle cx="16.5" cy="15.75" r=".75" />
      </G>
    </Svg>
  );
}