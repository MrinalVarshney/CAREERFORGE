import React, { useState , useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import JobsDes from './JobsDes';
import Card from '../components/Card';
import { getAppliedJobsByUserId, host } from "../utils/APIRoutes"; 
import axios from 'axios';
import styled from "styled-components";
import Topbar from '../components/Topbar';
import './JobStyle.css'
const AppliedJobs = () => {
  const [currentUser,setCurrentUser] = useState(undefined)
  const [jobs,setJobs] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response")
       if(response.data.user) setCurrentUser(response.data.user);
        console.log("current",currentUser)
        console.log("response",response.data.user)
    } catch (error) {
      console.log(error)
      navigate("/login")
    }
    };

    
    fetchData();
  }, []);

  const getAppliedJobs = async () => {
    if(currentUser){const res = await axios.get(`${getAppliedJobsByUserId}/${currentUser._id}`);
    console.log(res.data);
    setJobs(res.data);}
  }

  useEffect(() => {
    setIsLoading(true)
    getAppliedJobs();
    setIsLoading(false)
  },[currentUser]);
  
   // Calculate the index range
    const calculatePageRange =()=>{
      const startIndex = (currentPage - 1)*itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return {startIndex,endIndex};
    }

  // function for next page
  const nextPage = () => {
    if(currentPage < Math.ceil(jobs.length / itemsPerPage)){
      setCurrentPage(currentPage + 1);
    }
    // console.log("Next clicked!")
  }

  // function for the previous page
  const prevPage = () => {
     if(currentPage > 1){
      setCurrentPage(currentPage - 1);
     }
    }
const main = (jobs) => {
    let appliedJobs = jobs
    // console.log(appliedJobs)
    const {startIndex,endIndex} = calculatePageRange();
    appliedJobs = appliedJobs.slice(startIndex,endIndex);
   
    return appliedJobs.map((data,i) =>
      (data.appliedJobId !== null) ?
      <Card key = {i} data = {data.appliedJobId} currentUser = {currentUser}></Card> : <></>
    );
}
const result = main(jobs);
return (
  <StyledHome>
  <Top>
    <Topbar currentUser={currentUser}/>
  </Top>
  <StyledPosts>
  <div className='postedJobsOuterMost'> {/* Utilizing flexbox */}
  {/* job cards */}
  <div className='JobsCard'>
  <h1 className='myAppliedJobs'>My Applied Jobs</h1>
      {
          (isLoading) ? <p>Loading...</p> : (result.length > 0) ? <JobsDes result={result} /> :
              <>
                  <h3 className='JobsCardInner'>{result.length} Jobs</h3>
                  <p>No data found</p>
              </>
      }
      {/* Pagination here */}
      {
          result.length > 0 ? (
              <div className='JobsPagination'>
                  <button onClick={prevPage} disabled={currentPage === 1} className='PreviousButton'>Previous</button>
                  <span className='JobsCardSpan'>Page {currentPage} of {Math.ceil(jobs.length / itemsPerPage)}</span>
                  <button onClick={nextPage} disabled={currentPage === Math.ceil(jobs.length / itemsPerPage)} className='PreviousButton'>Next</button>
              </div>
          ) : ""
      }
  </div>
</div>
</StyledPosts>
    </StyledHome>
)
}
const StyledHome = styled.div`
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const Top = styled.div`
  position: sticky;
  top: 0px;
  z-index:100;
`

const StyledPosts = styled.div`
  flex: 1;
  padding: 10px;

  /* Webkit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3498db;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ecf0f1;
    border-radius: 8px;
  }

  /* Additional styling for the content */
  // background-color: #fff;
  border-radius: 8px;

`;
export default AppliedJobs;
