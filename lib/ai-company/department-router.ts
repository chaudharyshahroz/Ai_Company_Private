/**
 * Department router — assigns a CEO-plan task to a specific employee in the
 * right department, with permission + budget + scheduled work settings baked in.
 */

import { EMPLOYEES, getEmployee } from "@/lib/employees";
import type { ActionRisk, Department } from "./types";

export interface RoutedTask {
  employeeSlug: string;
  employeeName: string;
  department: Department;
  permissionLevel: 1 | 2 | 3 | 4;
  estimatedCredits: number;
  requiresApproval: boolean;
  actionRisk: ActionRisk;
}

export function routeTaskToEmployee(opts: {
  suggestedEmployeeSlug: string;
  department: string;
  estimatedCredits: number;
  requiresApproval: boolean;
}): RoutedTask {
  const direct = getEmployee(opts.suggestedEmployeeSlug);
  const employee = direct ?? EMPLOYEES.find((e) => e.department === opts.department) ?? null;

  if (!employee) {
    return {
      employeeSlug: "ceo",
      employeeName: "Atlas — AI CEO",
      department: "executive",
      permissionLevel: 4,
      estimatedCredits: opts.estimatedCredits,
      requiresApproval: opts.requiresApproval,
      actionRisk: "draft",
    };
  }

  return {
    employeeSlug: employee.slug,
    employeeName: employee.name,
    department: employee.department,
    permissionLevel: employee.permissionLevel,
    estimatedCredits: opts.estimatedCredits,
    requiresApproval: opts.requiresApproval,
    actionRisk: opts.requiresApproval ? "external" : "draft",
  };
}