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

export type ApiKeyFormData = Omit<ApiKey, 'id' | 'createdAt' | 'updatedAt'>
