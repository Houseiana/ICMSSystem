'use client'

import React, { Component } from 'react'
import { FamilyMemberSelector } from './FamilyMemberSelector'

interface Employer {
  id: number
  employerType: string
  displayName: string
  description: string
}

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  employee?: any
  mode: 'view' | 'edit' | 'create'
  onSave?: (data: any) => void
  loading?: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'full'
}

interface ChildInfo {
  id: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  placeOfBirth: string
  gender: string
  nationality: string
  bloodGroup: string
  isDependent: boolean
}

interface FormState {
  formData: {
    // Basic Information (MANDATORY)
    empId: string
    firstName: string
    lastName: string
    email: string
    department: string
    employerId: string
    position: string
    hireDate: string
    // Personal Information (OPTIONAL)
    middleName: string
    preferredName: string
    personalEmail: string
    phone: string
    alternatePhone: string
    dateOfBirth: string
    placeOfBirth: string
    gender: string
    maritalStatus: string
    bloodGroup: string
    nationality: string
    religion: string
    languages: string
    // Address Information
    currentAddress: string
    permanentAddress: string
    city: string
    state: string
    postalCode: string
    country: string
    // Identification Documents
    nationalId: string
    passportNumber: string
    passportExpiry: string
    drivingLicense: string
    licenseExpiry: string
    visaStatus: string
    visaExpiry: string
    // QID (Qatar ID) Information
    qidNumber: string
    qidIssueDate: string
    qidExpiryDate: string
    qidLocation: string
    // Document URLs (Dropbox Links)
    photoUrl: string
    qidDocumentUrl: string
    passportDocumentUrl: string
    // Emergency Contacts
    emergencyContact1Name: string
    emergencyContact1Relation: string
    emergencyContact1Phone: string
    emergencyContact1Address: string
    emergencyContact2Name: string
    emergencyContact2Relation: string
    emergencyContact2Phone: string
    emergencyContact2Address: string
    // Education & Qualifications
    highestEducation: string
    university: string
    graduationYear: string
    fieldOfStudy: string
    certifications: string
    skills: string
    // Employment Details
    salary: string
    currency: string
    bankAccount: string
    bankName: string
    bankBranch: string
    taxId: string
    socialSecurityNumber: string
    confirmationDate: string
    status: string
    employeeType: string
    workLocation: string
    // Medical Information
    medicalConditions: string
    allergies: string
    medications: string
    // Family Information
    fatherFirstName: string
    fatherMiddleName: string
    fatherLastName: string
    fatherDateOfBirth: string
    fatherPlaceOfBirth: string
    fatherNationality: string
    fatherOccupation: string
    fatherPhone: string
    fatherNationalId: string
    motherFirstName: string
    motherMiddleName: string
    motherLastName: string
    motherDateOfBirth: string
    motherPlaceOfBirth: string
    motherNationality: string
    motherOccupation: string
    motherPhone: string
    motherNationalId: string
    spouseFirstName: string
    spouseMiddleName: string
    spouseLastName: string
    spouseDateOfBirth: string
    spousePlaceOfBirth: string
    spouseNationality: string
    spouseDateOfMarriage: string
    spouseOccupation: string
    spouseEmployer: string
    spousePhone: string
    spouseNationalId: string
  }
  // Stakeholder IDs for family members (when selected from stakeholders)
  fatherStakeholderId?: number
  motherStakeholderId?: number
  spouseStakeholderId?: number
  hasChildren: boolean
  numberOfChildren: number
  children: ChildInfo[]
  employers: Employer[]
  loadingEmployers: boolean
  // Travel History
  travelHistory: TravelHistoryEntry[]
}

interface TravelHistoryEntry {
  id?: number
  country: string
  dateOfEntry: string
  dateOfExit: string
  purposeOfTravel: string
  accompanyingPerson: string
}

export default class UnifiedEmployeeForm extends Component<EmployeeFormProps, FormState> {
  constructor(props: EmployeeFormProps) {
    super(props)

    this.state = {
      formData: {
        // Basic Information (MANDATORY)
        empId: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        employerId: '',
        position: '',
        hireDate: '',
        // Personal Information (OPTIONAL)
        middleName: '',
        preferredName: '',
        personalEmail: '',
        phone: '',
        alternatePhone: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        maritalStatus: '',
        bloodGroup: '',
        nationality: '',
        religion: '',
        languages: '',
        // Address Information
        currentAddress: '',
        permanentAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        // Identification Documents
        nationalId: '',
        passportNumber: '',
        passportExpiry: '',
        drivingLicense: '',
        licenseExpiry: '',
        visaStatus: '',
        visaExpiry: '',
        // QID (Qatar ID) Information
        qidNumber: '',
        qidIssueDate: '',
        qidExpiryDate: '',
        qidLocation: '',
        // Document URLs (Dropbox Links)
        photoUrl: '',
        qidDocumentUrl: '',
        passportDocumentUrl: '',
        // Emergency Contacts
        emergencyContact1Name: '',
        emergencyContact1Relation: '',
        emergencyContact1Phone: '',
        emergencyContact1Address: '',
        emergencyContact2Name: '',
        emergencyContact2Relation: '',
        emergencyContact2Phone: '',
        emergencyContact2Address: '',
        // Education & Qualifications
        highestEducation: '',
        university: '',
        graduationYear: '',
        fieldOfStudy: '',
        certifications: '',
        skills: '',
        // Employment Details
        salary: '',
        currency: 'USD',
        bankAccount: '',
        bankName: '',
        bankBranch: '',
        taxId: '',
        socialSecurityNumber: '',
        confirmationDate: '',
        status: 'ACTIVE',
        employeeType: 'FULL_TIME',
        workLocation: 'OFFICE',
        // Medical Information
        medicalConditions: '',
        allergies: '',
        medications: '',
        // Family Information
        fatherFirstName: '',
        fatherMiddleName: '',
        fatherLastName: '',
        fatherDateOfBirth: '',
        fatherPlaceOfBirth: '',
        fatherNationality: '',
        fatherOccupation: '',
        fatherPhone: '',
        fatherNationalId: '',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',
        motherDateOfBirth: '',
        motherPlaceOfBirth: '',
        motherNationality: '',
        motherOccupation: '',
        motherPhone: '',
        motherNationalId: '',
        spouseFirstName: '',
        spouseMiddleName: '',
        spouseLastName: '',
        spouseDateOfBirth: '',
        spousePlaceOfBirth: '',
        spouseNationality: '',
        spouseDateOfMarriage: '',
        spouseOccupation: '',
        spouseEmployer: '',
        spousePhone: '',
        spouseNationalId: ''
      },
      hasChildren: false,
      numberOfChildren: 0,
      children: [],
      employers: [],
      loadingEmployers: false,
      travelHistory: []
    }
  }

  componentDidMount() {
    this.fetchEmployers()
  }

  fetchEmployers = async () => {
    try {
      this.setState({ loadingEmployers: true })
      console.log('Fetching employers from /api/employers/list...')
      const response = await fetch('/api/employers/list')
      console.log('Employers response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Employers data received:', data)
        console.log('Number of employers:', data.employers?.length || 0)
        this.setState({ employers: data.employers || [] })
      } else {
        console.error('Failed to fetch employers:', response.status, response.statusText)
        const errorData = await response.json().catch(() => null)
        console.error('Error details:', errorData)
      }
    } catch (error) {
      console.error('Error fetching employers:', error)
    } finally {
      this.setState({ loadingEmployers: false })
    }
  }

  componentDidUpdate(prevProps: EmployeeFormProps) {
    // Refetch employers when form opens
    if (this.props.isOpen && !prevProps.isOpen) {
      this.fetchEmployers()
    }

    if (this.props.employee && this.props.isOpen &&
        (prevProps.employee !== this.props.employee || prevProps.isOpen !== this.props.isOpen)) {
      this.populateFormData()
    } else if (this.props.mode === 'create' && this.props.isOpen &&
               prevProps.isOpen !== this.props.isOpen) {
      this.resetFormData()
    }
  }

  populateFormData = () => {
    const { employee } = this.props
    if (!employee) return

    this.setState({
      formData: {
        empId: employee.empId || '',
        firstName: employee.firstName || '',
        middleName: employee.middleName || '',
        lastName: employee.lastName || '',
        preferredName: employee.preferredName || '',
        email: employee.email || '',
        personalEmail: employee.personalEmail || '',
        phone: employee.phone || '',
        alternatePhone: employee.alternatePhone || '',
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
        placeOfBirth: employee.placeOfBirth || '',
        gender: employee.gender || '',
        maritalStatus: employee.maritalStatus || '',
        bloodGroup: employee.bloodGroup || '',
        nationality: employee.nationality || '',
        religion: employee.religion || '',
        languages: employee.languages || '',
        currentAddress: employee.currentAddress || '',
        permanentAddress: employee.permanentAddress || '',
        city: employee.city || '',
        state: employee.state || '',
        postalCode: employee.postalCode || '',
        country: employee.country || '',
        nationalId: employee.nationalId || '',
        passportNumber: employee.passportNumber || '',
        passportExpiry: employee.passportExpiry ? employee.passportExpiry.split('T')[0] : '',
        drivingLicense: employee.drivingLicense || '',
        licenseExpiry: employee.licenseExpiry ? employee.licenseExpiry.split('T')[0] : '',
        visaStatus: employee.visaStatus || '',
        visaExpiry: employee.visaExpiry ? employee.visaExpiry.split('T')[0] : '',
        qidNumber: employee.qidNumber || '',
        qidIssueDate: employee.qidIssueDate ? employee.qidIssueDate.split('T')[0] : '',
        qidExpiryDate: employee.qidExpiryDate ? employee.qidExpiryDate.split('T')[0] : '',
        qidLocation: employee.qidLocation || '',
        photoUrl: employee.photoUrl || '',
        qidDocumentUrl: employee.qidDocumentUrl || '',
        passportDocumentUrl: employee.passportDocumentUrl || '',
        emergencyContact1Name: employee.emergencyContact1Name || '',
        emergencyContact1Relation: employee.emergencyContact1Relation || '',
        emergencyContact1Phone: employee.emergencyContact1Phone || '',
        emergencyContact1Address: employee.emergencyContact1Address || '',
        emergencyContact2Name: employee.emergencyContact2Name || '',
        emergencyContact2Relation: employee.emergencyContact2Relation || '',
        emergencyContact2Phone: employee.emergencyContact2Phone || '',
        emergencyContact2Address: employee.emergencyContact2Address || '',
        highestEducation: employee.highestEducation || '',
        university: employee.university || '',
        graduationYear: employee.graduationYear?.toString() || '',
        fieldOfStudy: employee.fieldOfStudy || '',
        certifications: employee.certifications || '',
        skills: employee.skills || '',
        department: employee.department?.name || '',
        employerId: employee.employerId?.toString() || '',
        position: employee.position?.title || '',
        salary: employee.salary?.toString() || '',
        currency: employee.currency || 'USD',
        bankAccount: employee.bankAccount || '',
        bankName: employee.bankName || '',
        bankBranch: employee.bankBranch || '',
        taxId: employee.taxId || '',
        socialSecurityNumber: employee.socialSecurityNumber || '',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        confirmationDate: employee.confirmationDate ? employee.confirmationDate.split('T')[0] : '',
        status: employee.status || 'ACTIVE',
        employeeType: employee.employeeType || 'FULL_TIME',
        workLocation: employee.workLocation || 'OFFICE',
        medicalConditions: employee.medicalConditions || '',
        allergies: employee.allergies || '',
        medications: employee.medications || '',
        fatherFirstName: employee.father?.firstName || '',
        fatherMiddleName: employee.father?.middleName || '',
        fatherLastName: employee.father?.lastName || '',
        fatherDateOfBirth: employee.father?.dateOfBirth ? employee.father.dateOfBirth.split('T')[0] : '',
        fatherPlaceOfBirth: employee.father?.placeOfBirth || '',
        fatherNationality: employee.father?.nationality || '',
        fatherOccupation: employee.father?.occupation || '',
        fatherPhone: employee.father?.phone || '',
        fatherNationalId: employee.father?.nationalId || '',
        motherFirstName: employee.mother?.firstName || '',
        motherMiddleName: employee.mother?.middleName || '',
        motherLastName: employee.mother?.lastName || '',
        motherDateOfBirth: employee.mother?.dateOfBirth ? employee.mother.dateOfBirth.split('T')[0] : '',
        motherPlaceOfBirth: employee.mother?.placeOfBirth || '',
        motherNationality: employee.mother?.nationality || '',
        motherOccupation: employee.mother?.occupation || '',
        motherPhone: employee.mother?.phone || '',
        motherNationalId: employee.mother?.nationalId || '',
        spouseFirstName: employee.spouse?.firstName || '',
        spouseMiddleName: employee.spouse?.middleName || '',
        spouseLastName: employee.spouse?.lastName || '',
        spouseDateOfBirth: employee.spouse?.dateOfBirth ? employee.spouse.dateOfBirth.split('T')[0] : '',
        spousePlaceOfBirth: employee.spouse?.placeOfBirth || '',
        spouseNationality: employee.spouse?.nationality || '',
        spouseDateOfMarriage: employee.spouse?.dateOfMarriage ? employee.spouse.dateOfMarriage.split('T')[0] : '',
        spouseOccupation: employee.spouse?.occupation || '',
        spouseEmployer: employee.spouse?.employer || '',
        spousePhone: employee.spouse?.phone || '',
        spouseNationalId: employee.spouse?.nationalId || ''
      },
      children: employee.children || [],
      hasChildren: employee.children && employee.children.length > 0,
      numberOfChildren: employee.children ? employee.children.length : 0
    })
  }

  resetFormData = () => {
    this.setState({
      formData: {
        empId: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        employerId: '',
        position: '',
        hireDate: '',
        middleName: '',
        preferredName: '',
        personalEmail: '',
        phone: '',
        alternatePhone: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        maritalStatus: '',
        bloodGroup: '',
        nationality: '',
        religion: '',
        languages: '',
        currentAddress: '',
        permanentAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        nationalId: '',
        passportNumber: '',
        passportExpiry: '',
        drivingLicense: '',
        licenseExpiry: '',
        visaStatus: '',
        visaExpiry: '',
        qidNumber: '',
        qidIssueDate: '',
        qidExpiryDate: '',
        qidLocation: '',
        emergencyContact1Name: '',
        emergencyContact1Relation: '',
        emergencyContact1Phone: '',
        emergencyContact1Address: '',
        emergencyContact2Name: '',
        emergencyContact2Relation: '',
        emergencyContact2Phone: '',
        emergencyContact2Address: '',
        highestEducation: '',
        university: '',
        graduationYear: '',
        fieldOfStudy: '',
        certifications: '',
        skills: '',
        salary: '',
        currency: 'USD',
        bankAccount: '',
        bankName: '',
        bankBranch: '',
        taxId: '',
        socialSecurityNumber: '',
        confirmationDate: '',
        status: 'ACTIVE',
        employeeType: 'FULL_TIME',
        workLocation: 'OFFICE',
        medicalConditions: '',
        allergies: '',
        medications: '',
        fatherFirstName: '',
        fatherMiddleName: '',
        fatherLastName: '',
        fatherDateOfBirth: '',
        fatherPlaceOfBirth: '',
        fatherNationality: '',
        fatherOccupation: '',
        fatherPhone: '',
        fatherNationalId: '',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',
        motherDateOfBirth: '',
        motherPlaceOfBirth: '',
        motherNationality: '',
        motherOccupation: '',
        motherPhone: '',
        motherNationalId: '',
        spouseFirstName: '',
        spouseMiddleName: '',
        spouseLastName: '',
        spouseDateOfBirth: '',
        spousePlaceOfBirth: '',
        spouseNationality: '',
        spouseDateOfMarriage: '',
        spouseOccupation: '',
        spouseEmployer: '',
        spousePhone: '',
        spouseNationalId: '',
        photoUrl: '',
        qidDocumentUrl: '',
        passportDocumentUrl: ''
      },
      hasChildren: false,
      numberOfChildren: 0,
      children: []
    })
  }

  // Travel History Management
  addTravelHistory = () => {
    this.setState({
      travelHistory: [
        ...this.state.travelHistory,
        {
          country: '',
          dateOfEntry: '',
          dateOfExit: '',
          purposeOfTravel: '',
          accompanyingPerson: ''
        }
      ]
    })
  }

  removeTravelHistory = (index: number) => {
    const newTravelHistory = this.state.travelHistory.filter((_, i) => i !== index)
    this.setState({ travelHistory: newTravelHistory })
  }

  updateTravelHistory = (index: number, field: keyof TravelHistoryEntry, value: string) => {
    const newTravelHistory = [...this.state.travelHistory]
    newTravelHistory[index] = {
      ...newTravelHistory[index],
      [field]: value
    }
    this.setState({ travelHistory: newTravelHistory })
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (this.props.onSave) {
      const submitData = {
        ...this.state.formData,
        children: this.state.children
      }
      this.props.onSave(submitData)
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value
      }
    })
  }

  // Handler for father data changes from FamilyMemberSelector
  handleFatherDataChange = (data: any, stakeholderId?: number) => {
    this.setState({
      formData: {
        ...this.state.formData,
        fatherFirstName: data.firstName,
        fatherMiddleName: data.middleName,
        fatherLastName: data.lastName,
        fatherDateOfBirth: data.dateOfBirth,
        fatherPlaceOfBirth: data.placeOfBirth,
        fatherNationality: data.nationality,
        fatherOccupation: data.occupation,
        fatherPhone: data.phone,
        fatherNationalId: data.nationalId
      },
      fatherStakeholderId: stakeholderId
    })
  }

  // Handler for mother data changes from FamilyMemberSelector
  handleMotherDataChange = (data: any, stakeholderId?: number) => {
    this.setState({
      formData: {
        ...this.state.formData,
        motherFirstName: data.firstName,
        motherMiddleName: data.middleName,
        motherLastName: data.lastName,
        motherDateOfBirth: data.dateOfBirth,
        motherPlaceOfBirth: data.placeOfBirth,
        motherNationality: data.nationality,
        motherOccupation: data.occupation,
        motherPhone: data.phone,
        motherNationalId: data.nationalId
      },
      motherStakeholderId: stakeholderId
    })
  }

  // Handler for spouse data changes from FamilyMemberSelector
  handleSpouseDataChange = (data: any, stakeholderId?: number) => {
    this.setState({
      formData: {
        ...this.state.formData,
        spouseFirstName: data.firstName,
        spouseMiddleName: data.middleName,
        spouseLastName: data.lastName,
        spouseDateOfBirth: data.dateOfBirth,
        spousePlaceOfBirth: data.placeOfBirth,
        spouseNationality: data.nationality,
        spouseOccupation: data.occupation,
        spousePhone: data.phone,
        spouseNationalId: data.nationalId
      },
      spouseStakeholderId: stakeholderId
    })
  }

  handleChildrenChange = (hasChildren: boolean) => {
    this.setState({
      hasChildren,
      numberOfChildren: hasChildren ? this.state.numberOfChildren || 1 : 0,
      children: hasChildren ? this.state.children : []
    })
  }

  handleNumberOfChildrenChange = (num: number) => {
    const newChildren = []
    for (let i = 0; i < num; i++) {
      if (this.state.children[i]) {
        newChildren.push(this.state.children[i])
      } else {
        newChildren.push({
          id: `child-${i + 1}`,
          firstName: '',
          middleName: '',
          lastName: '',
          dateOfBirth: '',
          placeOfBirth: '',
          gender: '',
          nationality: '',
          bloodGroup: '',
          isDependent: true
        })
      }
    }
    this.setState({
      numberOfChildren: num,
      children: newChildren
    })
  }

  handleChildChange = (index: number, field: string, value: string | boolean) => {
    const updatedChildren = [...this.state.children]
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value
    }
    this.setState({ children: updatedChildren })
  }

  getModalSize = () => {
    const { size = 'full' } = this.props
    switch (size) {
      case 'small': return 'max-w-2xl'
      case 'medium': return 'max-w-4xl'
      case 'large': return 'max-w-6xl'
      case 'full': return 'max-w-7xl'
      default: return 'max-w-6xl'
    }
  }

  render() {
    if (!this.props.isOpen) return null

    const { mode, loading, title, onClose } = this.props
    const { formData, hasChildren, numberOfChildren, children } = this.state

    const departments = [
      'Human Resources', 'Information Technology', 'Finance', 'Marketing',
      'Operations', 'Sales', 'Customer Service', 'Research & Development'
    ]

    const positions = [
      'Software Engineer', 'Senior Software Engineer', 'Project Manager',
      'HR Specialist', 'Financial Analyst', 'Marketing Coordinator',
      'Sales Representative', 'Customer Support Agent', 'DevOps Engineer', 'UX/UI Designer'
    ]

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`bg-white rounded-xl shadow-2xl w-full ${this.getModalSize()} max-h-[95vh] overflow-hidden animate-fade-in`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              {title || (
                <>
                  {mode === 'view' && '👁️ Employee Profile'}
                  {mode === 'edit' && '✏️ Edit Employee'}
                  {mode === 'create' && '➕ Add New Employee'}
                </>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-160px)]">
            <form onSubmit={this.handleSubmit} className="space-y-8">
              {/* MANDATORY: Basic Employee Information */}
              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span> Required Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                    <input type="text" name="empId" value={formData.empId} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="EMP001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select name="department" value={formData.department} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <select name="position" value={formData.position} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Select Position</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                      <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center">
                        🏢 Select Employee's Employer *
                      </label>
                      <select
                        name="employerId"
                        value={formData.employerId}
                        onChange={this.handleChange}
                        disabled={mode === 'view'}
                        required
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium disabled:bg-gray-50"
                      >
                        <option value="">🏢 Choose Employer (Company or Individual)</option>
                        {this.state.loadingEmployers ? (
                          <option value="" disabled>⏳ Loading employers...</option>
                        ) : (
                          this.state.employers.map(employer => (
                            <option key={employer.id} value={employer.id}>
                              {employer.employerType === 'COMPANY' ? '🏢' : '👤'} {employer.displayName} - {employer.description}
                            </option>
                          ))
                        )}
                      </select>
                      {this.state.employers.length === 0 && !this.state.loadingEmployers && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700 font-medium">
                            ⚠️ No employers found! Please add employers first:
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Go to Dashboard → Employers → Add New Employer
                          </p>
                          <button
                            type="button"
                            onClick={this.fetchEmployers}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                          >
                            🔄 Refresh Employer List
                          </button>
                        </div>
                      )}
                      {this.state.employers.length > 0 && (
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-blue-600">
                            ℹ️ Found {this.state.employers.length} employer(s) available for selection
                          </p>
                          <button
                            type="button"
                            onClick={this.fetchEmployers}
                            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            🔄 Refresh
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                    <input type="date" name="hireDate" value={formData.hireDate} onChange={this.handleChange} disabled={mode === 'view'} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                </div>
              </div>

              {/* OPTIONAL: Personal Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👤</span> Personal Information <span className="ml-2 text-sm text-green-600">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input type="text" name="middleName" value={formData.middleName} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Name</label>
                    <input type="text" name="preferredName" value={formData.preferredName} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                    <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="City, Country" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Select Status</option>
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                      <option value="DIVORCED">Divorced</option>
                      <option value="WIDOWED">Widowed</option>
                      <option value="SEPARATED">Separated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                    <input type="text" name="religion" value={formData.religion} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                    <input type="text" name="languages" value={formData.languages} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="English, Spanish, French" />
                  </div>
                </div>
              </div>

              {/* Children Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👶</span> Children Information <span className="ml-2 text-sm text-green-600">(Optional)</span>
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Do you have children?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasChildren"
                        checked={hasChildren}
                        onChange={() => this.handleChildrenChange(true)}
                        disabled={mode === 'view'}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasChildren"
                        checked={!hasChildren}
                        onChange={() => this.handleChildrenChange(false)}
                        disabled={mode === 'view'}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>

                {hasChildren && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Children</label>
                      <select
                        value={numberOfChildren}
                        onChange={(e) => this.handleNumberOfChildrenChange(parseInt(e.target.value))}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 max-w-xs"
                      >
                        <option value={0}>Select Number</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    {children.map((child, index) => (
                      <div key={child.id} className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-md font-medium text-blue-800 mb-4">Child {index + 1} Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input
                              type="text"
                              value={child.firstName}
                              onChange={(e) => this.handleChildChange(index, 'firstName', e.target.value)}
                              disabled={mode === 'view'}
                              required={hasChildren}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                            <input
                              type="text"
                              value={child.middleName}
                              onChange={(e) => this.handleChildChange(index, 'middleName', e.target.value)}
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                              type="text"
                              value={child.lastName}
                              onChange={(e) => this.handleChildChange(index, 'lastName', e.target.value)}
                              disabled={mode === 'view'}
                              required={hasChildren}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                              type="date"
                              value={child.dateOfBirth}
                              onChange={(e) => this.handleChildChange(index, 'dateOfBirth', e.target.value)}
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                            <input
                              type="text"
                              value={child.placeOfBirth}
                              onChange={(e) => this.handleChildChange(index, 'placeOfBirth', e.target.value)}
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                              placeholder="City, Country"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                              value={child.gender}
                              onChange={(e) => this.handleChildChange(index, 'gender', e.target.value)}
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                            <input
                              type="text"
                              value={child.nationality}
                              onChange={(e) => this.handleChildChange(index, 'nationality', e.target.value)}
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select
                              value={child.bloodGroup}
                              onChange={(e) => this.handleChildChange(index, 'bloodGroup', e.target.value)}
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                            >
                              <option value="">Select Blood Group</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={child.isDependent}
                                onChange={(e) => this.handleChildChange(index, 'isDependent', e.target.checked)}
                                disabled={mode === 'view'}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Is Dependent</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* QID (Qatar ID) Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🆔</span> QID (Qatar ID) Information <span className="ml-2 text-sm text-green-600">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QID Number</label>
                    <input type="text" name="qidNumber" value={formData.qidNumber} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="Enter QID Number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QID Issue Date</label>
                    <input type="date" name="qidIssueDate" value={formData.qidIssueDate} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QID Expiry Date</label>
                    <input type="date" name="qidExpiryDate" value={formData.qidExpiryDate} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QID Issue Location</label>
                    <input type="text" name="qidLocation" value={formData.qidLocation} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="Where was QID issued" />
                  </div>
                </div>
              </div>

              {/* Documents & Photos */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📄</span> Documents & Photos <span className="ml-2 text-sm text-green-600">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Photo URL (Dropbox Link)</label>
                    <input type="url" name="photoUrl" value={formData.photoUrl} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="https://www.dropbox.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QID Document URL (Dropbox Link)</label>
                    <input type="url" name="qidDocumentUrl" value={formData.qidDocumentUrl} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="https://www.dropbox.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Document URL (Dropbox Link)</label>
                    <input type="url" name="passportDocumentUrl" value={formData.passportDocumentUrl} onChange={this.handleChange} disabled={mode === 'view'} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" placeholder="https://www.dropbox.com/..." />
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👨‍👩‍👧‍👦</span> Family Information <span className="ml-2 text-sm text-green-600">(Optional)</span>
                </h3>

                {/* Father Details with Stakeholder Selection */}
                <FamilyMemberSelector
                  title="Father Details"
                  memberType="father"
                  data={{
                    firstName: formData.fatherFirstName,
                    middleName: formData.fatherMiddleName,
                    lastName: formData.fatherLastName,
                    dateOfBirth: formData.fatherDateOfBirth,
                    placeOfBirth: formData.fatherPlaceOfBirth,
                    nationality: formData.fatherNationality,
                    occupation: formData.fatherOccupation,
                    phone: formData.fatherPhone,
                    nationalId: formData.fatherNationalId
                  }}
                  disabled={mode === 'view'}
                  onDataChange={this.handleFatherDataChange}
                />

                {/* Mother Details with Stakeholder Selection */}
                <FamilyMemberSelector
                  title="Mother Details"
                  memberType="mother"
                  data={{
                    firstName: formData.motherFirstName,
                    middleName: formData.motherMiddleName,
                    lastName: formData.motherLastName,
                    dateOfBirth: formData.motherDateOfBirth,
                    placeOfBirth: formData.motherPlaceOfBirth,
                    nationality: formData.motherNationality,
                    occupation: formData.motherOccupation,
                    phone: formData.motherPhone,
                    nationalId: formData.motherNationalId
                  }}
                  disabled={mode === 'view'}
                  onDataChange={this.handleMotherDataChange}
                />

                {/* Spouse Details with Stakeholder Selection */}
                <FamilyMemberSelector
                  title="Spouse Details"
                  memberType="spouse"
                  data={{
                    firstName: formData.spouseFirstName,
                    middleName: formData.spouseMiddleName,
                    lastName: formData.spouseLastName,
                    dateOfBirth: formData.spouseDateOfBirth,
                    placeOfBirth: formData.spousePlaceOfBirth,
                    nationality: formData.spouseNationality,
                    occupation: formData.spouseOccupation,
                    phone: formData.spousePhone,
                    nationalId: formData.spouseNationalId
                  }}
                  disabled={mode === 'view'}
                  onDataChange={this.handleSpouseDataChange}
                  additionalFields={
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Marriage</label>
                      <input
                        type="date"
                        value={formData.spouseDateOfMarriage}
                        onChange={(e) => this.setState({
                          formData: { ...formData, spouseDateOfMarriage: e.target.value }
                        })}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  }
                />
              </div>

              {/* Travel History */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">✈️</span> Travel History <span className="ml-2 text-sm text-green-600">(Optional)</span>
                </h3>

                {this.state.travelHistory.length > 0 && this.state.travelHistory.map((travel, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Travel Entry #{index + 1}</h4>
                      {mode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => this.removeTravelHistory(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={travel.country}
                          onChange={(e) => this.updateTravelHistory(index, 'country', e.target.value)}
                          disabled={mode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          placeholder="Destination Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Entry</label>
                        <input
                          type="date"
                          value={travel.dateOfEntry}
                          onChange={(e) => this.updateTravelHistory(index, 'dateOfEntry', e.target.value)}
                          disabled={mode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Exit</label>
                        <input
                          type="date"
                          value={travel.dateOfExit}
                          onChange={(e) => this.updateTravelHistory(index, 'dateOfExit', e.target.value)}
                          disabled={mode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Travel</label>
                        <input
                          type="text"
                          value={travel.purposeOfTravel}
                          onChange={(e) => this.updateTravelHistory(index, 'purposeOfTravel', e.target.value)}
                          disabled={mode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          placeholder="Business, Tourism, Family, etc."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Accompanying Person</label>
                        <input
                          type="text"
                          value={travel.accompanyingPerson}
                          onChange={(e) => this.updateTravelHistory(index, 'accompanyingPerson', e.target.value)}
                          disabled={mode === 'view'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          placeholder="Name of person traveling with"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={this.addTravelHistory}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    + Add Travel History Entry
                  </button>
                )}

                {this.state.travelHistory.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No travel history added yet. Click the button above to add entries.</p>
                )}
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                onClick={this.handleSubmit}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : mode === 'edit' ? 'Update Employee' : 'Create Employee'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}