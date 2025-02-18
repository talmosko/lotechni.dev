import { map, onMount, task } from 'nanostores'
import { fetchEpisodeThumbnails, fetchShowData } from '@utils/spotify'
import type { Show } from '@data/types/spotifyEpisodes'

let showData: Show | null = null

const POLLING_INTERVAL = 1 * 60 * 60 * 1000 //1 hour

export async function fetchAndUpdateShowData() {
  try {
    const show = await fetchShowData()
    const newEpisodes = show.episodes.items

    if (showData) {
      const oldEpisodes = showData.episodes.items
      //get tumbnail_url from old episodes
      newEpisodes.forEach((episode) => {
        const oldEpisode = oldEpisodes?.find((e) => e.id === episode.id)
        if (oldEpisode) {
          episode.thumbnail_url = oldEpisode.thumbnail_url
        }
      })
    }

    //filter out episodes that have a thumbnail_url
    const episodesWithoutThumbnail = newEpisodes.filter((episode) => !episode.thumbnail_url)

    //fetch thumbnail_url from spotify
    const thumbnailUrls = await fetchEpisodeThumbnails(episodesWithoutThumbnail)

    //update episodes with thumbnail_url
    newEpisodes.forEach((episode) => {
      if (episode.id in thumbnailUrls) {
        episode.thumbnail_url = thumbnailUrls[episode.id]
      }
    })

    return show
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
