import { loginApi, queryDekey } from '@/api/login'
import { useUserStoreWithOut } from '@/store/modules/user'
import { rsaEncryp } from '@/utils/encryption'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'

const { wsCache } = useCache()
const userStore = useUserStoreWithOut()
const appStore = useAppStoreWithOut()

/** 获取url参数 */
export function getSearchParams(): URLSearchParams {
  let url: URL
  if (window.location.hash.includes('?')) {
    url = new URL('https://' + window.location.hash.substring(1))
  } else {
    url = new URL(`${window.location.origin}${window.location.search}`)
  }
  return url.searchParams
}

export const loginHandler = async () => {
  const urlParams = getSearchParams()
  if (!urlParams.has('username') || !urlParams.has('password')) {
    return false
  }
  if (!wsCache.get(appStore.getDekey)) {
    const res = await queryDekey()
    wsCache.set(appStore.getDekey, res.data)
  }
  const res = await loginApi({
    name: rsaEncryp(urlParams.get('username')),
    pwd: rsaEncryp(urlParams.get('password'))
  })
  const { token, exp } = res.data
  userStore.setToken(token)
  userStore.setExp(exp)
}
