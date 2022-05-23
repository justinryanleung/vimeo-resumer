// If current video URL time is persisted in storage, then resume video at that time.

https://gist.github.com/sumitpore/47439fcd86696a71bf083ede8bbd5466

```json
'vimeo-resumer-last-timestamp': [
  {
    url: 'https://vimeo.com/channels/staffpicks/140982393',
    timestamp: '0:00'
  },
]
```

const VIMEO_RESUMER_STORAGE_KEY = 'vimeo-resumer-last-time'

// const currentTimestampInSeconds = parseInt(focusTargetEl.getAttribute('aria-valuenow'))
// alert(currentTimestampInSeconds)

// const example = [
//   {
//     url: 'https://vimeo.com/channels/staffpicks/140982393',
//     timestamp: '0:00'
//   },
// ]
// chrome.storage.local.set({VIMEO_RESUMER_STORAGE_KEY: example})

// chrome.storage.local.get(VIMEO_RESUMER_STORAGE_KEY, (result) => {
//   alert(JSON.stringify(result.example))
//   // channels = result[VIMEO_RESUMER_STORAGE_KEY]
// })

// If it doesn't exist, then set in storage with current URL
// If it does exist, then get from storage and set current URL with last timestamp

// Start event listener with current video URL
/*
chrome.storage.local.set({VIMEO_RESUMER_STORAGE_KEY: []})

chrome.storage.local.get(VIMEO_RESUMER_STORAGE_KEY, result => {
  channels = result[VIMEO_RESUMER_STORAGE_KEY]
})
*/


`chrome.storage.local.remove(["Key1","key2"], (result) => {})`
`chrome.storage.local.set({key: value}, (result) => {})`