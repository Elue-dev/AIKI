import { Button } from '#/components/ui/button'
import FormInput from '#/components/ui/form/form-input'
import Avatar from '@/assets/img/avatar.png'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [editingEmployment, setEditingEmployment] = useState(false)

  const personalForm = useForm({
    defaultValues: {
      fullName: 'Sani Francis',
      nin: '9547831251',
      dob: '1990-08-14',
      address: '15, Sterling Street, Lagos',
      phone: '+234 812 345 6789',
      email: 'olivia@trevo.com',
      alternateContact: '+234 812 345 6789',
    },
    onSubmit: async ({ value }) => {
      console.log('personal', value)
      setEditingPersonal(false)
    },
  })

  const employmentForm = useForm({
    defaultValues: {
      employerName: 'Trevo Alliance',
      employerAddress: '246B, Cole Street, Victoria Island, Lagos',
      employmentType: '',
      monthsInRole: '',
      grossSalary: '',
      netSalary: '',
      salaryChannel: '',
      hrContact: '',
    },
    onSubmit: async ({ value }) => {
      console.log('employment', value)
      setEditingEmployment(false)
    },
  })

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <main className="wrapper-sm py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[32px] font-semibold text-dark mb-4">Profile</h1>
          <Button
            onClick={() => {
              personalForm.handleSubmit()
              employmentForm.handleSubmit()
            }}
          >
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={Avatar} className="h-15 w-15 rounded-full" />
              </div>
              <p className="text-base font-semibold text-gray-900">
                Olivia Rhye
              </p>
              <p className="text-xs text-gray-400 mt-0.5">olivia@trevo.com</p>
              <div className="flex items-center justify-center gap-2 mt-5">
                <Button variant="ghost" size="sm" className="px-4 rounded-full">
                  Upload Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  Remove photo
                </Button>
              </div>
            </div>
          </div>

          <div className="col-span-3 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-dark">
                  Personal Details
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setEditingPersonal((v) => !v)}
                >
                  {editingPersonal ? 'Done' : 'Edit'}
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <FormInput
                  form={personalForm}
                  name="fullName"
                  label="Full legal name"
                  placeholder="Olivia Rhye"
                  validator={{}}
                  disabled={!editingPersonal}
                />
                <FormInput
                  form={personalForm}
                  name="nin"
                  label="NIN (National ID Number)"
                  placeholder="9547831251"
                  validator={{}}
                  disabled={!editingPersonal}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={personalForm}
                    name="dob"
                    label="Date of birth"
                    placeholder="14/08/1990"
                    type="date"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                  <FormInput
                    form={personalForm}
                    name="address"
                    label="Residential address"
                    placeholder="15, Sterling Street, Lagos"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={personalForm}
                    name="phone"
                    label="Phone number"
                    placeholder="+234 812 345 6789"
                    type="tel"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                  <FormInput
                    form={personalForm}
                    name="email"
                    label="Email address"
                    placeholder="olivia@trevo.com"
                    type="email"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                </div>
                <FormInput
                  form={personalForm}
                  name="alternateContact"
                  label="Alternate contact (optional)"
                  placeholder="+234 812 345 6789"
                  type="tel"
                  validator={{}}
                  disabled={!editingPersonal}
                />
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-dark">
                  Employment Details
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setEditingEmployment((v) => !v)}
                >
                  {editingEmployment ? 'Done' : 'Edit'}
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <FormInput
                  form={employmentForm}
                  name="employerName"
                  label="Employer name"
                  placeholder="Trevo Alliance"
                  validator={{}}
                  disabled={!editingEmployment}
                />
                <FormInput
                  form={employmentForm}
                  name="employerAddress"
                  label="Employer address"
                  placeholder="246B, Cole Street, Victoria Island, Lagos"
                  validator={{}}
                  disabled={!editingEmployment}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={employmentForm}
                    name="monthsInRole"
                    label="Months in current role"
                    placeholder="12 months"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                  <FormInput
                    form={employmentForm}
                    name="grossSalary"
                    label="Gross monthly salary"
                    placeholder="500,000.00"
                    type="number"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={employmentForm}
                    name="netSalary"
                    label="Net monthly salary"
                    placeholder="₦50,000.00"
                    type="number"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                  <FormInput
                    form={employmentForm}
                    name="hrContact"
                    label="HR / line manager contact"
                    placeholder="+234 812 346 6789"
                    type="tel"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
