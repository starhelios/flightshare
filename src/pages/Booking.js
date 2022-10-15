import Card from "react-bootstrap/Card";
import {useLocation, useParams } from 'react-router-dom';
import data from "../data.json";

function Booking() {

  // const location = useLocation();
  let { id } = useParams(); 
  const instructor = data.find((e) => e.id == id);
  
  return (
    <>
      <div className="container">
        <h2 className="m-4 text-center">{instructor.name} Booking Page</h2>
        <div className="booking-card">
          <Card className="mt-3">
            <Card.Body>
              <div className="row">
                <div className="col-md-4 col-sm-5">
                  <img src="/temp_avatar.jpeg" alt="avatar" width="180px" />
                </div>
                <div className="col-md-8 col-sm-7 card-data">
                  <div className="row">
                    <h4>{instructor.name}</h4>
                  </div>
                  <div className="row">
                    <h6>Airports: {instructor.airports}</h6>
                  </div>
                  <div className="row">
                    <h6>Airplanes: {instructor.airplanes}</h6>
                  </div>
                  <div className="row">
                    <h6>Pilot Hours: {instructor.pilot_hours}</h6>
                  </div>
                  <div className="row">
                    <h6>
                      Instruction Per Hour: {instructor.instruction_per_hour}
                    </h6>
                  </div>
                  <div className="row">
                    <h6>Short Bio: {instructor.short_bio}</h6>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div dangerouslySetInnerHTML={{__html: `
            <!-- Start Square Appointments Embed Code -->
            <script src='https://squareup.com/appointments/buyer/widget/u0kf3cr428a7dz/L8QJQT7DDGBGJ.js'></script>
            <!-- End Square Appointments Embed Code -->
          `}} />
          
          <div className="profile-detail-img">
            <img src="https://i.imgur.com/mrXyy6y.png" alt="profile-detail" width="600px"/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Booking;
