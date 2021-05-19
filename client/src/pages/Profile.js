import React, {useState, useEffect, props} from "react";

import { Container} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Rating from '@material-ui/lab/Rating';
import '../styles/theme.css';
import {data} from 'jquery';
import {Tabs, Tab} from "react-bootstrap";
import Bookmark from '../components/ProfileBookmark';


export default function Profile() {
  const [userReviewData, setUserReviewData] = useState([]);
  const [userBookmark, setUserBookmark] = useState([]);
  const [rating, setRating] = useState(null); 
  const { currentUser } = useAuth();

  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/review/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({reviewerUUID: currentUser.uid}),
        })
        .then(response => response.json())
        .then(data => {
            setUserReviewData(data)
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookmarks/bookmarkedSchools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userUUID: currentUser.uid}),
        })
        .then(response => response.json())
        .then(data => {
            setUserBookmark(data)
            console.log('bookmark: ', data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
  }, [])

  // Review card display by User

  function UserReviewCard ({reviews}) {
    
    return(
        <div className="container m-auto">
            {
              reviews ? reviews.map((data) => {
                return(
                  <div className="card ">
                    <h5 className="card-header">{data.schoolName}</h5>
                    <div className="card-body">
                      <h5 className="card-title">{data.reviewerEmail}</h5>
                      <p className="card-text">{data.description}</p>
                      <Rating
                        name="simple-controlled"
                        value={data.rating}
                        readOnly
                      />
                    </div>
                  </div>
                )
                
              })
              :
              <p>No Review Data.</p>
            }
        </div>
    );
  } 

  return (
    <div>
      <Container>
        <h2 className="text-center">Profile Page</h2>
        <div className="text-center mt-2">
          <strong>Email:{currentUser.email}</strong>
        </div>
      </Container>
      <div className="row">
        <div className="col">
          <h2 className="text-center">Bookmarks</h2>
          {
            userBookmark && userBookmark.map((bookmark, index) => {
              return(
                <Bookmark schoolName={bookmark["schoolName"]} schoolID={bookmark["schoolDBID"]} userID={currentUser.uid}/>
              );
            })
          }
      </div>
      <div className="col">
        <h2 className="text-center">Reviews</h2>
        <UserReviewCard reviews={userReviewData}/>
      </div>
      </div>
         
      
    </div>
  );
}