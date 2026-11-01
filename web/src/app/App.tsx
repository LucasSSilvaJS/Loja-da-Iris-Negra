import { WaterField } from '../components/art/WaterField'
import { FaultHost } from '../components/feedback/FaultNotice'
import { NoticeHost } from '../components/feedback/Notice'
import { AppRouter } from './router'

export function App() {
  return (
    <>
      <WaterField />
      <NoticeHost />
      <FaultHost />
      <AppRouter />
    </>
  )
}
