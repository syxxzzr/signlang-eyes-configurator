const FULL_TURN = Math.PI * 2
const TOP_ANGLE = -Math.PI / 2

export const COUNTDOWN_NUMBER_COLOR = 'foreground'
export const COUNTDOWN_NUMBER_WEIGHT = 400

function clampProgress(progress: number) {
  return Math.max(0, Math.min(1, progress))
}

export function countdownWipeAngles(progress: number) {
  const remaining = clampProgress(progress)
  const elapsed = 1 - remaining
  return {
    startAngle: TOP_ANGLE + FULL_TURN * elapsed,
    endAngle: TOP_ANGLE + FULL_TURN,
  }
}
