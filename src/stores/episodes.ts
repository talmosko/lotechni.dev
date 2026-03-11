import { task } from 'nanostores'
import { fetchShowData } from '@utils/spotify'
import type { Show } from '@data/types/spotifyEpisodes'

let showData: Show | null = null

const POLLING_INTERVAL = 1 * 60 * 60 * 1000 //1 hour

export async function fetchAndUpdateShowData() {
  try {
    return await fetchShowData()
  } catch (error) {
    console.error(error)
  }
}

setInterval(
  () =>
    task(async () => {
      const show = await fetchAndUpdateShowData()
      if (show) {
        showData = show
      }
    }),
  POLLING_INTERVAL
)

export const getShowData = async () => {
  if (!showData) {
    const show = await fetchAndUpdateShowData()
    if (show) {
      showData = show
    }
  }
  return showData
}
