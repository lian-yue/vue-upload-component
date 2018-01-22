/**
 * Creates a XHR request
 *
 * @param {Object} options
 */
export const createRequest = (options) => {
  const xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  xhr.open(options.method || 'GET', options.url)
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
        resolve(xhr.response)
      } else {
        reject(xhr.statusText)
      }
    }
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send(JSON.stringify(body))
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
