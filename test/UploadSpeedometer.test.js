import { describe, expect, it } from 'vitest'
import UploadSpeedometer from '../src/utils/UploadSpeedometer.js'

describe('UploadSpeedometer', () => {
  it('is accurate before the rolling window is full', () => {
    const speedometer = new UploadSpeedometer(3000)
    speedometer.start(0)

    expect(speedometer.add(1000, 400)).toBe(2500)
    expect(speedometer.add(1000, 1000)).toBe(2000)
    expect(speedometer.shouldPublish()).toBe(true)
    expect(speedometer.add(2000, 2000)).toBe(2000)
    expect(speedometer.shouldPublish()).toBe(true)
  })

  it('smooths transfers over a rolling window and decays after a stall', () => {
    const speedometer = new UploadSpeedometer(3000)
    speedometer.start(0)

    speedometer.add(1000, 1000)
    speedometer.add(1000, 2000)
    expect(speedometer.add(1000, 3000)).toBe(1000)
    expect(speedometer.tick(4000)).toBe(667)
    expect(speedometer.tick(6000)).toBe(0)
  })

  it('uses real elapsed time when background events are delayed', () => {
    const speedometer = new UploadSpeedometer(3000)
    speedometer.start(0)

    speedometer.add(1000, 500)
    expect(speedometer.shouldPublish()).toBe(false)
    expect(speedometer.add(9000, 10000)).toBe(947)
    expect(speedometer.shouldPublish()).toBe(true)
  })
})
