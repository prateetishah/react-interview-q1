import logo from './logo.svg';
import './App.css';
import { React, useState, useEffect, useSyncExternalStore } from "react";
import { getLocations, isNameValid } from "./mock-api/apis"

function App() {
  const [userName, setUserName] = useState("");
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVal, setSelectedVal] = useState("");
  const [isUserNameValid, setIsUserNameValid] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [userData, setUserData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getLocations();
        setLocations(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleLocationChange = (e) => setSelectedVal(e.target.value);
  const handleUserNameChange = async (e) => {
    setUserName(e.target.value);
    setIsUserLoading(true);
    try{
      const result = await isNameValid(e.target.value);
      setIsUserNameValid(result);
    } catch (err) {
      console.error('Error during Validation:', err);
      setIsUserNameValid(false);
    } finally {
      setIsUserLoading(false);
    }
  };
  const addUserDetails = (e) => {
    e.preventDefault();
    const existingUser = userData.find(user => user.userName === userName && user.selectedVal === selectedVal);
    if (!existingUser) {
      setUserData([...userData, { userName, selectedVal }]);
    } else {
      alert("User exist!")
    }
    setUserName("");
    setSelectedVal("");
  };
  const clearUserDetails = () => {
    setUserName("");
    setSelectedVal("");
  }
  return (
    <div className="App">
        <h1>User Form</h1>
        <form action="#" method="get" class="user-form">
          <div>
          <label for="userName">
            Name
          </label>
          <div>
          <input type="text" name="userName" id="username" value={userName} onChange={ handleUserNameChange } placeholder="Enter Name" />
          {isUserLoading && <p>Validating...</p>}
          {!isUserNameValid && <p className="error">Name is invalid.</p>}
          </div>          
          </div>
          <div>
          <label for="location">
            Location
          </label>
            <div>
              {isLoading && <p>Loading locations...</p>}
              {error && <p>Error: {error}</p>}
              {locations.length > 0 && (
                <select value={ selectedVal } onChange={handleLocationChange}>
                  <option value="" disabled>Select Location</option>
                  {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div>
            <button id="add-btn" onClick={addUserDetails}> Add </button>
            <button id="clear-btn" onClick={clearUserDetails}> Clear </button>
          </div>
          <div>
        <table id="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.userName}>
                <td>{user.userName}</td>
                <td>{user.selectedVal}</td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>       
        </form>
    </div>
  );
}

export default App;
