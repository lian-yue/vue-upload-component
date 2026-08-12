/**
 * Creates a XHR request
 *
 * @param {Object} options
 */
export const createRequest = (options) => {
  const xhr = new XMLHttpRequest()
  xhr.open(options.method || 'GET', options.url)
  xhr.responseType = 'json'
  if (options.headers) {
    Object.keys(options.headers).forEach(key => {
      xhr.setRequestHeader(key, options.headers[key])
    })
  }

  return xhr
}

/**
 * Sends a XHR request with certain body
 *
 * @param {XMLHttpRequest} xhr
 * @param {Object} body
 */
export const sendRequest = (xhr, body) => {
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response
        try {
          response = JSON.parse(xhr.response)
        } catch (err) {
          response = xhr.response
        }
        resolve(response)
      } else {
        reject(xhr.response)
      }
    }
    xhr.onerror = () => reject(xhr.response)
    xhr.onabort = () => reject(new Error('abort'))
    xhr.ontimeout = () => reject(new Error('timeout'))
    xhr.send(JSON.stringify(body))
  })
}

/**
 * Sends a XHR request with certain form data
 *
 * @param {XMLHttpRequest} xhr
 * @param {Object} data
 */
export const sendFormRequest = (xhr, data) => {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    for (const name in data) {
      const value = data[name]
      if (value && typeof value === 'object' && !(typeof Blob !== 'undefined' && value instanceof Blob)) {
        body.append(name, JSON.stringify(value))
      } else if (value !== null && value !== undefined) {
        body.append(name, value)
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response
        try {
          response = JSON.parse(xhr.response)
        } catch (err) {
          response = xhr.response
        }
        resolve(response)
      } else {
        reject(xhr.response)
      }
    }
    xhr.onerror = () => reject(xhr.response)
    xhr.onabort = () => reject(new Error('abort'))
    xhr.ontimeout = () => reject(new Error('timeout'))
    xhr.send(body)
  })
}

/**
 * Creates and sends XHR request
 *
 * @param {Object} options
 *
 * @returns Promise
 */
export default function (options) {
  const xhr = createRequest(options)

  return sendRequest(xhr, options.body)
}
