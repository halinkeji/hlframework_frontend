import { LocalStorage } from 'quasar'
export function is_main_store (state) {
  const account_info = LocalStorage.getItem('chainstore_account_info')

  if (account_info) {
    if (parseInt(account_info.store_id) == parseInt(account_info.lib_id)) {
      return true
    }
  }
  return false
}
