'use client';

import { useState } from 'react';
import axios from 'axios';
import './report.css'

const ReportGeneration = () => {
  const [isLoading, setIsLoading] = useState<{ progress: boolean; analytics: boolean; instructorRatings: boolean; courseCompletion: boolean }>({
    progress: false,
    analytics: false,
    instructorRatings: false,
    courseCompletion: false,  // New loading state for the course completion report
  });

  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string[][] | null>(null); // Parsed CSV data
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = csvData ? csvData.slice(indexOfFirstRow + 1, indexOfLastRow + 1) : [];
  const totalPages = csvData ? Math.ceil((csvData.length - 1) / rowsPerPage) : 1;


  // Helper function to convert JSON response to CSV format
  const convertToCSVFormat = (data: any[]): string[][] => {
    if (!Array.isArray(data) || !data.length) return [];
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((header) => row[header] ?? ""));
    return [headers, ...rows];
  };

  // Handle CSV Download and Display
  const handleCsvDownload = async (url: string, fileName: string, reportType: string) => {
    setIsLoading((prev) => ({ ...prev, [reportType]: true }));
    setError(null);

    try {
      const response = await axios.get(url, {
        withCredentials: true, // Ensure cookies are sent if needed
        headers: { Accept: 'application/json' }, // Expect JSON format from the backend
        responseType: 'json', // Handle JSON response
      });

      // Check if the response is a CSV file or JSON data
      if (response.headers['content-type']?.includes('text/csv')) {
        const csvString = response.data;
        const csvRows = csvString.split('\n').map((row: any) => row.split(','));
        setCsvData(csvRows);

        // Create a Blob for CSV download
        const fileURL = window.URL.createObjectURL(new Blob([csvString]));
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        link.click();
      } else {
        // Assuming the response is JSON
        const reportData = response.data; // The JSON data from the backend

        const csvFormattedData = convertToCSVFormat(reportData); // Convert JSON to CSV-like rows
        setCsvData(csvFormattedData);

        // Convert CSV data back to string for download
        const csvString = csvFormattedData.map((row) => row.join(',')).join('\n');
        const fileURL = window.URL.createObjectURL(new Blob([csvString]));
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        link.click();
      }
    } catch (err: any) {
      console.error(`Error generating ${reportType} report:`, err);
      if (err.response) {
        setError(`Failed to generate ${reportType} report. ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError(`Failed to generate the ${reportType} report. Please try again.`);
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, [reportType]: false }));
    }
  };

  return (
    <div className="report-container">
    <h2 className="report-title">Report Generation</h2>

    <div className="report-buttons">
      <button
        onClick={() =>
          handleCsvDownload(
            'http://localhost:5000/progress/quiz-results/',
            'progress_report.csv',
            'progress'
          )
        }
        disabled={isLoading.progress}
        className={`report-button ${isLoading.progress ? 'disabled' : 'blue'}`}
      >
        {isLoading.progress ? 'Generating Progress Report...' : 'Generate Progress Report'}
      </button>

      <button
        onClick={() =>
          handleCsvDownload(
            'http://localhost:5000/courses/report/',
            'course_analytics_report.csv',
            'analytics'
          )
        }
        disabled={isLoading.analytics}
        className={`report-button ${isLoading.analytics ? 'disabled' : 'green'}`}
      >
        {isLoading.analytics ? 'Generating Course Analytics Report...' : 'Generate Course Analytics Report'}
      </button>

      <button
        onClick={() =>
          handleCsvDownload(
            'http://localhost:5000/instructors/report',
            'instructor_ratings_report.csv',
            'instructorRatings'
          )
        }
        disabled={isLoading.instructorRatings}
        className={`report-button ${isLoading.instructorRatings ? 'disabled' : 'purple'}`}
      >
        {isLoading.instructorRatings ? 'Generating Instructor Ratings Report...' : 'Generate Instructor Ratings Report'}
      </button>

      <button
        onClick={() =>
          handleCsvDownload(
            'http://localhost:5000/progress/course-completion',
            'course_completion_report.csv',
            'courseCompletion'
          )
        }
        disabled={isLoading.courseCompletion}
        className={`report-button ${isLoading.courseCompletion ? 'disabled' : 'teal'}`}
      >
        {isLoading.courseCompletion ? 'Generating Course Completion Report...' : 'Generate Course Completion Report'}
      </button>
    </div>

    {error && <p className="error-message">{error}</p>}

    {csvData && (
      <div className="report-data">
        <h3 className="data-title">Report Data:</h3>
        <table className="data-table">
          <thead>
            <tr>
              {csvData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="report-button blue"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="report-button blue"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default ReportGeneration;