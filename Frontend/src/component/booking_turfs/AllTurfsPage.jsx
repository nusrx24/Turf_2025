import React, { useState, useEffect } from 'react';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination ';
import TurfResult from '../common/TurfResult ';
import TurfSearch from '../common/TurfSearch';

const AllTurfsPage = () => {
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [turfTypes, setTurfTypes] = useState([]);
  const [selectedTurfType, setSelectedTurfType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [turfsPerPage] = useState(5);

  // Function to handle search results
  const handleSearchResult = (results) => {
    setTurfs(results);
    setFilteredTurfs(results);
  };

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await ApiService.getAllTurfs();
        const allTurfs = response.turfList || response; // Adjust based on your API response structure
        setTurfs(allTurfs);
        setFilteredTurfs(allTurfs);
      } catch (error) {
        console.error('Error fetching turfs:', error.message);
      }
    };

    const fetchTurfTypes = async () => {
      try {
        const types = await ApiService.getTurfTypes();
        setTurfTypes(types);
      } catch (error) {
        console.error('Error fetching turf types:', error.message);
      }
    };

    fetchTurfs();
    fetchTurfTypes();
  }, []);

  const handleTurfTypeChange = (e) => {
    setSelectedTurfType(e.target.value);
    filterTurfs(e.target.value);
  };

  const filterTurfs = (type) => {
    if (type === '') {
      setFilteredTurfs(turfs);
    } else {
      const filtered = turfs.filter((turf) => turf.turfType === type);
      setFilteredTurfs(filtered);
    }
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Pagination
  const indexOfLastTurf = currentPage * turfsPerPage;
  const indexOfFirstTurf = indexOfLastTurf - turfsPerPage;
  const currentTurfs = filteredTurfs.slice(indexOfFirstTurf, indexOfLastTurf);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='all-turfs'>
      <h2>All Turfs</h2>
      <div className='all-turf-filter-div'>
        <label>Filter by Turf Type:</label>
        <select value={selectedTurfType} onChange={handleTurfTypeChange}>
          <option value="">All</option>
          {turfTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      <TurfSearch handleSearchResult={handleSearchResult} />
      <TurfResult turfSearchResults={currentTurfs} />

      <Pagination
        turfsPerPage={turfsPerPage}
        totalTurfs={filteredTurfs.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default AllTurfsPage;