import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentList from './components/StudentList';
import Header from './components/Header';

function App() {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<StudentList />} />
                {/* <Route path="/restaurant/:id" element={<RestaurantDetail />} /> */}
            </Routes>
        </Router>
    );
}

export default App;