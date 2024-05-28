import { api } from 'src/boot/axios'

export function getItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/evaluation/view?id=' + item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
