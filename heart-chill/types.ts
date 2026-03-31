export interface HeartParticleProps {
  count?: number;
  scale?: number;
  customText?: string;
  onTextModeChange?: (isTextMode: boolean) => void;
}

export interface FloatingTextProps {
  text: string;
  subtext?: string;
}
