import { useState } from 'react'
import { Copy, MoreVertical, Trash2, Edit, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { ApiKey } from '@/renderer/types'
import { maskApiKey, formatDate, copyToClipboard } from '@/renderer/lib/utils'
import { Button } from './Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { useToast } from '@/renderer/hooks/useToast'

interface ApiKeyCardProps {
  apiKey: ApiKey
  onEdit: (apiKey: ApiKey) => void
  onDelete: (id: string) => void
}

export function ApiKeyCard({ apiKey, onEdit, onDelete }: ApiKeyCardProps) {
  const { toast } = useToast()
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      toast({
        title: '已复制',
        description: `${label} 已复制到剪贴板`,
      })
    } else {
      toast({
        title: '复制失败',
        description: '无法复制到剪贴板',
        variant: 'destructive',
      })
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const result = await window.electronAPI.testApiKey(
        apiKey.apiKey,
        apiKey.provider,
        apiKey.baseUrl
      )
      setTestResult(result)
      toast({
        title: result.success ? '连接成功' : '连接失败',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })
    } catch (error) {
      setTestResult({ success: false, message: '测试失败' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="glass-effect rounded-lg p-6 hover:border-white/20 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{apiKey.name}</h3>
          <p className="text-sm text-muted-foreground">{apiKey.provider}</p>
        </div>
        <div className="flex items-center gap-2">
          {testResult && (
            <div className="mr-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(apiKey)}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopy(apiKey.apiKey, 'API Key')}>
                <Copy className="h-4 w-4 mr-2" />
                复制 API Key
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(apiKey.id)}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">API Key</span>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1 bg-black/30 rounded text-sm font-mono">
              {maskApiKey(apiKey.apiKey)}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleCopy(apiKey.apiKey, 'API Key')}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {apiKey.baseUrl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Base URL</span>
            <div className="flex items-center gap-2">
              <code className="px-3 py-1 bg-black/30 rounded text-sm font-mono max-w-[200px] truncate">
                {apiKey.baseUrl}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(apiKey.baseUrl || '', 'Base URL')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            创建于 {formatDate(apiKey.createdAt)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                测试中...
              </>
            ) : (
              '测试连接'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
