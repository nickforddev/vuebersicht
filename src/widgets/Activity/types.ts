export enum color {
  low = 'rgb(133, 188, 86)',
  med = 'orange',
  high = 'rgb(255,44,37)',
}

export function getColor(percentage: number): color {
  if (percentage < 50) {
    return color.low
  } else if (percentage < 80) {
    return color.med
  } else {
    return color.high
  }
}
