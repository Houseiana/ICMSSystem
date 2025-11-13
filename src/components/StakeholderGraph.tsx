'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

interface Stakeholder {
  id: number
  firstName: string
  middleName?: string
  lastName: string
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
  relationships?: Array<{
    id: number
    relationshipType: string
    to: {
      id: number
      firstName: string
      lastName: string
    }
  }>
  relatedTo?: Array<{
    id: number
    relationshipType: string
    from: {
      id: number
      firstName: string
      lastName: string
    }
  }>
}

interface StakeholderGraphProps {
  stakeholders: Stakeholder[]
  onSelectStakeholder: (stakeholder: Stakeholder) => void
}

const StakeholderNode = ({ data }: { data: any }) => {
  const { stakeholder, onSelect } = data

  const getNodeColor = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return 'bg-blue-100 border-blue-300'
      case 'FEMALE':
        return 'bg-pink-100 border-pink-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md border-2 ${getNodeColor(stakeholder.gender)} cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={() => onSelect(stakeholder)}
    >
      <div className="font-bold text-sm">
        {stakeholder.firstName} {stakeholder.lastName}
      </div>
      {stakeholder.occupation && (
        <div className="text-xs text-gray-600 mt-1">
          {stakeholder.occupation}
        </div>
      )}
      {stakeholder.spouse && (
        <div className="text-xs text-red-600 mt-1 flex items-center">
          ❤️ Married
        </div>
      )}
    </div>
  )
}

const nodeTypes = {
  stakeholder: StakeholderNode
}

export default function StakeholderGraph({
  stakeholders,
  onSelectStakeholder
}: StakeholderGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Generate nodes and edges from stakeholders
  const { generatedNodes, generatedEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const nodePositions = new Map()

    // Create a circular layout
    const centerX = 400
    const centerY = 300
    const radius = 200
    const angleStep = (2 * Math.PI) / stakeholders.length

    stakeholders.forEach((stakeholder, index) => {
      const angle = index * angleStep
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      nodePositions.set(stakeholder.id, { x, y })

      nodes.push({
        id: stakeholder.id.toString(),
        type: 'stakeholder',
        position: { x, y },
        data: {
          stakeholder,
          onSelect: onSelectStakeholder
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      })
    })

    // Create edges for relationships
    stakeholders.forEach((stakeholder) => {
      // Spouse relationships
      if (stakeholder.spouse) {
        const edgeId = `${Math.min(stakeholder.id, stakeholder.spouse.id)}-${Math.max(stakeholder.id, stakeholder.spouse.id)}-spouse`

        // Avoid duplicate spouse edges
        if (!edges.find(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: stakeholder.id.toString(),
            target: stakeholder.spouse.id.toString(),
            type: 'straight',
            style: { stroke: '#ef4444', strokeWidth: 3 },
            label: '💕 Married',
            labelStyle: { fill: '#ef4444', fontWeight: 600, fontSize: '12px' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#ef4444'
            }
          })
        }
      }

      // Parent-child relationships
      if (stakeholder.father) {
        edges.push({
          id: `${stakeholder.father.id}-${stakeholder.id}-father`,
          source: stakeholder.father.id.toString(),
          target: stakeholder.id.toString(),
          type: 'straight',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          label: '👨 Father',
          labelStyle: { fill: '#3b82f6', fontWeight: 500, fontSize: '11px' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6'
          }
        })
      }

      if (stakeholder.mother) {
        edges.push({
          id: `${stakeholder.mother.id}-${stakeholder.id}-mother`,
          source: stakeholder.mother.id.toString(),
          target: stakeholder.id.toString(),
          type: 'straight',
          style: { stroke: '#ec4899', strokeWidth: 2 },
          label: '👩 Mother',
          labelStyle: { fill: '#ec4899', fontWeight: 500, fontSize: '11px' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#ec4899'
          }
        })
      }

      // Other relationships
      if (stakeholder.relationships) {
        stakeholder.relationships.forEach((rel) => {
          const getRelationshipStyle = (type: string) => {
            switch (type.toLowerCase()) {
              case 'sibling':
                return { color: '#10b981', label: '👫 Sibling' }
              case 'friend':
                return { color: '#f59e0b', label: '👯 Friend' }
              case 'colleague':
                return { color: '#8b5cf6', label: '🤝 Colleague' }
              case 'business_partner':
                return { color: '#06b6d4', label: '💼 Business' }
              default:
                return { color: '#6b7280', label: '🔗 Related' }
            }
          }

          const style = getRelationshipStyle(rel.relationshipType)

          edges.push({
            id: `${stakeholder.id}-${rel.to.id}-${rel.relationshipType}`,
            source: stakeholder.id.toString(),
            target: rel.to.id.toString(),
            type: 'bezier',
            style: { stroke: style.color, strokeWidth: 1, strokeDasharray: '5,5' },
            label: style.label,
            labelStyle: { fill: style.color, fontWeight: 500, fontSize: '10px' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: style.color
            }
          })
        })
      }
    })

    return { generatedNodes: nodes, generatedEdges: edges }
  }, [stakeholders, onSelectStakeholder])

  useEffect(() => {
    setNodes(generatedNodes)
    setEdges(generatedEdges)
  }, [generatedNodes, generatedEdges, setNodes, setEdges])

  if (stakeholders.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholder relationships to visualize</h3>
          <p className="text-gray-500">Add stakeholders and their relationships to see the network graph.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.data?.stakeholder?.gender === 'MALE') return '#3b82f6'
            if (n.data?.stakeholder?.gender === 'FEMALE') return '#ec4899'
            return '#6b7280'
          }}
          nodeColor={(n) => {
            if (n.data?.stakeholder?.gender === 'MALE') return '#dbeafe'
            if (n.data?.stakeholder?.gender === 'FEMALE') return '#fce7f3'
            return '#f3f4f6'
          }}
          nodeBorderRadius={2}
        />
        <Background color="#aaa" gap={16} />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
        <h4 className="font-medium text-gray-900 mb-3">Relationship Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-red-500 mr-2"></div>
            <span>💕 Married</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-500 mr-2"></div>
            <span>👨 Father</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-pink-500 mr-2"></div>
            <span>👩 Mother</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-emerald-500 mr-2 border-dashed border-t"></div>
            <span>👫 Sibling</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-amber-500 mr-2 border-dashed border-t"></div>
            <span>👯 Friend</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-purple-500 mr-2 border-dashed border-t"></div>
            <span>🤝 Colleague</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t text-xs text-gray-600">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></div>
            <span>Male</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded mr-2"></div>
            <span>Female</span>
          </div>
        </div>
      </div>
    </div>
  )
}