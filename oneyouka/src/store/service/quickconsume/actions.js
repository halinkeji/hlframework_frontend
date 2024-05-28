import { api } from 'src/boot/axios'

export function quickSetData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/quick-consume/create', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
