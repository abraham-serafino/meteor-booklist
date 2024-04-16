import { Meteor } from "meteor/meteor"

/**
 * @notes this method has linear runtime, which may not be suitable for large datasets
 */
function publishWithPolling({
  collectionName,
  getData,
  pollInterval = 3000,
  useNumericKeys = false
}) {
  Meteor.publish(collectionName, async function (payload) {
    const publishedKeys = {}

    const poll = async () => {
      const data = await getData(payload)
      const docKeys = {}

      for (const doc of data) {
        docKeys[doc._id] = true

        if (publishedKeys[doc._id]) {
          this.changed(collectionName, doc._id, doc)
        } else {
          publishedKeys[doc._id] = true
          this.added(collectionName, doc._id, doc)
        }
      }

      for (const key of Object.keys(publishedKeys)) {
        if (!docKeys[key]) {
          const k = useNumericKeys ? Number.parseInt(key) : key
          delete publishedKeys[key]
          this.removed(collectionName, k)
        }
      }

      this.ready()
    }

    await poll()
    // this.ready()

    const interval = Meteor.setInterval(poll, pollInterval)

    this.onStop(() => {
      Meteor.clearInterval(interval)
    })
  })
}

export default publishWithPolling
