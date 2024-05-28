import { api } from 'boot/axios'

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/point/create'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
