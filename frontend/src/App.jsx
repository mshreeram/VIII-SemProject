import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentList from './components/StudentList';
import Header from './components/Header';
import Index from './components/Index';
import JobList from './components/JobList';

function App() {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admindashboard" element={<StudentList />} />
                <Route path="/studentdashboard" element={<JobList />} />
            </Routes>
        </Router>
    );
}

export default App;