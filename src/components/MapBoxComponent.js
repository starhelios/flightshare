import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Offcanvas
} from 'react-bootstrap';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import data from "../data.json";

function MapBoxComponent({ isMobile = false }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-117.9019);
  const [lat, setLat] = useState(33.60234);
  const [zoom, setZoom] = useState(14);
  const [show, setShow] = useState(false);
  const [instructors, setInstructors] = useState([]);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const navigate = useNavigate();
  const handleOnBooking = useCallback(id => navigate(`/booking/${id}`), [
    navigate
  ]);
  
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE_URI,
      center: [lng, lat],
      zoom: zoom
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-right");

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    );

    map.current.on("load", () => {
      var features = [];

      data.forEach((instructor, index) => {
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [instructor.longitude, instructor.latitude]
          },
          properties: {
            id: instructor.id,
            name: instructor.name,
            FIELD2: instructor.FIELD2,
            zipcode: instructor.zipcode,
            latitude: instructor.latitude,
            longitude: instructor.longitude,
            airports: instructor.airports,
            airplanes: instructor.airplanes,
            pilot_hours: instructor.pilot_hours,
            instruction_per_hour: instructor.instruction_per_hour,
            short_bio: instructor.short_bio
          }
        });
      });

      var clusterRadius = 50;
      // Add an image to use as a custom marker
      map.current.loadImage(
        // "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        "https://i.imgur.com/RCUuyBC.png",
        (error, image) => {
          if (error) throw error;
          map.current.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points
          map.current.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: features
            }
          });

          // Add a symbol layer
          map.current.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top"
            }
          });

          const data2 = {
            type: "FeatureCollection",
            crs: {
              type: "name",
              properties: {
                name: "urn:ogc:def:crs:OGC:1.3:CRS84"
              }
            },
            features: features
          };
          map.current.addSource("earthquakes", {
            type: "geojson",
            data: data2,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
          });

          map.current.addLayer({
            id: "clusters",
            type: "circle",
            source: "earthquakes",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#E74C3C",
                100,
                "#f1f075",
                750,
                "#f28cb1"
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
              ]
            }
          });

          map.current.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "earthquakes",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated}",
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12
            },
            paint: {
              "text-color": "#ffffff"
            }
          });

          map.current.on("click", "points", e => {
            openSpotDetail(e.features);
          });

          map.current.on("click", "clusters", e => {
            const features = map.current.queryRenderedFeatures(e.point, {
              layers: ["clusters"]
            });
            const clusterId = features[0].properties.cluster_id;
            const point_count = features[0].properties.point_count;
            const clusterSource = map.current.getSource("earthquakes");

            clusterSource.getClusterChildren(clusterId, function(
              err,
              aFeatures
            ) {
              // console.log("getClusterChildren", err, aFeatures);
            });
            clusterSource.getClusterLeaves(clusterId, point_count, 0, function(
              err,
              aFeatures
            ) {
              console.log("getClusterLeaves", err, aFeatures);
              openSpotDetail(aFeatures);
            });
          });

          map.current.on("mouseenter", "clusters", () => {
            map.current.getCanvas().style.cursor = "pointer";
          });
          map.current.on("mouseleave", "clusters", () => {
            map.current.getCanvas().style.cursor = "";
          });
        }
      );
    });
  });

  function openSpotDetail(data) {
    setInstructors(data);
    handleShow();
  }

  const Container = isMobile ? <div /> : DesktopMapContainer;

  return (
    <div className="home-container">
      <h2 className="m-4">Book your first flying lesson today</h2>
      <h5 className="m-4">
        Choose a location on the map to find an instructor and book a lesson!
      </h5>
      <div ref={mapContainer} className="map-container" />
      <Container show={show} handleClose={handleClose}>
        {instructors.map((user, index) => (
          <Card style={{ width: "100%" }} className="mt-3" key={index}>
            <Card.Body>
              <div className="row">
                <div className="col-md-4 col-sm-5 profile-img">
                  <img src="/temp_avatar.jpeg" alt="avatar" width="180px" />
                </div>
                <div className="col-md-8 col-sm-7 card-data">
                  <div className="row">
                    <h4>{user.properties.name}</h4>
                  </div>
                  <div className="row">
                    <h6>Airports: {user.properties.airports}</h6>
                  </div>
                  <div className="row">
                    <h6>Airplanes: {user.properties.airplanes}</h6>
                  </div>
                  <div className="row">
                    <h6>Pilot Hours: {user.properties.pilot_hours}</h6>
                  </div>
                  <div className="row">
                    <h6>
                      Instruction Per Hour:{" "}
                      {user.properties.instruction_per_hour}
                    </h6>
                  </div>
                  <div className="row">
                    <h6>Short Bio: {user.properties.short_bio}</h6>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="primary"
                      onClick={() => handleOnBooking(user.properties.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
}

export default MapBoxComponent;

function DesktopMapContainer(props) {
  return (
    <Offcanvas
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      placement="end"
      className="profile-modal"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Instructors</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {props.children}
      </Offcanvas.Body>
    </Offcanvas>
  )
}
