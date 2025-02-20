import { create } from 'zustand';
import * as hrmService from '../../services/hrm/hrmService';
import ApiService from '../../services/api.service';

const useHrmStore = create((set, get) => ({
  // Employees
  employees: [],
  managerEmployees: [],
  selectedEmployee: null,
  employeesLoading: false,
  employeesError: null,

  // Departments
  departments: [],
  selectedDepartment: null,
  departmentsLoading: false,
  departmentsError: null,

  // Positions
  positions: [],
  selectedPosition: null,
  positionsLoading: false,
  positionsError: null,

  // Attendance
  attendance: [],
  attendanceLoading: false,
  attendanceError: null,

  // Leaves
  leaves: [],
  selectedLeave: null,
  leavesLoading: false,
  leavesError: null,

  // Payroll
  payroll: [],
  selectedPayroll: null,
  payrollLoading: false,
  payrollError: null,

  // Employee Actions
  fetchEmployees: async (params) => {
    set({ employeesLoading: true, employeesError: null });
    try {
      const employees = await hrmService.getEmployees(params);
      set({ employees, employeesLoading: false });
      return employees;
    } catch (error) {
      set({
        employees: [],
        employeesError: error.response?.data?.message || 'Failed to fetch employees',
        employeesLoading: false,
      });
      throw error;
    }
  },

  fetchManagerEmployees: async () => {
    set({ employeesLoading: true, employeesError: null });
    try {
      const managers = await hrmService.getManagerEmployees();
      set({ managerEmployees: managers, employeesLoading: false });
    } catch (error) {
      set({
        managerEmployees: [],
        employeesError: error.response?.data?.error?.message || 'Failed to fetch managers',
        employeesLoading: false,
      });
    }
  },

  fetchEmployee: async (id) => {
    set({ employeesLoading: true, employeesError: null });
    try {
      const employee = await hrmService.getEmployee(id);
      set({ selectedEmployee: employee, employeesLoading: false });
    } catch (error) {
      set({
        employeesError: error.response?.data?.error?.message || 'Failed to fetch employee',
        employeesLoading: false,
      });
    }
  },

  createEmployee: async (data) => {
    set({ employeesLoading: true, employeesError: null });
    try {
      const employee = await hrmService.createEmployee(data);
      set(state => ({
        employees: [...state.employees, employee],
        employeesLoading: false
      }));
      return employee;
    } catch (error) {
      set({
        employeesError: error.response?.data?.message || 'Failed to create employee',
        employeesLoading: false,
      });
      throw error;
    }
  },

  updateEmployee: async (id, data) => {
    set({ employeesLoading: true, employeesError: null });
    try {
      const employee = await hrmService.updateEmployee(id, data);
      set(state => ({
        employees: state.employees.map(e => e._id === id ? employee : e),
        employeesLoading: false
      }));
      return employee;
    } catch (error) {
      set({
        employeesError: error.response?.data?.message || 'Failed to update employee',
        employeesLoading: false,
      });
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    set({ employeesLoading: true, employeesError: null });
    try {
      await hrmService.deleteEmployee(id);
      set(state => ({
        employees: state.employees.filter(e => e._id !== id),
        employeesLoading: false
      }));
    } catch (error) {
      set({
        employeesError: error.response?.data?.message || 'Failed to delete employee',
        employeesLoading: false,
      });
      throw error;
    }
  },

  // Department Actions
  fetchDepartments: async () => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      const departments = await hrmService.getDepartments();
      set({ departments, departmentsLoading: false });
    } catch (error) {
      set({
        departments: [],
        departmentsError: error.response?.data?.error?.message || 'Failed to fetch departments',
        departmentsLoading: false,
      });
    }
  },

  fetchDepartment: async (id) => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      const department = await hrmService.getDepartment(id);
      set({ selectedDepartment: department, departmentsLoading: false });
    } catch (error) {
      set({
        departmentsError: error.response?.data?.error?.message || 'Failed to fetch department',
        departmentsLoading: false,
      });
    }
  },

  createDepartment: async (data) => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      const department = await hrmService.createDepartment(data);
      set(state => ({
        departments: [...state.departments, department],
        departmentsLoading: false
      }));
      return department;
    } catch (error) {
      set({
        departmentsError: error.response?.data?.message || 'Failed to create department',
        departmentsLoading: false,
      });
      throw error;
    }
  },

  updateDepartment: async (id, data) => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      const department = await hrmService.updateDepartment(id, data);
      set(state => ({
        departments: state.departments.map(d => d._id === id ? department : d),
        departmentsLoading: false
      }));
      return department;
    } catch (error) {
      set({
        departmentsError: error.response?.data?.message || 'Failed to update department',
        departmentsLoading: false,
      });
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      await hrmService.deleteDepartment(id);
      set(state => ({
        departments: state.departments.filter(d => d._id !== id),
        departmentsLoading: false
      }));
    } catch (error) {
      set({
        departmentsError: error.response?.data?.message || 'Failed to delete department',
        departmentsLoading: false,
      });
      throw error;
    }
  },

  // Position Actions
  fetchPositions: async () => {
    set({ positionsLoading: true, positionsError: null });
    try {
      const positions = await hrmService.getPositions();
      set({ positions, positionsLoading: false });
    } catch (error) {
      set({
        positions: [],
        positionsError: error.response?.data?.error?.message || 'Failed to fetch positions',
        positionsLoading: false,
      });
    }
  },

  fetchPosition: async (id) => {
    set({ positionsLoading: true, positionsError: null });
    try {
      const position = await hrmService.getPosition(id);
      set({ selectedPosition: position, positionsLoading: false });
    } catch (error) {
      set({
        positionsError: error.response?.data?.error?.message || 'Failed to fetch position',
        positionsLoading: false,
      });
    }
  },

  createPosition: async (data) => {
    set({ positionsLoading: true, positionsError: null });
    try {
      const position = await hrmService.createPosition(data);
      set(state => ({
        positions: [...state.positions, position],
        positionsLoading: false
      }));
      return position;
    } catch (error) {
      set({
        positionsError: error.response?.data?.message || 'Failed to create position',
        positionsLoading: false,
      });
      throw error;
    }
  },

  updatePosition: async (id, data) => {
    set({ positionsLoading: true, positionsError: null });
    try {
      const position = await hrmService.updatePosition(id, data);
      set(state => ({
        positions: state.positions.map(p => p._id === id ? position : p),
        positionsLoading: false
      }));
      return position;
    } catch (error) {
      set({
        positionsError: error.response?.data?.message || 'Failed to update position',
        positionsLoading: false,
      });
      throw error;
    }
  },

  deletePosition: async (id) => {
    set({ positionsLoading: true, positionsError: null });
    try {
      await hrmService.deletePosition(id);
      set(state => ({
        positions: state.positions.filter(p => p._id !== id),
        positionsLoading: false
      }));
    } catch (error) {
      set({
        positionsError: error.response?.data?.message || 'Failed to delete position',
        positionsLoading: false,
      });
      throw error;
    }
  },

  // Attendance Actions
  fetchAttendance: async (params) => {
    set({ attendanceLoading: true, attendanceError: null });
    try {
      const response = await hrmService.getAttendance(params);
      console.log('Attendance response:', response); // Debug log
      set({ 
        attendance: response.data?.attendance || [], 
        attendanceLoading: false 
      });
    } catch (error) {
      console.error('Error fetching attendance:', error); // Debug log
      set({
        attendance: [],
        attendanceError: error.response?.data?.message || 'Failed to fetch attendance',
        attendanceLoading: false
      });
      throw error;
    }
  },

  updateAttendance: async (id, data) => {
    set({ attendanceLoading: true, attendanceError: null });
    try {
      const response = await hrmService.updateAttendance(id, data);
      const updatedAttendance = response.data?.attendance;
      
      if (!updatedAttendance) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }

      set(state => ({
        attendance: state.attendance.map(a => 
          a._id === id ? updatedAttendance : a
        ),
        attendanceLoading: false
      }));
      return updatedAttendance;
    } catch (error) {
      console.error('Error updating attendance:', error);
      set({
        attendanceError: error.response?.data?.message || error.message || 'Failed to update attendance',
        attendanceLoading: false
      });
      throw error;
    }
  },

  getAttendanceStats: async (params) => {
    try {
      const response = await hrmService.getAttendanceStats(params);
      console.log('Store getAttendanceStats response:', response);
      return { stats: response.stats };
    } catch (error) {
      console.error('Store getAttendanceStats error:', error);
      throw error;
    }
  },

  checkIn: async (data) => {
    try {
      const response = await hrmService.checkIn(data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkOut: async (id) => {
    try {
      const response = await hrmService.checkOut(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createBulkAttendance: async (data) => {
    try {
      const response = await hrmService.createBulkAttendance(data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Leave Actions
  fetchLeaves: async () => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const leaves = await hrmService.getLeaves();
      set({ leaves, leavesLoading: false });
      return leaves;
    } catch (error) {
      set({
        leaves: [],
        leavesError: error.response?.data?.message || 'Failed to fetch leaves',
        leavesLoading: false,
      });
      throw error;
    }
  },

  fetchLeave: async (id) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const leave = await hrmService.getLeave(id);
      set({ selectedLeave: leave, leavesLoading: false });
    } catch (error) {
      set({
        leavesError: error.response?.data?.message || 'Failed to fetch leave',
        leavesLoading: false,
      });
    }
  },

  createLeave: async (data) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const leave = await hrmService.createLeave(data);
      set(state => ({
        leaves: [...state.leaves, leave],
        leavesLoading: false
      }));
      return leave;
    } catch (error) {
      set({
        leavesError: error.response?.data?.message || 'Failed to create leave',
        leavesLoading: false,
      });
      throw error;
    }
  },

  updateLeave: async (id, data) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const leave = await hrmService.updateLeave(id, data);
      set(state => ({
        leaves: state.leaves.map(l => l._id === id ? leave : l),
        leavesLoading: false
      }));
      return leave;
    } catch (error) {
      set({
        leavesError: error.response?.data?.message || 'Failed to update leave',
        leavesLoading: false,
      });
      throw error;
    }
  },

  deleteLeave: async (id) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      await hrmService.deleteLeave(id);
      set(state => ({
        leaves: state.leaves.filter(l => l._id !== id),
        leavesLoading: false
      }));
    } catch (error) {
      set({
        leavesError: error.response?.data?.message || 'Failed to delete leave',
        leavesLoading: false,
      });
      throw error;
    }
  },

  approveLeave: async (id) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const leave = await hrmService.approveLeave(id);
      set(state => ({
        leaves: state.leaves.map(l => l._id === id ? leave : l),
        leavesLoading: false
      }));
      return leave;
    } catch (error) {
      set({
        leavesError: error.response?.data?.message || 'Failed to approve leave',
        leavesLoading: false,
      });
      throw error;
    }
  },

  rejectLeave: async (id) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const leave = await hrmService.rejectLeave(id);
      set(state => ({
        leaves: state.leaves.map(l => l._id === id ? leave : l),
        leavesLoading: false
      }));
      return leave;
    } catch (error) {
      set({
        leavesError: error.response?.data?.message || 'Failed to reject leave',
        leavesLoading: false,
      });
      throw error;
    }
  },

  // Payroll Actions
  fetchPayroll: async (params) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      const payroll = await hrmService.getPayroll(params);
      set({ 
        payroll,
        payrollLoading: false 
      });
      console.log(payroll, 'payrrroll')
    } catch (error) {
      console.error('Error fetching payroll:', error);
      set({
        payroll: [],
        payrollError: error.response?.data?.message || 'Failed to fetch payroll',
        payrollLoading: false,
      });
    }
  },

  fetchPayrollById: async (id) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      const payroll = await hrmService.getPayrollById(id);
      set({ selectedPayroll: payroll, payrollLoading: false });
    } catch (error) {
      set({
        payrollError: error.response?.data?.message || 'Failed to fetch payroll',
        payrollLoading: false,
      });
    }
  },

  createPayroll: async (data) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      const payroll = await hrmService.createPayroll(data);
      set(state => ({
        payroll: [...state.payroll, payroll],
        payrollLoading: false
      }));
      return payroll;
    } catch (error) {
      set({
        payrollError: error.response?.data?.message || 'Failed to create payroll',
        payrollLoading: false,
      });
      throw error;
    }
  },

  updatePayroll: async (id, data) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      const payroll = await hrmService.updatePayroll(id, data);
      set(state => ({
        payroll: state.payroll.map(p => p._id === id ? payroll : p),
        payrollLoading: false
      }));
      return payroll;
    } catch (error) {
      set({
        payrollError: error.response?.data?.message || 'Failed to update payroll',
        payrollLoading: false,
      });
      throw error;
    }
  },

  deletePayroll: async (id) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      await hrmService.deletePayroll(id);
      set(state => ({
        payroll: state.payroll.filter(p => p._id !== id),
        payrollLoading: false
      }));
    } catch (error) {
      set({
        payrollError: error.response?.data?.message || 'Failed to delete payroll',
        payrollLoading: false,
      });
      throw error;
    }
  },

  generatePayroll: async (params) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      const payroll = await hrmService.generatePayroll(params);
      set(state => ({
        payroll: [...state.payroll, payroll],
        payrollLoading: false
      }));
      return payroll;
    } catch (error) {
      set({
        payrollError: error.response?.data?.message || 'Failed to generate payroll',
        payrollLoading: false,
      });
      throw error;
    }
  },

  downloadPayroll: async (id) => {
    set({ payrollLoading: true, payrollError: null });
    try {
      const blob = await hrmService.downloadPayroll(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      set({ payrollLoading: false });
    } catch (error) {
      set({
        payrollError: error.response?.data?.message || 'Failed to download payroll',
        payrollLoading: false,
      });
      throw error;
    }
  },

  // Clear Errors
  clearErrors: () => {
    set({
      employeesError: null,
      departmentsError: null,
      positionsError: null,
      attendanceError: null,
      leavesError: null,
      payrollError: null,
    });
  },
}));

export default useHrmStore; 