const DEFAULT_WINDOW_MS = 3000

function currentTime() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now()
  }
  return Date.now()
}

export default class UploadSpeedometer {
  constructor(windowMs = DEFAULT_WINDOW_MS) {
    this.windowMs = windowMs
    this.totalBytes = 0
    this.samples = []
    this.lastPublishedAt = null
  }

  start(recordedAt = currentTime()) {
    if (this.samples.length) {
      return
    }
    this.samples.push({ time: recordedAt, bytes: this.totalBytes })
    this.lastPublishedAt = recordedAt
  }

  add(bytes, recordedAt = currentTime()) {
    this.start(recordedAt)
    if (Number.isFinite(bytes) && bytes > 0) {
      this.totalBytes += bytes
    }
    return this.measure(recordedAt)
  }

  tick(recordedAt = currentTime()) {
    this.start(recordedAt)
    return this.measure(recordedAt)
  }

  shouldPublish(intervalMs = 1000) {
    if (!this.samples.length) {
      return false
    }
    const recordedAt = this.samples[this.samples.length - 1].time
    if (recordedAt - this.lastPublishedAt < intervalMs) {
      return false
    }
    this.lastPublishedAt = recordedAt
    return true
  }

  measure(recordedAt) {
    const lastSample = this.samples[this.samples.length - 1]
    const time = Math.max(lastSample.time, recordedAt)
    if (time === lastSample.time) {
      lastSample.bytes = this.totalBytes
    } else {
      this.samples.push({ time, bytes: this.totalBytes })
    }

    const cutoff = time - this.windowMs
    while (this.samples.length > 2 && this.samples[1].time <= cutoff) {
      this.samples.shift()
    }

    const first = this.samples[0]
    const second = this.samples[1]
    let baselineTime = first.time
    let baselineBytes = first.bytes
    if (first.time < cutoff && second) {
      const sampleDuration = second.time - first.time
      const cutoffRatio = sampleDuration > 0 ? (cutoff - first.time) / sampleDuration : 1
      baselineTime = cutoff
      baselineBytes = first.bytes + ((second.bytes - first.bytes) * cutoffRatio)
    }

    const duration = time - baselineTime
    if (duration <= 0) {
      return 0
    }
    return Math.max(0, Math.round(((this.totalBytes - baselineBytes) * 1000) / duration))
  }
}
