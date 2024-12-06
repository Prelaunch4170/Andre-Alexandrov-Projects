import logo from './logo.svg';
import './App.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
function App() {
  return (
    <div className="App">

          <Link className="nav-link active" to="testing"> Report</Link>
    </div>
  );
}

export default App;
