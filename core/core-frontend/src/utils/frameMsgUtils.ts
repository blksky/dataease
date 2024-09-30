import { dvMainStoreWithOut } from '@/store/modules/data-visualization/dvMain'
import { snapshotStoreWithOut } from '@/store/modules/data-visualization/snapshot'
import { storeToRefs } from 'pinia'
import { adaptCurThemeCommonStyleAll } from '@/utils/canvasStyle'
import { useEmitt } from '@/hooks/web/useEmitt'

export const EnumFrameMessageType = {
  INIT: 'INIT',
  REPORT_CREATE: 'REPORT_CREATE',
  REPORT_DESTROY: 'REPORT_DESTROY',
  CHANGE_THEME: 'CHANGE_THEME'
}

/**
 * 通过iframe通信支持
 */
export class FrameMsgUtils {
  static REPORT_MAP = new Map()
  static REPORT_THEME_LIST: any[] = []

  /**
   * 接收消息
   */
  static initReceiveMessage(callback = null) {
    try {
      const receiveMessage = event => {
        const { type } = event.data || {}
        const dvMainStore = dvMainStoreWithOut()
        const snapshotStore = snapshotStoreWithOut()

        if (type === EnumFrameMessageType.CHANGE_THEME) {
          const { canvasStyleData } = storeToRefs(dvMainStore)
          const currentThemeId = canvasStyleData.value.themeId
          const otherTheme = FrameMsgUtils.REPORT_THEME_LIST?.[0]?.find(
            d => d.id !== currentThemeId
          )
          if (otherTheme) {
            dvMainStore.setCanvasStyle(JSON.parse(otherTheme.details))
            snapshotStore.recordSnapshotCache('renderChart')
            adaptCurThemeCommonStyleAll()
            useEmitt().emitter.emit('onSubjectChange')
          }
        }
        console.log('收到父页面消息', event)
      }
      window.addEventListener('message', callback || receiveMessage, false)
    } catch (e) {}
  }

  static sendMessage(type, options) {
    try {
      if (type === EnumFrameMessageType.REPORT_CREATE) {
        const { reportId, reportComponent } = options
        Reflect.deleteProperty(options, 'reportComponent')

        FrameMsgUtils.REPORT_MAP.set(reportId, reportComponent)
      } else if (type === EnumFrameMessageType.REPORT_DESTROY) {
        const { reportId } = options
        Reflect.deleteProperty(options, 'reportComponent')
        FrameMsgUtils.REPORT_MAP.delete(reportId)
      }
      console.log('发送消息给父页面', { type, options })
      window.parent?.postMessage?.({ type, options }, document.referrer)
    } catch (e) {}
  }
}
