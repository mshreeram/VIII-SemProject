import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentList from './components/Admin/StudentList';
import Header from './components/Header';
import Index from './components/Index';
import JobList from './components/Students/JobList';
import RegisterStudent from './components/Students/RegisterStudent';
import JobDetails from './components/Students/JobDetails';
import PostJob from './components/Admin/PostJob';

function App() {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admindashboard" element={<StudentList />} />
                <Route path="/studentdashboard" element={<JobList />} />
                <Route path="/registerstudent" element={<RegisterStudent />} />
                <Route path="/job/:jobid" element={<JobDetails />} />
                <Route path="/postJob" element={<PostJob />} />
            </Routes>
        </Router>
    );
}

export default App;