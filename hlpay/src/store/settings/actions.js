import { api } from 'src/boot/axios'

export function electronDebug ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/settings/set-frontend-debug', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
