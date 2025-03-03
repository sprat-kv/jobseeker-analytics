'use client';

import React from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';

export default function Dashboard() {
  // Mock data for the table
  const data = [
    {
      company_name: 'Company A',
      application_status: 'Pending',
      received_at: '2025-03-01',
      subject: 'Software Engineer',
    },
    {
      company_name: 'Company B',
      application_status: 'Accepted',
      received_at: '2025-03-02',
      subject: 'Product Manager',
    },
    {
      company_name: 'Company C',
      application_status: 'Rejected',
      received_at: '2025-03-03',
      subject: 'Data Analyst',
    },
  ];

  // Columns for the table
  const columns = [
    { key: 'company_name', label: 'Company Name' },
    { key: 'application_status', label: 'Application Status' },
    { key: 'received_at', label: 'Received At' },
    { key: 'subject', label: 'Subject' },
  ];

  // Function to get data for each cell
  const getKeyValue = (item: any, columnKey: string) => {
    return item[columnKey] || '--'; // Safely handle missing data
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table aria-label="Example table with mock data">
          <TableHeader>
            {/* Render table columns */}
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  {/* Render a TableCell for each column */}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {getKeyValue(item, column.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Empty row that spans all 4 columns */}
                <TableCell colSpan={4} className="p-4 text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
