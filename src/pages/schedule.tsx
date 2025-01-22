// src/pages/schedule.tsx
import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2,
} from 'lucide-react'

interface ScheduleItem {
  id: string
  title: string
  description?: string
  day: string
  time: string
  duration: number // em minutos
  category: string
  priority: 'low' | 'medium' | 'high'
  isRecurring: boolean
}

const DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
]

const CATEGORIES = [
  'Trabalho',
  'Estudo',
  'Exercício',
  'Lazer',
  'Pessoal',
  'Outros'
]

export default function Schedule() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[1]) // Segunda por padrão
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    day: DAYS[1],
    time: '09:00',
    duration: 60,
    category: 'Trabalho',
    priority: 'medium',
    isRecurring: false
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('scheduleItems')
    if (savedItems) {
      setScheduleItems(JSON.parse(savedItems))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('scheduleItems', JSON.stringify(scheduleItems))
  }, [scheduleItems])

  const handleAddItem = () => {
    if (!newItem.title?.trim()) return

    const item: ScheduleItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      day: newItem.day || DAYS[1],
      time: newItem.time || '09:00',
      duration: newItem.duration || 60,
      category: newItem.category || 'Trabalho',
      priority: newItem.priority || 'medium',
      isRecurring: newItem.isRecurring || false
    }

    setScheduleItems([...scheduleItems, item])
    setIsModalOpen(false)
    setNewItem({
      day: DAYS[1],
      time: '09:00',
      duration: 60,
      category: 'Trabalho',
      priority: 'medium',
      isRecurring: false
    })
  }

  const handleDeleteItem = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id))
  }

  const getPriorityColor = (priority: ScheduleItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Cronograma Semanal</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Item
            </button>
          </div>
        </div>
      </nav>

      {/* Seletor de Dias */}
      <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg ${
                selectedDay === day 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Itens */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {scheduleItems
            .filter(item => item.day === selectedDay)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(item => (
            <div key={item.id} className="p-4 border-b hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.time}</span>
                    <span className="text-xs text-gray-500">{item.duration}min</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {item.category}
                      </span>
                      {item.isRecurring && (
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-600">
                          Recorrente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de Novo Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4">Novo Item no Cronograma</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={newItem.title || ''}
                onChange={e => setNewItem({...newItem, title: e.target.value})}
                className="w-full rounded-lg border-gray-300"
              />
              
              <textarea
                placeholder="Descrição (opcional)"
                value={newItem.description || ''}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
                className="w-full rounded-lg border-gray-300"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newItem.day}
                  onChange={e => setNewItem({...newItem, day: e.target.value})}
                  className="rounded-lg border-gray-300"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>

                <input
                  type="time"
                  value={newItem.time}
                  onChange={e => setNewItem({...newItem, time: e.target.value})}
                  className="rounded-lg border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                  className="rounded-lg border-gray-300"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={newItem.priority}
                  onChange={e => setNewItem({...newItem, priority: e.target.value as ScheduleItem['priority']})}
                  className="rounded-lg border-gray-300"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newItem.isRecurring}
                  onChange={e => setNewItem({...newItem, isRecurring: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="recurring">Atividade Recorrente</label>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}