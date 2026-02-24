import { IconMapPin } from "@tabler/icons-react";

const pulseKeyframes = `
@keyframes marker-pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}
`;

interface PulsingMarkerProps {
  color: string;
  fill: string;
  pulsing?: boolean;
}

export const PulsingMarker = ({ color, fill, pulsing }: PulsingMarkerProps) => {
  return (
    <>
      {pulsing && <style>{pulseKeyframes}</style>}
      <div style={{ position: "relative", cursor: pulsing ? "grab" : undefined }}>
        {pulsing && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 16,
              height: 16,
              marginTop: -8,
              marginLeft: -8,
              borderRadius: "50%",
              backgroundColor: color,
              animation: "marker-pulse 1.5s ease-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
        <IconMapPin
          size={pulsing ? 36 : 28}
          color={color}
          fill={fill}
          style={{
            transition: "all 0.3s ease",
            filter: pulsing ? "drop-shadow(0 0 4px " + color + ")" : undefined,
          }}
        />
      </div>
    </>
  );
};
