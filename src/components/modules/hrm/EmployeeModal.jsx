import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import useHrmStore from '../../../store/hrm/useHrmStore';
import useAuthStore from '../../../store/auth.store';
import authService from '../../../services/auth.service';
import * as hrmService from '../../../services/hrm/hrmService';

const EMPLOYEE_ROLES = [
  'ERP System Administrator',
  'IT Manager',
  'Project Manager',
  'Business Analyst',
  'Developer',
  'Quality Assurance Specialist',
  'HR Manager',
  'Finance Manager',
  'Sales Manager',
  'Employee'
];

const validationSchema = Yup.object({
  employeeId: Yup.string().required('Employee ID is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().when('isNewEmployee', {
    is: true,
    then: () => Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    otherwise: () => Yup.string()
  }),
  phone: Yup.string().required('Phone number is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  role: Yup.string().required('Role is required'),
  joiningDate: Yup.date().required('Joining date is required'),
  status: Yup.string().required('Status is required'),
  salary: Yup.number()
    // .min(0, 'Salary cannot be negative')
    // .required('Salary is required'),
});

const EmployeeModal = ({ employee, onClose, onSuccess }) => {
  const { departments, positions, fetchDepartments, fetchPositions } = useHrmStore();
  const { user } = useAuthStore();
  const currentUser = authService.getCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching departments and positions...');
        await Promise.all([
          fetchDepartments(),
          fetchPositions()
        ]);
        console.log('Departments after fetch:', departments);
        console.log('Positions after fetch:', positions);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load departments and positions');
      }
    };

    loadData();
  }, [fetchDepartments, fetchPositions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, calling formik.handleSubmit');
    console.log('Current employee data:', employee);
    console.log('Form values:', formik.values);
    
    // Validate form before submission
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit(e);
    } else {
      console.error('Form validation errors:', errors);
      toast.error('Please fill in all required fields correctly');
    }
  };

  const formik = useFormik({
    initialValues: {
      employeeId: employee?.employeeId || '',
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      password: '',
      isNewEmployee: !employee,
      phone: employee?.phone || '',
      department: employee?.department?._id || employee?.department || '',
      position: employee?.position?._id || employee?.position || '',
      role: employee?.role || 'Employee',
      joiningDate: employee?.joiningDate
        ? new Date(employee.joiningDate).toISOString().split('T')[0]
        : '',
      status: employee?.status || 'active',
      salary: employee?.salary || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Form submitted with values:', values);
        setIsLoading(true);
        const userId = user?._id || currentUser?._id;
        
        if (!userId) {
          toast.error('Authentication required. Please log in again.');
          return;
        }

        // Ensure position is sent as string ID
        const positionId = typeof values.position === 'object' ? values.position.id : values.position;

        const formData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          department: values.department,
          position: positionId,
          role: values.role,
          joiningDate: values.joiningDate,
          status: values.status || 'active',
          salary: Number(values.salary)
        };

        if (!employee?.id && !employee?._id) {
          formData.employeeId = values.employeeId;
          formData.password = values.password;
          formData.createdBy = userId;
        }

        let response;
        if (employee?.id || employee?._id) {
          const employeeId = employee.id || employee._id;
          response = await hrmService.updateEmployee(employeeId, formData);
        } else {
          response = await hrmService.createEmployee(formData);
        }

        if (response) {
          toast.success(`Employee ${employee ? 'updated' : 'created'} successfully`);
          if (typeof onSuccess === 'function') {
            onSuccess(response);
          }
          onClose();
        }
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error(error.response?.data?.message || error.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      {employee ? 'Edit Employee' : 'Add Employee'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="employeeId" className="label">
                            Employee ID
                          </label>
                          <input
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            className="input"
                            {...formik.getFieldProps('employeeId')}
                          />
                          {formik.touched.employeeId && formik.errors.employeeId && (
                            <div className="error-message">{formik.errors.employeeId}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="firstName" className="label">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="input"
                            {...formik.getFieldProps('firstName')}
                          />
                          {formik.touched.firstName && formik.errors.firstName && (
                            <div className="error-message">{formik.errors.firstName}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="lastName" className="label">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="input"
                            {...formik.getFieldProps('lastName')}
                          />
                          {formik.touched.lastName && formik.errors.lastName && (
                            <div className="error-message">{formik.errors.lastName}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="label">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="input"
                            {...formik.getFieldProps('email')}
                          />
                          {formik.touched.email && formik.errors.email && (
                            <div className="error-message">{formik.errors.email}</div>
                          )}
                        </div>

                        {!employee && (
                          <div>
                            <label htmlFor="password" className="label">
                              Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              name="password"
                              className="input"
                              {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && (
                              <div className="error-message">{formik.errors.password}</div>
                            )}
                          </div>
                        )}

                        <div>
                          <label htmlFor="phone" className="label">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="input"
                            {...formik.getFieldProps('phone')}
                          />
                          {formik.touched.phone && formik.errors.phone && (
                            <div className="error-message">{formik.errors.phone}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="role" className="label">
                            Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            className="input"
                            {...formik.getFieldProps('role')}
                          >
                            {EMPLOYEE_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          {formik.touched.role && formik.errors.role && (
                            <div className="error-message">{formik.errors.role}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="department" className="label">
                            Department
                          </label>
                          <select
                            id="department"
                            name="department"
                            className="input"
                            {...formik.getFieldProps('department')}
                          >
                            <option value="">Select Department</option>
                            {departments && departments.map((dept) => (
                              <option key={dept._id || dept.id} value={dept._id || dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          {formik.touched.department && formik.errors.department && (
                            <div className="error-message">{formik.errors.department}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="position" className="label">
                            Position
                          </label>
                          <select
                            id="position"
                            name="position"
                            className="input"
                            {...formik.getFieldProps('position')}
                          >
                            <option value="">Select Position</option>
                            {positions && positions.map((position) => (
                              <option key={position._id || position.id} value={position._id || position.id}>
                                {position.title}
                              </option>
                            ))}
                          </select>
                          {formik.touched.position && formik.errors.position && (
                            <div className="error-message">{formik.errors.position}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="joiningDate" className="label">
                            Joining Date
                          </label>
                          <input
                            type="date"
                            id="joiningDate"
                            name="joiningDate"
                            className="input"
                            {...formik.getFieldProps('joiningDate')}
                          />
                          {formik.touched.joiningDate && formik.errors.joiningDate && (
                            <div className="error-message">{formik.errors.joiningDate}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="status" className="label">
                            Status
                          </label>
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={formik.values.status === 'active'}
                              onChange={(checked) => {
                                formik.setFieldValue('status', checked ? 'active' : 'inactive');
                              }}
                              className={`${
                                formik.values.status === 'active' ? 'bg-black' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`}
                            >
                              <span className="sr-only">Enable status</span>
                              <span
                                className={`${
                                  formik.values.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                              />
                            </Switch>
                            <span className="text-sm text-gray-600">
                              {formik.values.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {formik.touched.status && formik.errors.status && (
                            <div className="error-message">{formik.errors.status}</div>
                          )}
                        </div>

                        <div>
                          <label htmlFor="salary" className="label">
                            Salary
                          </label>
                          <input
                            type="number"
                            id="salary"
                            name="salary"
                            className="input"
                            {...formik.getFieldProps('salary')}
                          />
                          {formik.touched.salary && formik.errors.salary && (
                            <div className="error-message">{formik.errors.salary}</div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:ml-3 sm:w-auto ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isLoading ? 'Processing...' : employee ? 'Update' : 'Create'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmployeeModal; 