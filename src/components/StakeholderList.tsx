'use client'

import React from 'react'

import { Edit, Trash2, Mail, Phone, Briefcase, Heart, Users } from 'lucide-react'

interface Stakeholder {
  id: number
  firstName: string
  middleName?: string
  lastName: string
  preferredName?: string
  email?: string
  phone?: string
  gender?: string
  occupation?: string
  spouse?: {
    id: number
    firstName: string
    lastName: string
  }
  father?: {
    id: number
    firstName: string
    lastName: string
  }
  mother?: {
    id: number
    firstName: string
    lastName: string
  }
  childrenAsFather?: Stakeholder[]
  childrenAsMother?: Stakeholder[]
  relationships?: any[]
  relatedTo?: any[]
}

interface StakeholderListProps {
  stakeholders: Stakeholder[]
  onEdit: (stakeholder: Stakeholder) => void
  onRefresh: () => void
}

export default function StakeholderList({
  stakeholders,
  onEdit,
  onRefresh
}: StakeholderListProps) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this stakeholder?')) {
      try {
        const response = await fetch(`/api/stakeholders/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          onRefresh()
        } else {
          alert('Failed to delete stakeholder')
        }
      } catch (error) {
        console.error('Error deleting stakeholder:', error)
        alert('Failed to delete stakeholder')
      }
    }
  }

  const getFullName = (stakeholder: Stakeholder) => {
    const parts = [stakeholder.firstName, stakeholder.middleName, stakeholder.lastName]
    return parts.filter(Boolean).join(' ')
  }

  const getRelationshipCount = (stakeholder: Stakeholder) => {
    let count = 0
    if (stakeholder.spouse) count++
    if (stakeholder.father) count++
    if (stakeholder.mother) count++
    if (stakeholder.childrenAsFather?.length) count += stakeholder.childrenAsFather.length
    if (stakeholder.childrenAsMother?.length) count += stakeholder.childrenAsMother.length
    if (stakeholder.relationships?.length) count += stakeholder.relationships.length
    if (stakeholder.relatedTo?.length) count += stakeholder.relatedTo.length
    return count
  }

  if (stakeholders.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders found</h3>
        <p className="text-gray-500">Get started by adding your first stakeholder.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Occupation</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Family</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Relationships</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stakeholders.map((stakeholder) => (
              <tr key={stakeholder.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {getFullName(stakeholder)}
                    </div>
                    {stakeholder.preferredName && (
                      <div className="text-sm text-gray-500">
                        Preferred: {stakeholder.preferredName}
                      </div>
                    )}
                    {stakeholder.gender && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        stakeholder.gender === 'MALE'
                          ? 'bg-blue-100 text-blue-800'
                          : stakeholder.gender === 'FEMALE'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stakeholder.gender}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    {stakeholder.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {stakeholder.email}
                      </div>
                    )}
                    {stakeholder.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {stakeholder.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {stakeholder.occupation && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {stakeholder.occupation}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    {stakeholder.spouse && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        {stakeholder.spouse.firstName} {stakeholder.spouse.lastName}
                      </div>
                    )}
                    {stakeholder.father && (
                      <div className="text-sm text-gray-600">
                        Father: {stakeholder.father.firstName} {stakeholder.father.lastName}
                      </div>
                    )}
                    {stakeholder.mother && (
                      <div className="text-sm text-gray-600">
                        Mother: {stakeholder.mother.firstName} {stakeholder.mother.lastName}
                      </div>
                    )}
                    {((stakeholder.childrenAsFather?.length || 0) + (stakeholder.childrenAsMother?.length || 0)) > 0 && (
                      <div className="text-sm text-gray-600">
                        Children: {(stakeholder.childrenAsFather?.length || 0) + (stakeholder.childrenAsMother?.length || 0)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">
                      {getRelationshipCount(stakeholder)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {getRelationshipCount(stakeholder) === 1 ? 'connection' : 'connections'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(stakeholder)}
                      className="p-2 hover:bg-blue-100"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(stakeholder.id)}
                      className="p-2 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}