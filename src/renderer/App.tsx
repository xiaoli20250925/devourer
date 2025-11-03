import { useEffect, useState } from 'react'
import { Plus, Search, Key } from 'lucide-react'
import { ApiKey, ApiKeyFormData } from './types'
import { ApiKeyCard } from './components/ApiKeyCard'
import { ApiKeyDialog } from './components/ApiKeyDialog'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Toaster } from './components/Toaster'
import { useToast } from './hooks/useToast'

function App() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const keys = await window.electronAPI.getApiKeys()
      setApiKeys(keys)
    } catch (error) {
      console.error('Failed to load API keys:', error)
      toast({
        title: '加载失败',
        description: '无法加载 API Keys',
        variant: 'destructive',
      })
    }
  }

  const handleAddOrUpdate = async (data: ApiKeyFormData) => {
    try {
      if (editingKey) {
        const updated = await window.electronAPI.updateApiKey(editingKey.id, data)
        setApiKeys(apiKeys.map((k) => (k.id === updated.id ? updated : k)))
        toast({
          title: '更新成功',
          description: `${updated.name} 已更新`,
        })
      } else {
        const newKey = await window.electronAPI.addApiKey(data)
        setApiKeys([...apiKeys, newKey])
        toast({
          title: '添加成功',
          description: `${newKey.name} 已添加`,
        })
      }
      setEditingKey(null)
    } catch (error) {
      console.error('Failed to save API key:', error)
      toast({
        title: '保存失败',
        description: '无法保存 API Key',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    const key = apiKeys.find((k) => k.id === id)
    if (!key || !confirm(`确定要删除 "${key.name}" 吗？`)) return

    try {
      await window.electronAPI.deleteApiKey(id)
      setApiKeys(apiKeys.filter((k) => k.id !== id))
      toast({
        title: '删除成功',
        description: `${key.name} 已删除`,
      })
    } catch (error) {
      console.error('Failed to delete API key:', error)
      toast({
        title: '删除失败',
        description: '无法删除 API Key',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (apiKey: ApiKey) => {
    setEditingKey(apiKey)
    setDialogOpen(true)
  }

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-7xl mx-auto p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  API Key Manager
                </h1>
                <p className="text-muted-foreground mt-1">管理你的大模型 API Keys</p>
              </div>
            </div>
            <Button onClick={() => {
              setEditingKey(null)
              setDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              添加 API Key
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索 API Keys..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <main>
          {filteredKeys.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-6 bg-secondary/50 rounded-full mb-4">
                <Key className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? '未找到匹配的 API Keys' : '还没有 API Keys'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? '尝试调整搜索条件'
                  : '点击上方按钮添加你的第一个 API Key'}
              </p>
              {!searchQuery && (
                <Button onClick={() => {
                  setEditingKey(null)
                  setDialogOpen(true)
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加 API Key
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKeys.map((apiKey) => (
                <ApiKeyCard
                  key={apiKey.id}
                  apiKey={apiKey}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <ApiKeyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddOrUpdate}
        editingKey={editingKey}
      />

      <Toaster />
    </div>
  )
}

export default App
