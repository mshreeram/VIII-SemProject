import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import LoginAdmin from './LoginAdmin';
import '../../assets/Student.css';

function Students() {
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [token, setToken] = useState(localStorage.getItem('authToken') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'none' });
    const [searchTerm, setSearchTerm] = useState(''); // Track the search term
    const [selectedFile, setSelectedFile] = useState(null); // Track the selected file
    const [uploadStatus, setUploadStatus] = useState(''); // Status message for file upload

    const pageSize = 15;
    const branches = ['cse', 'ece', 'eee', 'mech', 'civil', 'it', 'chem'];

    const handleSort = (field) => {
        setSortConfig((prev) => {
            const nextDirection =
                prev.field === field
                    ? prev.direction === 'asc'
                        ? 'desc'
                        : prev.direction === 'desc'
                        ? 'none'
                        : 'asc'
                    : 'asc';

            return { field: field, direction: nextDirection };
        });
    };

    const getSortedStudents = () => {
        if (sortConfig.direction === 'none') return students;
        const sorted = [...students];
        sorted.sort((a, b) => {
            if (a[sortConfig.field] < b[sortConfig.field]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.field] > b[sortConfig.field]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    const sortedStudents = getSortedStudents();

    const getStudents = async (page = 1, filters = [], search = '') => {
        try {
            const query = new URLSearchParams();
            if (filters.length > 0) {
                query.append('filter', true);
                filters.forEach((branch) => {
                    query.append('branch', branch);
                });
            } else {
                query.append('page', page);
                query.append('limit', pageSize);
            }

            if (search) {
                query.append('search', search); // Add search term to the query
            }

            console.log(query.toString());
            const response = await fetch(`http://localhost:3000/getStudents?${query.toString()}`, {
                method: 'GET',
                headers: { Authorization: `BEARER ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setStudents(data.students);
            if (filters.length === 0) {
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } else {
                setTotalPages(1); // Disable pagination for filtered results
            }
        } catch (error) {
            alert('Failed to fetch students: ' + error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        window.location.reload();
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (file && ['csv', 'xls', 'xlsx'].includes(file.name.split('.').pop().toLowerCase())) {
            setSelectedFile(file);
            setUploadStatus(`Selected file: ${file.name}`);
        } else {
            setSelectedFile(null);
            setUploadStatus('Invalid file type. Please select a CSV, XLS, or XLSX file.');
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFileSelection({ target: { files: [file] } });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('No valid file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploadStatus('Uploading...');
            const response = await fetch('http://localhost:3000/addStudents', {
                method: 'POST',
                headers: { Authorization: `BEARER ${token}` },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setUploadStatus(`Successfully uploaded ${data.data.length} students.`);
                // Optionally, refresh the student list after upload
                getStudents(currentPage, selectedBranches, searchTerm);
            } else {
                setUploadStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            setUploadStatus(`Error: ${error.message}`);
        }
    };

    const handleDownload = async () => {
        try {
            const query = new URLSearchParams();
            selectedBranches.forEach((branch) => {
                query.append('branch', branch);
            });

            console.log(query.toString());

            const response = await fetch(`http://localhost:3000/download?${query.toString()}`, {
                method: 'GET',
                headers: { Authorization: `BEARER ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Failed to download file: ' + error.message);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (selectedBranches.length === 0) {
                getStudents(currentPage, [], searchTerm);
            } else {
                getStudents(1, selectedBranches, searchTerm);
            }
        }
    }, [isAuthenticated, currentPage, selectedBranches, searchTerm]); // Trigger on search term change

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 2) {
            pages.push(1, 2, '...', totalPages - 1, totalPages);
        } else if (currentPage >= totalPages - 1) {
            pages.push(1, 2, '...', totalPages - 1, totalPages);
        } else {
            pages.push(1, 2, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1, totalPages);
        }
        return pages;
    };

    const handleLogin = (token) => {
        setToken(token);
        setIsAuthenticated(true);
    };

    const handleBranchChange = (branch) => {
        setSelectedBranches((prev) =>
            prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
        );
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    return (
        <div className="students-container">
            {!isAuthenticated ? (
                <LoginAdmin onLogin={handleLogin} />
            ) : (
                <>
                    <div className="sidebar">
                        <div className="filters">
                            <h4>Filter by Branch:</h4>
                            {branches.map((branch) => (
                                <label key={branch}>
                                    <input
                                        type="checkbox"
                                        value={branch}
                                        checked={selectedBranches.includes(branch)}
                                        onChange={() => handleBranchChange(branch)}
                                    />
                                    {branch}
                                </label>
                            ))}

                            {/* Download CSV Button */}
                            <button
                                className={`download-button ${
                                    selectedBranches.length === 0 ? 'disabled' : ''
                                }`}
                                onClick={handleDownload}
                                disabled={selectedBranches.length === 0}
                            >
                                Download CSV
                            </button>
                        </div>

                        <div className="file-upload-container">
                            <h4>Upload Students Data</h4>
                            <div
                                className="upload-area"
                                onDrop={handleFileDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.querySelector('.file-input').click()}
                            >
                                <p>Drag & Drop or Click to Select CSV, XLS, or XLSX file</p>
                                <input
                                    type="file"
                                    onChange={handleFileSelection}
                                    className="file-input"
                                    accept=".csv, .xls, .xlsx"
                                />
                            </div>
                            <button onClick={handleUpload} className="upload-button">Upload</button>
                            <p className="upload-status">{uploadStatus}</p>
                        </div>

                        <div>
                            <span className='logout-button' onClick={logout}>Logout</span>
                        </div>
                    </div>

                    <div className="student-table-container">


                        {/* Search Bar placed below the Student List heading */}
                        <div className="search-bar">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search by Regd No or Name"
                                className="search-input"
                            />
                            <Link to="/postJob" className='post-job'>Post a Job</Link>
                        </div>

                        <div className="student-table">
                            <div className="table-header">
                                <span>Regd No</span>
                                <span>Name</span>
                                <span>Branch</span>
                                <span onClick={() => handleSort('section')} className="sortable">
                                    Section
                                    {sortConfig.field === 'section' && (
                                        <span className={`sort-icon ${sortConfig.direction}`}></span>
                                    )}
                                </span>
                                <span>Passout Year</span>
                                <span onClick={() => handleSort('cgpa')} className="sortable">
                                    CGPA
                                    {sortConfig.field === 'cgpa' && (
                                        <span className={`sort-icon ${sortConfig.direction}`}></span>
                                    )}
                                </span>
                            </div>
                            {sortedStudents.map((student, index) => (
                                <div
                                    className={`student-row ${
                                        index === 0 ? 'first-row' : index === students.length - 1 ? 'last-row' : ''
                                    }`}
                                    key={student.regdno}
                                >
                                    <span>{student.regdno}</span>
                                    <span>{student.name}</span>
                                    <span>{student.branch}</span>
                                    <span>{student.section}</span>
                                    <span>{student.passoutyear}</span>
                                    <span>{student.cgpa}</span>
                                </div>
                            ))}
                        </div>

                        {selectedBranches.length === 0 && (
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <div className="page-numbers">
                                    {generatePageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            className={
                                                page === currentPage
                                                    ? 'page-button active'
                                                    : page === '...'
                                                    ? 'dots'
                                                    : 'page-button'
                                            }
                                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                                            disabled={page === '...'}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Students;
