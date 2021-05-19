import React, {useState, props, useEffect} from 'react';
import "../styles/homePage.css";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {Alert} from 'react-bootstrap'
import { Redirect} from "react-router";



const SchoolForm = ({items, compItems, schoolGrade}) => {
    const [resultString, setResultString] = useState('school_name');
    const [resultStringDBN, setResultStringDBN] = useState('dbn')
    useEffect(() => {
      if(schoolGrade === "elementary" || schoolGrade === "highschool") {
        setResultString("school_name")
        setResultStringDBN("dbn")
      } else if(schoolGrade === "middle") {
        setResultString("name")
        setResultStringDBN("schooldbn")
      }
    }, [schoolGrade])
    const styles = {
      zIndex: "1"
  }
    const handleOnSearch = (string, results) => {
      // onSearch will have as the first callback parameter
      // the string searched and for the second the results.
      console.log('OnSearch', string, results)
    }

    const handleOnSelect = (item) => {
      // the item selected
      console.log('OnSelect',item);
      window.open(`/school/${item[resultStringDBN]}`,"_blank")
    }

    const handleOnFocus = () => {
      console.log('Focused')
    }
    const [error, setError] = useState('')
    
    const formSubmit = (e) =>{
        //Remove this once I add school page
        e.preventDefault()
        if(e.target[0].defaultValue in compItems === false){
            //e.preventDefault()
            setError('Please type in the correct school name.')
            return
        }
        setError('')
        //If this works, make sure to redirect to school page once that's set up 
        //FINISH THIS 
    }
    return(
        <form onSubmit={(e) => formSubmit(e)}>
          <div className="form-group inputSetting">
              <ReactSearchAutocomplete 
                items={items}
                onSearch={handleOnSearch}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                fuseOptions={{ keys:[resultString] }}
                resultStringKeyName= {resultString}
                styling ={styles}
                placeholder="Search School Name"
                autoFocus
              />
          </div>
          {error && <Alert className=" mt-2 mb-auto" variant="danger"
            >{error}</Alert>}
        </form>
    );
    
}

const InputForm = ({items, compItems,schoolGrade}) =>{
    return (
      <div className="container-fluid text-center ">
          <SchoolForm items = {items} compItems = {compItems} schoolGrade={schoolGrade}/>
      </div>
    );
}

export default InputForm;