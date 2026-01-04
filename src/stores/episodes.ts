import { map, onMount, task } from 'nanostores'
import { fetchEpisodeThumbnails, fetchShowData } from '@utils/spotify'
import type { Show } from '@data/types/spotifyEpisodes'

let showData: Show | null = null

const POLLING_INTERVAL = 1 * 60 * 60 * 1000 //1 hour

const rulledOutEpisodes = [
  '79SCKYsZmqwpBuQ0A2xfrb', // invitation to vote geektime 2025
]

export async function fetchAndUpdateShowData() {
  try {
    const show = await fetchShowData()
    const newEpisodes = show.episodes.items
    const filteredEpisodes = newEpisodes.filter(
      (episode) => !rulledOutEpisodes.includes(episode.id)
    )

    //fetch thumbnail_url from spotify
    const thumbnailUrls = await fetchEpisodeThumbnails(filteredEpisodes)

    //update episodes with thumbnail_url
    filteredEpisodes.forEach((episode) => {
      if (episode.id in thumbnailUrls) {
        episode.thumbnail_url = thumbnailUrls[episode.id]
      }
    })

    return {
      ...show,
      episodes: {
        ...show.episodes,
        items: filteredEpisodes,
      },
    }
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
