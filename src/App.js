import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn/SignIn';

function App() {
  return (
    <div className="App">
      <div>
        <h1>Welcome To Firebase Authentication</h1>
      </div>
      <div>
        <SignIn/>
      </div>
    </div>
  );
}

export default App;
