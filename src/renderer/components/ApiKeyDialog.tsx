import { useEffect, useState } from 'react'
import { ApiKey, ApiKeyFormData } from '@/renderer/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from './Button'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ApiKeyFormData) => void
  editingKey?: ApiKey | null
}

const providers = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Cohere',
  'Mistral',
  'Custom',
]

export function ApiKeyDialog({ open, onOpenChange, onSubmit, editingKey }: ApiKeyDialogProps) {
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    provider: 'OpenAI',
    apiKey: '',
    baseUrl: '',
  })

  useEffect(() => {
    if (editingKey) {
      setFormData({
        name: editingKey.name,
        provider: editingKey.provider,
        apiKey: editingKey.apiKey,
        baseUrl: editingKey.baseUrl || '',
      })
    } else {
      setFormData({
        name: '',
        provider: 'OpenAI',
        apiKey: '',
        baseUrl: '',
      })
    }
  }, [editingKey, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editingKey ? '编辑 API Key' : '添加 API Key'}</DialogTitle>
          <DialogDescription>
            {editingKey ? '修改现有的 API Key 信息' : '添加一个新的大模型 API Key'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                placeholder="例如：我的 OpenAI Key"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="provider">提供商</Label>
              <select
                id="provider"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                required
              >
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baseUrl">Base URL (可选)</Label>
              <Input
                id="baseUrl"
                placeholder="https://api.openai.com/v1"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{editingKey ? '保存' : '添加'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
