import zxcvbn from 'zxcvbn'

const API = 'http://localhost:3000/api'

let token = null

const loginPage = document.getElementById('login-page')
const vaultPage = document.getElementById('vault-page')
const authError = document.getElementById('auth-error')

document.getElementById('register-btn').addEventListener('click', async() => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({email,password})
  })

  const data = await res.json()

  if(!res.ok) return authError.textContent = data.error
  authError.textContent = 'Account created! You can now log in!'
})


document.getElementById('login-btn').addEventListener('click', async() => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({email,password})
  })

  const data = await res.json()

  if(!res.ok) return authError.textContent = data.error

  token = data.token
  showVault()
})


document.getElementById('logout-btn').addEventListener('click', () => {
  token = null
  vaultPage.classList.add('hidden')
  loginPage.classList.remove('hidden')
})



async function showVault() {
  loginPage.classList.add('hidden')
  vaultPage.classList.remove('hidden')
  loadEntries()
}

async function loadEntries() {
  const res     = await fetch(`${API}/vault`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const entries = await res.json()
  
  const list = document.getElementById('entries-list')
  list.innerHTML = ''

   entries.forEach(entry => {
    list.innerHTML += `
      <div class="entry">
        <div class="entry-info">
          <span class="entry-title">${entry.title}</span>
          <span class="entry-data">${entry.data}</span>
        </div>
        <button class="delete" onclick="deleteEntry(${entry.id})">Delete</button>
      </div>
    `
  })
}


document.getElementById('save-btn').addEventListener('click', async () => {
  const title = document.getElementById('entry-title').value
  const data  = document.getElementById('entry-data').value

  await fetch(`${API}/vault`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, data })
  })

  document.getElementById('entry-title').value = ''
  document.getElementById('entry-data').value  = ''
  loadEntries()
})


window.deleteEntry = async (id) => {
  await fetch(`${API}/vault/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  loadEntries()
}


document.getElementById('entry-data').addEventListener('input', (e) => {
  const result = zxcvbn(e.target.value)
  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1']

  let indicator = document.getElementById('strength')

  if(!indicator){
    indicator = document.createElement('p')
    indicator.id = 'strength'
    indicator.style.fontSize = '0.85rem'
    e.target.after(indicator)
  }

  indicator.textContent = `Strength: ${labels[result.score]}`
  indicator.style.color = colors[result.score]
})