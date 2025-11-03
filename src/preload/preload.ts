import { contextBridge, ipcRenderer } from 'electron'

export interface ApiKey {
  id: string
  name: string
  provider: string
  apiKey: string
  baseUrl?: string
  createdAt: string
  updatedAt: string
}

export interface TestResult {
  success: boolean
  message: string
}

contextBridge.exposeInMainWorld('electronAPI', {
  getApiKeys: () => ipcRenderer.invoke('get-api-keys'),
  addApiKey: (apiKey: Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'>) => 
    ipcRenderer.invoke('add-api-key', apiKey),
  updateApiKey: (id: string, updates: Partial<ApiKey>) => 
    ipcRenderer.invoke('update-api-key', id, updates),
  deleteApiKey: (id: string) => 
    ipcRenderer.invoke('delete-api-key', id),
  testApiKey: (apiKey: string, provider: string, baseUrl?: string) => 
    ipcRenderer.invoke('test-api-key', apiKey, provider, baseUrl)
})

declare global {
  interface Window {
    electronAPI: {
      getApiKeys: () => Promise<ApiKey[]>
      addApiKey: (apiKey: Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ApiKey>
      updateApiKey: (id: string, updates: Partial<ApiKey>) => Promise<ApiKey>
      deleteApiKey: (id: string) => Promise<boolean>
      testApiKey: (apiKey: string, provider: string, baseUrl?: string) => Promise<TestResult>
    }
  }
}
