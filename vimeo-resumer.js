const VIDEO_START_TIME_S = 0
const EXECUTION_INTERVAL_MS = 3500

window.addEventListener('load', vimeoResumerScript)

async function vimeoResumerScript() {
  // Check if video player is present, if not, then exit.
  const focusTargetEl = document.getElementsByClassName('focus-target')[0]
  const isVideoPlayerPresent = typeof focusTargetEl !== 'undefined'
  if (!isVideoPlayerPresent) return

  // Check if current video URL is persisted in storage, if not, then persist in storage and exit.
  const currentVideoURLWithoutParams = window.location.origin + window.location.pathname
  const lastWatchTimeInSeconds = await getObjectFromLocalStorage(currentVideoURLWithoutParams)
  const isCurrentVideoURLPersisted = typeof lastWatchTimeInSeconds !== 'undefined'

  setInterval(() => {
    // If video is not playing, skip interval.
    const statePlayingEl = document.getElementsByClassName('state-playing')[0]
    const isVideoPlaying = typeof statePlayingEl !== 'undefined'
    if (!isVideoPlaying) return

    // If video is playing, then update current play time in storage.
    const currentPlayTimeInSeconds = parseInt(focusTargetEl.getAttribute('aria-valuenow'))
    saveObjectInLocalStorage({ [currentVideoURLWithoutParams]: currentPlayTimeInSeconds })
    // console.log('Set in chrome local storage:', { [currentVideoURLWithoutParams]: currentPlayTimeInSeconds })
  }, EXECUTION_INTERVAL_MS)

  if (!isCurrentVideoURLPersisted) {
    await saveObjectInLocalStorage({ [currentVideoURLWithoutParams]: VIDEO_START_TIME_S })
    return
  }

  // Check if URL contains a last play time, if so compare that to the saved last play time.
  const hasLastPlayTimeURLParam = window.location.href.indexOf('#t=') > -1
  let lastPlayTimeFromURL = null
  if (hasLastPlayTimeURLParam) {
    lastPlayTimeFromURL = parseInt(window.location.href.match(/#t=(.*?)s/i)[1])
  }

  if (lastWatchTimeInSeconds !== lastPlayTimeFromURL && lastWatchTimeInSeconds !== VIDEO_START_TIME_S) {
    window.location.assign(`${currentVideoURLWithoutParams}#t=${lastWatchTimeInSeconds}s`)
    window.location.reload()
  }
}

// Retrieve object from Chrome's Local StorageArea
const getObjectFromLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, (value) => {
        resolve(value[key])
      })
    } catch (ex) {
      reject(ex)
    }
  })
}

// Save Object in Chrome's Local StorageArea
const saveObjectInLocalStorage = async (obj) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, () => {
        resolve()
      })
    } catch (ex) {
      reject(ex)
    }
  })
}

// Removes Object from Chrome Local StorageArea.
const removeObjectFromLocalStorage = async (keys) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, () => {
        resolve()
      })
    } catch (ex) {
      reject(ex)
    }
  })
}
