import React from 'react';
import { ApprovalMatrix } from '@/services/modules/approval-matrix';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ApproversTableProps {
  matrix: ApprovalMatrix;
}

export const ApproversTable: React.FC<ApproversTableProps> = ({ matrix }) => {
  const allApprovers = matrix?.levels?.flatMap((level) =>
    (level?.approvers || []).map((approver) => ({ ...approver, levelOrder: level.order, levelName: level.name }))
  ) || [];

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">All Approvers ({allApprovers.length})</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allApprovers.length > 0 ? (
              allApprovers.map((approver, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      Level {approver?.levelOrder}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{approver?.memberName || 'Unknown'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{approver?.memberEmail || 'N/A'}</TableCell>
                  <TableCell>{approver?.memberRole || 'N/A'}</TableCell>
                  <TableCell>{approver?.memberDepartment || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={approver?.isMandatory ? 'default' : 'secondary'}
                      className={approver?.isMandatory ? 'bg-red-50 text-red-700 border-red-200' : ''}>
                      {approver?.isMandatory ? 'Mandatory' : 'Optional'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No approvers assigned</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
