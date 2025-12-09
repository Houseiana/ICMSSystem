'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
  ArrowRight,
  Flag,
  Folder,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  Play,
  X,
  Send,
  Mail
} from 'lucide-react'
import Calendar from '@/components/Calendar'
import MeetingForm from '@/components/MeetingForm'
import TaskForm from '@/components/TaskForm'
import ConfirmModal from '@/components/ConfirmModal'
import SendNotificationDialog from '@/components/SendNotificationDialog'

interface Meeting {
  id: number
  title: string
  description?: string
  date: string
  startTime: string
  endTime?: string
  location?: string
  locationType: string
  meetingLink?: string
  purpose?: string
  category: string
  organizer?: string
  participants?: string
  status: string
  notes?: string
  outcome?: string
}

interface DailyTask {
  id: number
  title: string
  description?: string
  date: string
  priority: string
  category: string
  status: string
  completedAt?: string
  notes?: string
  actionTaken?: string
  nextStep?: string
  transferredFrom?: number
  transferredTo?: string
  transferReason?: string
  assignedTo?: string
  dueTime?: string
}

export default function DailyOperationsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [allMeetingDates, setAllMeetingDates] = useState<Date[]>([])
  const [allTaskDates, setAllTaskDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null)
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit' | 'transfer'>('create')

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    type: 'meeting' | 'task'
    id: number | null
    title: string
  }>({ isOpen: false, type: 'meeting', id: null, title: '' })

  // Notification dialog
  const [notificationDialog, setNotificationDialog] = useState<{
    isOpen: boolean
    type: 'meeting-reminder' | 'task-assignment' | 'daily-tasks'
    data: any
  }>({ isOpen: false, type: 'meeting-reminder', data: {} })

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Fetch meetings and tasks for selected date
  const fetchDayData = async () => {
    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]

      const [meetingsRes, tasksRes] = await Promise.all([
        fetch(`/api/meetings?date=${dateStr}`),
        fetch(`/api/daily-tasks?date=${dateStr}`)
      ])

      if (meetingsRes.ok) {
        const meetingsData = await meetingsRes.json()
        setMeetings(meetingsData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }
    } catch (error) {
      console.error('Error fetching day data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all dates that have meetings/tasks (for calendar indicators)
  const fetchAllDates = async () => {
    try {
      // Get meetings and tasks for the current month +/- 1 month
      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 2, 0)

      const [meetingsRes, tasksRes] = await Promise.all([
        fetch(`/api/meetings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
        fetch(`/api/daily-tasks?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      ])

      if (meetingsRes.ok) {
        const meetingsData = await meetingsRes.json()
        setAllMeetingDates(meetingsData.map((m: Meeting) => new Date(m.date)))
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setAllTaskDates(tasksData.map((t: DailyTask) => new Date(t.date)))
      }
    } catch (error) {
      console.error('Error fetching all dates:', error)
    }
  }

  useEffect(() => {
    fetchDayData()
  }, [selectedDate])

  useEffect(() => {
    fetchAllDates()
  }, [selectedDate.getMonth()])

  // Meeting handlers
  const handleAddMeeting = () => {
    setEditingMeeting(null)
    setShowMeetingForm(true)
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setShowMeetingForm(true)
  }

  const handleDeleteMeeting = (meeting: Meeting) => {
    setDeleteModal({
      isOpen: true,
      type: 'meeting',
      id: meeting.id,
      title: meeting.title
    })
  }

  // Task handlers
  const handleAddTask = () => {
    setEditingTask(null)
    setTaskFormMode('create')
    setShowTaskForm(true)
  }

  const handleEditTask = (task: DailyTask) => {
    setEditingTask(task)
    setTaskFormMode('edit')
    setShowTaskForm(true)
  }

  const handleTransferTask = (task: DailyTask) => {
    setEditingTask(task)
    setTaskFormMode('transfer')
    setShowTaskForm(true)
  }

  const handleDeleteTask = (task: DailyTask) => {
    setDeleteModal({
      isOpen: true,
      type: 'task',
      id: task.id,
      title: task.title
    })
  }

  const handleMarkTaskComplete = async (task: DailyTask) => {
    try {
      const response = await fetch(`/api/daily-tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        })
      })

      if (response.ok) {
        fetchDayData()
        fetchAllDates()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Delete confirmation handler
  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return

    try {
      const endpoint = deleteModal.type === 'meeting'
        ? `/api/meetings/${deleteModal.id}`
        : `/api/daily-tasks/${deleteModal.id}`

      const response = await fetch(endpoint, { method: 'DELETE' })

      if (response.ok) {
        fetchDayData()
        fetchAllDates()
        setDeleteModal({ isOpen: false, type: 'meeting', id: null, title: '' })
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      URGENT: 'bg-red-100 text-red-700 border-red-200',
      HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      LOW: 'bg-green-100 text-green-700 border-green-200'
    }
    return styles[priority] || styles.MEDIUM
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SCHEDULED: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
      POSTPONED: 'bg-purple-100 text-purple-700',
      PENDING: 'bg-gray-100 text-gray-700',
      TRANSFERRED: 'bg-purple-100 text-purple-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      CLIENT: Users,
      INTERNAL: Folder,
      INTERVIEW: MessageSquare,
      REVIEW: CheckCircle2,
      GENERAL: CalendarIcon
    }
    return icons[category] || CalendarIcon
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-7 h-7 text-blue-600" />
          Daily Operations
        </h1>
        <p className="text-gray-600 mt-1">Manage your daily meetings and tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            meetingDates={allMeetingDates}
            taskDates={allTaskDates}
          />

          {/* Quick Stats */}
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Today&apos;s Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Meetings</span>
                <span className="text-sm font-semibold text-blue-600">{meetings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasks</span>
                <span className="text-sm font-semibold text-orange-600">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-semibold text-green-600">
                  {tasks.filter(t => t.status === 'COMPLETED').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Meetings and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Date Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {formatDate(selectedDate)}
            </h2>
          </div>

          {/* Meetings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Meetings
              </h3>
              <button
                onClick={handleAddMeeting}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Meeting
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No meetings scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map(meeting => {
                    const CategoryIcon = getCategoryIcon(meeting.category)
                    return (
                      <div
                        key={meeting.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(meeting.status)}`}>
                                {meeting.status}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {meeting.startTime}
                                {meeting.endTime && ` - ${meeting.endTime}`}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-800">{meeting.title}</h4>
                            {meeting.purpose && (
                              <p className="text-sm text-gray-600 mt-1">{meeting.purpose}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              {meeting.locationType === 'ONLINE' ? (
                                <span className="flex items-center gap-1">
                                  <Video className="w-4 h-4" />
                                  Online
                                </span>
                              ) : (
                                meeting.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {meeting.location}
                                  </span>
                                )
                              )}
                              {meeting.organizer && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {meeting.organizer}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setNotificationDialog({
                                isOpen: true,
                                type: 'meeting-reminder',
                                data: {
                                  id: meeting.id,
                                  title: meeting.title,
                                  recipientName: meeting.organizer
                                }
                              })}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Send Reminder"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditMeeting(meeting)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Meeting"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(meeting)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Meeting"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
                Tasks
              </h3>
              <div className="flex items-center gap-2">
                {tasks.length > 0 && (
                  <button
                    onClick={() => setNotificationDialog({
                      isOpen: true,
                      type: 'daily-tasks',
                      data: {
                        date: selectedDate.toISOString().split('T')[0],
                        title: `Daily Tasks for ${formatDate(selectedDate)}`
                      }
                    })}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    title="Send daily tasks email"
                  >
                    <Mail className="w-4 h-4" />
                    Send Tasks Email
                  </button>
                )}
                <button
                  onClick={handleAddTask}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No tasks for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        task.status === 'COMPLETED'
                          ? 'bg-green-50 border-green-200'
                          : task.status === 'TRANSFERRED'
                            ? 'bg-purple-50 border-purple-200'
                            : 'bg-gray-50 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleMarkTaskComplete(task)}
                          className={`mt-0.5 flex-shrink-0 ${
                            task.status === 'COMPLETED'
                              ? 'text-green-600'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          disabled={task.status === 'TRANSFERRED'}
                        >
                          {task.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                              {task.status}
                            </span>
                            {task.dueTime && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.dueTime}
                              </span>
                            )}
                          </div>

                          <h4 className={`font-medium ${
                            task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}

                          {/* Show notes, action taken, next step if available */}
                          {(task.notes || task.actionTaken || task.nextStep) && (
                            <div className="mt-2 space-y-1 text-sm">
                              {task.notes && (
                                <p className="text-gray-500">
                                  <span className="font-medium">Notes:</span> {task.notes}
                                </p>
                              )}
                              {task.actionTaken && (
                                <p className="text-blue-600">
                                  <span className="font-medium">Action:</span> {task.actionTaken}
                                </p>
                              )}
                              {task.nextStep && (
                                <p className="text-green-600">
                                  <span className="font-medium">Next:</span> {task.nextStep}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Transfer info */}
                          {task.status === 'TRANSFERRED' && task.transferredTo && (
                            <p className="text-sm text-purple-600 mt-2 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              Transferred to {new Date(task.transferredTo).toLocaleDateString()}
                              {task.transferReason && ` - ${task.transferReason}`}
                            </p>
                          )}

                          {task.assignedTo && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {task.assignedTo}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {task.assignedTo && task.status !== 'COMPLETED' && task.status !== 'TRANSFERRED' && (
                            <button
                              onClick={() => setNotificationDialog({
                                isOpen: true,
                                type: 'task-assignment',
                                data: {
                                  id: task.id,
                                  title: task.title,
                                  recipientName: task.assignedTo
                                }
                              })}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Send Task Notification"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {task.status !== 'COMPLETED' && task.status !== 'TRANSFERRED' && (
                            <button
                              onClick={() => handleTransferTask(task)}
                              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Transfer to another day"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Form Modal */}
      <MeetingForm
        isOpen={showMeetingForm}
        onClose={() => {
          setShowMeetingForm(false)
          setEditingMeeting(null)
        }}
        onSuccess={() => {
          fetchDayData()
          fetchAllDates()
        }}
        meeting={editingMeeting}
        selectedDate={selectedDate}
      />

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false)
          setEditingTask(null)
          setTaskFormMode('create')
        }}
        onSuccess={() => {
          fetchDayData()
          fetchAllDates()
        }}
        task={editingTask}
        selectedDate={selectedDate}
        mode={taskFormMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Delete ${deleteModal.type === 'meeting' ? 'Meeting' : 'Task'}`}
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ isOpen: false, type: 'meeting', id: null, title: '' })}
      />

      {/* Send Notification Dialog */}
      <SendNotificationDialog
        isOpen={notificationDialog.isOpen}
        onClose={() => setNotificationDialog({ isOpen: false, type: 'meeting-reminder', data: {} })}
        type={notificationDialog.type}
        data={notificationDialog.data}
      />
    </div>
  )
}
