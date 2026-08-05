// Simple heuristic-based classifier for demonstration.
// In a production app, this would be a trained TensorFlow.js model.

export const classifyHand = (landmarks: any[]): string | null => {
  // Landmarks: 0-20
  // Example: Check if hand is open or closed (simplified)
  
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  // Very rudimentary example logic
  if (
    indexTip.y < landmarks[6].y &&
    middleTip.y < landmarks[10].y &&
    ringTip.y < landmarks[14].y &&
    pinkyTip.y < landmarks[18].y
  ) {
    return "OPEN";
  }

  if (
    indexTip.y > landmarks[6].y &&
    middleTip.y > landmarks[10].y &&
    ringTip.y > landmarks[14].y &&
    pinkyTip.y > landmarks[18].y
  ) {
    return "CLOSED";
  }

  return null;
};
