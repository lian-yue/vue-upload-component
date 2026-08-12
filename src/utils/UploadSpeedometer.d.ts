export default class UploadSpeedometer {
  constructor(windowMs?: number)
  start(recordedAt?: number): void
  add(bytes: number, recordedAt?: number): number
  tick(recordedAt?: number): number
  shouldPublish(intervalMs?: number): boolean
}
