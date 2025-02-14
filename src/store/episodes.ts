import { map, onMount } from 'nanostores'
import { fetchShowData } from '@utils/spotify'
import type { Show } from '@data/types/spotifyEpisodes'

export const $showData = map<{
  data: Show | null
  loading: boolean
  error: string | null
}>({
  data: null,
  loading: false,
  error: null,
})

const POLLING_INTERVAL = 60 * 60 * 1000 // 1 hour in milliseconds

export async function fetchAndUpdateShowData() {
  try {
    $showData.setKey('loading', true)
    $showData.setKey('error', null)

    const data = await fetchShowData()
    $showData.setKey('data', data)
  } catch (error) {
    $showData.setKey('error', error instanceof Error ? error.message : 'Failed to fetch show data')
  } finally {
    $showData.setKey('loading', false)
  }
}

onMount($showData, () => {
  fetchAndUpdateShowData()
  const updating = setInterval(() => {
    fetchAndUpdateShowData()
  }, POLLING_INTERVAL)
  return () => {
    clearInterval(updating)
  }
})

$showData.subscribe(() => {})
