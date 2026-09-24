import Svg, { Path } from 'react-native-svg';

type ChatIconProps = {
  size?: number;
  color?: string;
};

export function ChatIcon({
  size = 22,
  color = '#123C2E',
}: ChatIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none">
      <Path
        d="M5.25 4.5h13.5a2.25 2.25 0 0 1 2.25 2.25v8.5a2.25 2.25 0 0 1-2.25 2.25H11l-4.75 3v-3h-1A2.25 2.25 0 0 1 3 15.25v-8.5A2.25 2.25 0 0 1 5.25 4.5Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />

      <Path
        d="M7.5 9h9M7.5 13h6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}