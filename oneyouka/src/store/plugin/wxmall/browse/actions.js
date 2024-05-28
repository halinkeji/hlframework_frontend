
import { api } from 'src/boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('wxmall/v1/browse', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
