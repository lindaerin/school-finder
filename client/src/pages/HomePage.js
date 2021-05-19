import React,{useEffect, useState, props} from 'react';
import Card from '../components/SchoolCard';
import Loading from '../components/Loading';
import Map from '../components/Map';
import "../styles/homePage.css";
import InputForm from '../components/InputForms';
import FilterRow from '../components/FilterOptions';
import '../styles/theme.css';
import { useAuth } from "../contexts/AuthContext";
import { data } from 'jquery';
import SchoolDropdown from "../components/SchoolDropdown"
import {
  elementarySchoolData,
  middleSchoolData,
  highSchoolData,
} from "../utils/schoolDataFields.js";

const HomePage = () => {
  const [schoolJSON, setJSON] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems ]= useState([]);
  const [compItems, setCompItems] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState(null);
  const [userBookmark, setUserBookmark] = useState([]);
  const [schoolGrade, setSchoolGrade] = useState(null);
  const [url, setUrl] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (url !== null) {
      let dataFields;
      switch (schoolGrade) {
        case "elementary":
          dataFields = elementarySchoolData;
          break;
        case "middle":
          dataFields = middleSchoolData;
          break;
        case "highschool":
          dataFields = highSchoolData;
          break;
        default:
          break;
      }
      const options = {
        type: "GET",
        data: {
          $limit: 5000,
          $$app_token: "YOURAPPTOKENHEREs",
        },
      };
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          let tempItems = [];
          let tempComp = [];
          let index = 0;
          data.forEach((e) => {
            let infoItem = {};
            infoItem.id = index++;
            dataFields.forEach((dataField) => {
              infoItem[dataField] = e[dataField];
            });

            tempItems.push(infoItem);
            tempComp[e.school_name] = e.dbn;
          });
          setItems(tempItems);
          setCompItems(tempComp);
          setJSON(data)
          console.log(tempItems)
        })
        .catch((err) => console.log("API ERROR: ", err));
      // fetch for all of user's review
    }
    if(currentUser){
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookmarks/bookmarkedSchools`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userUUID: currentUser.uid}),
            })
            .then(response => response.json())
            .then(data => {
                setUserBookmark(data);
                console.log('bookmark: ', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
      }
  }, [url])

  const selectedSchoolCallback = ( childData ) =>{
    if(childData && childData.length===0){
      setSelectedSchools(null)
    }
    else{
      setSelectedSchools(childData)
    }
  }
  const handleDropdown = (schoolGrade, url) => {
    console.log(url, schoolGrade)
    setSchoolGrade(schoolGrade);
    setUrl(url);
    setSelectedSchools(null)
  };

  console.log("SELECTED", selectedSchools)
  return(
    <div className="parent">
      <div className="leftSide">
        <div className="row">
          <div className="m-auto">
            <SchoolDropdown 
              schoolGrade={(schoolGrade, url) => handleDropdown(schoolGrade, url)}
            />
            
          </div>
          {
            schoolGrade ?
            <div className="container-fluid"> 
            <InputForm items = {items}  compItems = {compItems} schoolGrade={schoolGrade}/>
            <FilterRow selectedSchoolCallback= {selectedSchoolCallback} data= {schoolJSON} schoolGrade={schoolGrade}/>
            </div>
            :
            <div className=" container-fluid text-center ">
              <p>Please select a school option.</p>
            </div>
          }
        </div>
        
        <div className="row">
          {
            selectedSchools && selectedSchools.map((school) =>{
              switch (schoolGrade) {
                case "elementary":
                  return(
                    <Card name={school.school_name} id={school.dbn} bookmark={userBookmark} userID = {currentUser ? currentUser.uid : null} location={school.address} secondColumn={school.nta} thirdColumn={school.school_type} schoolGrade={url}/>
                  );
                case "middle":
                  return(
                    <Card name={school.name} id={school.schooldbn} bookmark={userBookmark} userID = {currentUser ? currentUser.uid : null} location={school.address} secondColumn={school.subway} thirdColumn={school.bus} schoolGrade={url}/>
                  );
                case "highschool":
                  return(
                    <Card name={school.school_name} id={school.dbn} bookmark={userBookmark} userID = {currentUser ? currentUser.uid : null} location={school.location.split(" (")[0]} secondColumn={school.subway} thirdColumn={school.bus} schoolGrade={url}/>
                  );
                default:
                  break;
              }
            })
          }
        </div>
      </div>
      <div className="rightSide">
        {
          selectedSchools!==null?
          <Map schoolData = {selectedSchools} schoolGrade={schoolGrade}/>
          :
          <Map schoolData = {selectedSchools}/>
        }
      </div>
      
    </div>
  );
}

export default HomePage;