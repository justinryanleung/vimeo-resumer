const VIDEO_START_TIME_S = 0
const EXECUTION_INTERVAL_MS = 3500

window.addEventListener('load', vimeoResumerScript)

async function vimeoResumerScript() {
  // Check if video player is present, if not, then exit.
  const focusTargetEl = document.getElementsByClassName('focus-target')[0]
  const isVideoPlayerPresent = typeof focusTargetEl !== 'undefined'

  if (!isVideoPlayerPresent) {
    console.log('Video player is not present.')
    return
  }

  // Check if current video URL is persisted in storage, if not, then persist in storage and exit.
  const currentVideoURLWithoutParams = window.location.origin + window.location.pathname
  let lastWatchTimeInSeconds = await getObjectFromLocalStorage(currentVideoURLWithoutParams)
  const isCurrentVideoURLPersisted = typeof lastWatchTimeInSeconds !== 'undefined'

  // Video and last play time localstorage update interval.
  setInterval(() => {
    const statePlayingEl = document.getElementsByClassName('state-playing')[0]
    const isVideoPlaying = typeof statePlayingEl !== 'undefined'
    const currentPlayTimeInSeconds = parseInt(focusTargetEl.getAttribute('aria-valuenow'))
    const isPersistedTimeOutdated = lastWatchTimeInSeconds !== currentPlayTimeInSeconds

    // If video is paused but the play bar is being used, save jumped to times.
    if (!isVideoPlaying && isPersistedTimeOutdated) {
      console.error('Video is paused but the play bar is being used, save jumped to times.', { [currentVideoURLWithoutParams]: currentPlayTimeInSeconds })
      saveObjectInLocalStorage({ [currentVideoURLWithoutParams]: currentPlayTimeInSeconds })
      lastWatchTimeInSeconds = currentPlayTimeInSeconds
      return
    }

    // If video isn't playing, skip interval.
    if (!isVideoPlaying) {
      console.log('Video is not playing, skipping interval.')
      return
    }

    // If video is playing, then update current play time in storage.
    const data = { [currentVideoURLWithoutParams]: currentPlayTimeInSeconds }
    saveObjectInLocalStorage(data)

    console.log('Set in chrome local storage:', data)
  }, EXECUTION_INTERVAL_MS)

  // Persist video URL if it isn't already. Set timestamp equal to start of video, so zero.
  if (!isCurrentVideoURLPersisted) {
    const data = { [currentVideoURLWithoutParams]: VIDEO_START_TIME_S }
    await saveObjectInLocalStorage(data)
    console.log('Persisting video for the first time.', data)
    return
  }

  // Check if URL contains a last play time, if so compare that to the saved last play time.
  const hasLastPlayTimeURLParam = window.location.href.indexOf('#t=') > -1
  let lastPlayTimeFromURL = null
  if (hasLastPlayTimeURLParam) {
    lastPlayTimeFromURL = parseInt(window.location.href.match(/#t=(.*?)s/i)[1])
  }

  // Reload page and start video at last play time.
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
