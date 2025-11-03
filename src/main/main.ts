import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | null = null

const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'apikeys.json')

interface ApiKey {
  id: string
  name: string
  provider: string
  apiKey: string
  baseUrl?: string
  createdAt: string
  updatedAt: string
}

function readDatabase(): ApiKey[] {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([]))
      return []
    }
    const data = fs.readFileSync(dbPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to read database:', error)
    return []
  }
}

function writeDatabase(data: ApiKey[]): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Failed to write database:', error)
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a'
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('get-api-keys', async () => {
  return readDatabase()
})

ipcMain.handle('add-api-key', async (_, apiKey: Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'>) => {
  const keys = readDatabase()
  const newKey: ApiKey = {
    ...apiKey,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  keys.push(newKey)
  writeDatabase(keys)
  return newKey
})

ipcMain.handle('update-api-key', async (_, id: string, updates: Partial<ApiKey>) => {
  const keys = readDatabase()
  const index = keys.findIndex(k => k.id === id)
  if (index === -1) {
    throw new Error('API Key not found')
  }
  keys[index] = {
    ...keys[index],
    ...updates,
    id: keys[index].id,
    createdAt: keys[index].createdAt,
    updatedAt: new Date().toISOString()
  }
  writeDatabase(keys)
  return keys[index]
})

ipcMain.handle('delete-api-key', async (_, id: string) => {
  const keys = readDatabase()
  const filtered = keys.filter(k => k.id !== id)
  writeDatabase(filtered)
  return true
})

ipcMain.handle('test-api-key', async (_, apiKey: string, provider: string, baseUrl?: string) => {
  try {
    const url = baseUrl || getDefaultBaseUrl(provider)
    const response = await fetch(`${url}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (response.ok) {
      return { success: true, message: 'Connection successful' }
    } else {
      return { success: false, message: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Connection failed' }
  }
})

function getDefaultBaseUrl(provider: string): string {
  const defaults: Record<string, string> = {
    'openai': 'https://api.openai.com/v1',
    'anthropic': 'https://api.anthropic.com/v1',
    'google': 'https://generativelanguage.googleapis.com/v1',
    'cohere': 'https://api.cohere.ai/v1',
    'mistral': 'https://api.mistral.ai/v1'
  }
  return defaults[provider.toLowerCase()] || 'https://api.openai.com/v1'
}
