//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const fs = require('fs')
const path = require('path')

// Add your routes here

// Changelog: entries are stored in a JSON file so they persist across restarts
const changelogFile = path.join(__dirname, 'data', 'changelog.json')

function readChangelog () {
  try {
    return JSON.parse(fs.readFileSync(changelogFile, 'utf8'))
  } catch (e) {
    return []
  }
}

function writeChangelog (entries) {
  fs.writeFileSync(changelogFile, JSON.stringify(entries, null, 2))
}

function sortByDateDesc (entries) {
  return entries.slice().sort(function (a, b) {
    return (b.date || '').localeCompare(a.date || '')
  })
}

// The "latest" prototype is whichever "Idea N" has the highest number seen so far
function latestIdea (entries) {
  let highest = 1

  entries.forEach(function (entry) {
    const match = /Idea (\d+)/.exec(entry.idea || '')
    if (match) {
      highest = Math.max(highest, Number(match[1]))
    }
  })

  return 'Idea ' + highest
}

router.get('/changelog', function (req, res) {
  const entries = sortByDateDesc(readChangelog())
  const editId = req.query.edit
  const editEntry = editId ? entries.find(function (entry) { return entry.id === editId }) : null

  res.render('changelog', {
    entries: entries,
    editEntry: editEntry
  })
})

router.post('/changelog/add', function (req, res) {
  const message = (req.body.message || '').trim()

  if (message) {
    const entries = readChangelog()
    entries.push({
      id: 'cl-' + Date.now().toString(36),
      idea: latestIdea(entries),
      message: message,
      date: new Date().toISOString().slice(0, 10)
    })
    writeChangelog(entries)
  }

  res.redirect('/changelog')
})

router.post('/changelog/edit/:id', function (req, res) {
  const entries = readChangelog()
  const entry = entries.find(function (entry) { return entry.id === req.params.id })

  if (entry) {
    const message = (req.body.message || '').trim()
    if (message) {
      entry.message = message
      writeChangelog(entries)
    }
  }

  res.redirect('/changelog')
})
