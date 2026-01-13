// Import CSS
import './style.css'

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/fatside/sw.js')
}

// State
let state = {
  screen: 'splash', // splash, onboarding, home, settings
  handicap: null,
  previousHandicap: null, // For trend calculation
  rounds: [],
  courses: [],
  showAddForm: false,
  hasCompletedOnboarding: false
}

// Load from localStorage
function loadState() {
  const saved = localStorage.getItem('fatside')
  if (saved) {
    const data = JSON.parse(saved)
    state.handicap = data.handicap
    state.previousHandicap = data.previousHandicap
    state.rounds = data.rounds || []
    state.courses = data.courses || []
    state.hasCompletedOnboarding = data.hasCompletedOnboarding || false
  }
}

// Save to localStorage
function saveState() {
  localStorage.setItem('fatside', JSON.stringify({
    handicap: state.handicap,
    previousHandicap: state.previousHandicap,
    rounds: state.rounds,
    courses: state.courses,
    hasCompletedOnboarding: state.hasCompletedOnboarding
  }))
}

// Calculate handicap from rounds (WHS formula)
function calculateHandicap(rounds) {
  if (rounds.length === 0) return null

  // Use only most recent 20 rounds (WHS rule)
  const recentRounds = rounds.slice(0, 20)

  // Get differentials, sorted lowest first
  const differentials = recentRounds
    .map(r => r.differential)
    .sort((a, b) => a - b)

  // Use best differentials based on count (WHS table)
  let useCount
  if (differentials.length <= 3) useCount = 1
  else if (differentials.length <= 5) useCount = 2
  else if (differentials.length <= 8) useCount = 3
  else if (differentials.length <= 11) useCount = 4
  else if (differentials.length <= 14) useCount = 5
  else if (differentials.length <= 16) useCount = 6
  else if (differentials.length <= 18) useCount = 7
  else useCount = 8

  const bestDiffs = differentials.slice(0, useCount)
  const avg = bestDiffs.reduce((a, b) => a + b, 0) / useCount

  // Apply 96% multiplier (WHS rule)
  const handicapIndex = avg * 0.96

  return Math.round(handicapIndex * 10) / 10
}

// Calculate differential for a round
function calculateDifferential(score, rating, slope) {
  return Math.round(((score - rating) * 113 / slope) * 10) / 10
}

// Get current handicap (calculated from rounds, or initial if no rounds)
function getCurrentHandicap() {
  if (state.rounds.length > 0) {
    return calculateHandicap(state.rounds)
  }
  return state.handicap
}

// Get trend (change from previous handicap)
function getTrend() {
  const current = getCurrentHandicap()
  if (current === null || state.previousHandicap === null) return null
  if (state.rounds.length < 1) return null

  const diff = Math.round((current - state.previousHandicap) * 10) / 10
  return diff
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

// Get rounds played for a course
function getRoundsForCourse(courseName) {
  return state.rounds.filter(r => r.course === courseName).length
}

// Render functions
function render() {
  const app = document.getElementById('app')

  switch (state.screen) {
    case 'splash':
      app.innerHTML = renderSplash()
      setTimeout(() => {
        state.screen = state.hasCompletedOnboarding ? 'home' : 'onboarding'
        render()
      }, 1000)
      break
    case 'onboarding':
      app.innerHTML = renderOnboarding()
      break
    case 'home':
      app.innerHTML = renderHome()
      break
    case 'settings':
      app.innerHTML = renderSettings()
      break
  }
}

function renderSplash() {
  return `
    <div class="splash">
      <div class="splash-logo">Fatside</div>
    </div>
  `
}

function renderOnboarding() {
  return `
    <header>
      <div class="logo">Fatside</div>
    </header>
    <div class="onboarding-content">
      <div class="onboarding-question">What's your handicap index?</div>
      <div class="onboarding-row">
        <input type="text" class="onboarding-input" id="handicapInput" placeholder="12.4" inputmode="decimal">
        <button class="onboarding-btn" data-action="submitHandicap">Start</button>
      </div>
      <div class="onboarding-skip" data-action="skipOnboarding">I don't have one yet</div>
    </div>
  `
}

function renderHome() {
  const handicap = getCurrentHandicap()
  const trend = getTrend()
  const hasRounds = state.rounds.length > 0

  let trendDisplay = ''
  if (trend !== null && trend !== 0) {
    const arrow = trend < 0 ? '↓' : '↑'
    const absVal = Math.abs(trend)
    trendDisplay = `<div class="handicap-trend">${arrow} ${absVal} since last round</div>`
  } else if (hasRounds) {
    trendDisplay = `<div class="handicap-trend">Based on ${state.rounds.length} round${state.rounds.length > 1 ? 's' : ''}</div>`
  }

  return `
    <header>
      <div class="logo">Fatside</div>
      <button class="btn-text" data-action="goTo" data-params="settings">Settings</button>
    </header>

    <section class="handicap-section">
      <div class="handicap-label">Handicap Index</div>
      <div class="handicap-row">
        <div class="handicap-number${handicap === null ? ' empty' : ''}">${handicap !== null ? handicap : '—'}</div>
        ${trendDisplay}
      </div>
    </section>

    <section class="rounds-section">
      ${hasRounds ? renderRoundsWithForm() : renderEmptyState()}
    </section>
  `
}

function renderRoundsWithForm() {
  if (state.showAddForm) {
    return `
      <div class="rounds-header">
        <div class="rounds-label">Add Round</div>
        <button class="btn-cancel" data-action="toggleAddForm">Cancel</button>
      </div>
      <div class="list">
        ${renderAddForm()}
      </div>
    `
  }

  return `
    <div class="rounds-header">
      <div class="rounds-label">Recent Rounds</div>
      <button class="btn" data-action="toggleAddForm">+ Add</button>
    </div>
    <div class="list">
      ${state.rounds.map(round => `
        <div class="list-item">
          <div class="list-item-title">${round.course}</div>
          <div class="list-item-value">+${round.differential}</div>
          <div class="list-item-meta">${formatDate(round.date)} · Par ${round.par}</div>
          <div class="list-item-meta-right">${round.score}</div>
        </div>
      `).join('')}
    </div>
  `
}

function renderAddForm() {
  const today = new Date().toISOString().split('T')[0]
  const hasCourses = state.courses.length > 0

  // Pre-fill with last played course
  const lastRound = state.rounds.length > 0 ? state.rounds[0] : null
  const courseName = lastRound ? lastRound.course : ''
  const rating = lastRound ? lastRound.rating : ''
  const slope = lastRound ? lastRound.slope : ''
  const par = lastRound ? lastRound.par : ''

  return `
    <div class="add-form">
      <div class="form-row">
        <div class="form-field">
          <label class="form-label">Course</label>
          <input type="text" class="form-input" id="courseInput" placeholder="Course name" value="${courseName}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field small">
          <label class="form-label">Rating</label>
          <input type="text" class="form-input" id="ratingInput" placeholder="72.3" inputmode="decimal" value="${rating}">
        </div>
        <div class="form-field small">
          <label class="form-label">Slope</label>
          <input type="text" class="form-input" id="slopeInput" placeholder="131" inputmode="numeric" value="${slope}">
        </div>
        <div class="form-field small">
          <label class="form-label">Par</label>
          <input type="text" class="form-input" id="parInput" placeholder="72" inputmode="numeric" value="${par}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field small">
          <label class="form-label">Score</label>
          <input type="text" class="form-input" id="scoreInput" placeholder="84" inputmode="numeric">
        </div>
        <div class="form-field">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="dateInput" value="${today}">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-save" data-action="saveRound">Save Round</button>
      </div>
    </div>
    ${hasCourses ? renderCoursesList() : ''}
  `
}

function renderCoursesList() {
  return state.courses.map(course => {
    const roundsPlayed = getRoundsForCourse(course.name)
    return `
      <div class="course-item" data-action="selectCourse" data-params="${course.name}|${course.rating}|${course.slope}|${course.par}">
        <div class="course-name">${course.name}</div>
        <div class="course-rating">${course.rating} / ${course.slope}</div>
        <div class="course-meta">Par ${course.par} · ${roundsPlayed} round${roundsPlayed !== 1 ? 's' : ''} played</div>
      </div>
    `
  }).join('')
}

function renderEmptyState() {
  const today = new Date().toISOString().split('T')[0]

  if (state.showAddForm) {
    return `
      <div class="rounds-header">
        <div class="rounds-label">Add Round</div>
        <button class="btn-cancel" data-action="toggleAddForm">Cancel</button>
      </div>
      <div class="list">
        <div class="add-form">
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Course</label>
              <input type="text" class="form-input" id="courseInput" placeholder="Course name">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field small">
              <label class="form-label">Rating</label>
              <input type="text" class="form-input" id="ratingInput" placeholder="72.3" inputmode="decimal">
            </div>
            <div class="form-field small">
              <label class="form-label">Slope</label>
              <input type="text" class="form-input" id="slopeInput" placeholder="131" inputmode="numeric">
            </div>
            <div class="form-field small">
              <label class="form-label">Par</label>
              <input type="text" class="form-input" id="parInput" placeholder="72" inputmode="numeric">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field small">
              <label class="form-label">Score</label>
              <input type="text" class="form-input" id="scoreInput" placeholder="84" inputmode="numeric">
            </div>
            <div class="form-field">
              <label class="form-label">Date</label>
              <input type="date" class="form-input" id="dateInput" value="${today}">
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-save" data-action="saveRound">Save Round</button>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="empty-state">
      <div class="empty-message">Add your first round to ${state.handicap !== null ? 'start tracking your handicap' : 'calculate your handicap index'}.</div>
      <button class="btn btn-primary" data-action="toggleAddForm">+ Add Round</button>
    </div>
  `
}

function renderSettings() {
  return `
    <header>
      <div class="logo">Settings</div>
      <button class="btn-text" data-action="goTo" data-params="home">Done</button>
    </header>

    <section class="section">
      <div class="list">
        <div class="list-item" data-action="exportData">
          <span class="list-item-label">Export Data</span>
        </div>
        <div class="list-item danger" data-action="deleteAllData">
          <span class="list-item-label">Delete All Data</span>
        </div>
      </div>
    </section>

    <div class="footer">
      <div class="version">Fatside v1.0</div>
    </div>
  `
}

// Actions
function goTo(screen) {
  state.screen = screen
  state.showAddForm = false
  render()
}

function submitHandicap() {
  const input = document.getElementById('handicapInput')
  const value = parseFloat(input.value)
  if (!isNaN(value)) {
    state.handicap = value
    state.previousHandicap = value // Set as baseline for trend
  }
  state.hasCompletedOnboarding = true
  saveState()
  state.screen = 'home'
  render()
}

function skipOnboarding() {
  state.handicap = null
  state.previousHandicap = null
  state.hasCompletedOnboarding = true
  saveState()
  state.screen = 'home'
  render()
}

function toggleAddForm() {
  state.showAddForm = !state.showAddForm
  render()
}

function selectCourse(name, rating, slope, par) {
  document.getElementById('courseInput').value = name
  document.getElementById('ratingInput').value = rating
  document.getElementById('slopeInput').value = slope
  document.getElementById('parInput').value = par
  // Focus on score input after selecting a course
  document.getElementById('scoreInput').focus()
}

function saveRound() {
  const course = document.getElementById('courseInput').value
  const rating = parseFloat(document.getElementById('ratingInput').value)
  const slope = parseInt(document.getElementById('slopeInput').value)
  const par = parseInt(document.getElementById('parInput').value)
  const score = parseInt(document.getElementById('scoreInput').value)
  const date = document.getElementById('dateInput').value

  if (!course || isNaN(rating) || isNaN(slope) || isNaN(par) || isNaN(score) || !date) {
    alert('Please fill in all fields')
    return
  }

  // Store previous handicap for trend calculation
  state.previousHandicap = getCurrentHandicap()

  const differential = calculateDifferential(score, rating, slope)

  // Add round
  state.rounds.unshift({ course, rating, slope, par, score, date, differential })

  // Add/update course
  const existingCourse = state.courses.find(c => c.name === course)
  if (!existingCourse) {
    state.courses.push({ name: course, rating, slope, par })
  }

  // Update handicap based on rounds
  state.handicap = calculateHandicap(state.rounds)

  state.showAddForm = false
  saveState()
  render()
}

function exportData() {
  const data = JSON.stringify({
    handicap: state.handicap,
    rounds: state.rounds,
    courses: state.courses
  }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'fatside-data.json'
  a.click()
}

function deleteAllData() {
  if (confirm('Delete all your data? This cannot be undone.')) {
    localStorage.removeItem('fatside')
    state = {
      screen: 'onboarding',
      handicap: null,
      previousHandicap: null,
      rounds: [],
      courses: [],
      showAddForm: false,
      hasCompletedOnboarding: false
    }
    render()
  }
}

// Event delegation for click handlers
document.addEventListener('click', function(e) {
  var target = e.target.closest('[data-action]')
  if (!target) return

  var action = target.dataset.action
  var params = target.dataset.params

  if (action === 'goTo') {
    goTo(params)
  } else if (action === 'submitHandicap') {
    submitHandicap()
  } else if (action === 'skipOnboarding') {
    skipOnboarding()
  } else if (action === 'toggleAddForm') {
    toggleAddForm()
  } else if (action === 'selectCourse') {
    var parts = params.split('|')
    selectCourse(parts[0], parseFloat(parts[1]), parseInt(parts[2]), parseInt(parts[3]))
  } else if (action === 'saveRound') {
    saveRound()
  } else if (action === 'exportData') {
    exportData()
  } else if (action === 'deleteAllData') {
    deleteAllData()
  }
})

// Init
loadState()
render()
