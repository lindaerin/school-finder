import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Heart from "react-heart";
import '../styles/homePage.css';

function Card({ name, id, bookmark, userID, location, secondColumn, thirdColumn}) {

  const [active, setActive] = useState(false);

  function checkBookmark(){
    for(let i = 0; i < bookmark.length; i++){ 
      if(bookmark[i]["schoolDBID"] === id){
        setActive(true);
        return;
      } 
    }
    setActive(false);
    return;
  }

  function setUserBookmark(){
    if(userID){
      if(active){ // delete bookmark
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookmarks/delete`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({userUUID: userID,
                                        schoolDBID: id}),
              })
              .then(
                console.log("deleted bookmark")
              )
              .catch((error) => {
                  console.error('Error:', error);
              });
      }
      else if(!active){ // add bookmark
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookmarks/add`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({userUUID: userID,
                                        schoolDBID: id,
                                        schoolName: name}),
              })
              .then(
                console.log("added bookmark")
              )
              .catch((error) => {
                  console.error('Error:', error);
              });
      }
      setActive(!active);
      return;
    }
    else{
      alert("You must be a user to favorite schools!");
      return;
    }
  }
  
  useEffect(() => {
    checkBookmark();
  }, [])
  
  return (
    <div className="col-10 col-md-8 col-lg-10 m-auto pt-4">
      <div className="card mb-4 shadow">
        <div className="card-header " style={{textAlign:"center"}}>
          <div className="row">
            <div className="col-11">
              <h4>{name}</h4>
            </div>
            <div className="ml-auto" style={{ width: "2rem", height:"2rem" }}>
              <Heart isActive={(active)} onClick={() => setUserBookmark()} animationScale = {1.25} style = {{marginBottom:'1rem'}}/>
            </div>
          </div>
        </div>
        <div className="card-body card-text text-center ">
          <div className="col"><p>{location}</p></div>
          <div className="dropdown-divider"></div>
          <div className="col"><p>{secondColumn ? secondColumn : "No subway here"}</p></div>
          <div className="dropdown-divider"></div>
          <div className="col"><p>{thirdColumn} </p></div>
          <button className="btn home-btn"  type="button"  
                        aria-haspopup="true" aria-expanded="true">
                    <a style={{color:"white"}} href={`/school/${id}`} target="_blank"  rel="noreferrer">Show more info</a>
                    <span className="caret"></span>
                </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
//<Link to={"/posts/"+id}>{ content }</Link>