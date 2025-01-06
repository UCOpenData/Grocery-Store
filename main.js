import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

let communityData = {};


fetch('./data/csvjson.json')
    .then(response => response.json())
    .then(data => {
        // Create a lookup table where the key is the community name
        communityData = data.reduce((acc, item) => {
            acc[item.Name.toUpperCase()] = item['VRPTP_2017-2021']
            return acc;
        }, {});
        console.log(communityData["ROGERS PARK"]);
        const communitystyle = function(feature) {
          const color = feature.get('community');
          const comname = communityData[color];
          console.log(comname);
          //console.log(comname);  // Assuming 'COLOR' is a property in your features
          return new Style({
              fill: new Fill({ color: col(comname) })
          });
        };
        const map = new Map({
          target: 'map-container',
          layers: [
            
            new VectorLayer({
                source: new VectorSource({
                    format: new GeoJSON(),
                    url: './data/bounds.geojson',
                    name: 'bounds'
                }),
                style: communitystyle
            }),
        
            
            new VectorLayer({
              source: new VectorSource({
                  format: new GeoJSON(),
                  url: './data/Location_filtered.geojson',
                  name: 'grocery'
                  // Add style for grocery layer here if needed
              }),
            }),
          ],
          view: new View({
            center: [-9750000, 5133000],
            zoom: 10.8,
          }),
        });
        const info = document.getElementById('status'); // Make sure this matches the ID of your  display element
        
        
        
        
        let currentFeature2;
        const displayFeatureInfoStore = function (pixel, target) {
          const feature = target.closest('.ol-control')
            ? undefined
            : map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
              });
        
          if (feature) {
            
        
            // Set the fixed box size just larger than the text
            info.style.width =  140+ 'px'; // Add some padding
            info.style.height =  60 + 'px'; // Add some padding
        
            // Position the box around the pointer
            info.style.left = pixel[0] + 10 + 'px'; // Adjust position as needed
            info.style.top = pixel[1] + 10 + 'px';
            if (feature !== currentFeature2) {
              info.style.visibility = 'visible';
              info.innerText = feature.get('store_name');
              info.style.color = 'blue';
              info.style.backgroundColor = 'light_grey';
              info.style.outline = 'blue';
               
              //console.log(info.innerText);
              if (info.innerText === 'undefined'){
                info.innerText = feature.get('community');
                info.style.color = 'green';
                if (info.innerText === 'undefined'){
                  info.innerText = feature.get('name');
                  info.style.color = 'blue';
                }
              }
              
            }
          } else {
            info.style.visibility = 'hidden';
          }
          currentFeature2 = feature;
        };
        
        map.on('pointermove', function (evt) {
          if (evt.dragging) {
            info.style.visibility = 'hidden';
            currentFeature = undefined;
            return;
          }
          const pixel = map.getEventPixel(evt.originalEvent);

          
          //displayFeatureInfo(pixel, evt.originalEvent.target);
          displayFeatureInfoStore(pixel, evt.originalEvent.target);
        });
        
        map.on('click', function (evt) {
          displayFeatureInfoStore(evt.pixel, evt.originalEvent.target);
        });
        
        map.getTargetElement().addEventListener('pointerleave', function () {
          currentFeature = undefined;
          info.style.visibility = 'hidden';
        });
        
    })
    .catch(error => console.error('Failed to load community data:', error));

function col(num){
  if (num > 17.2){
    return '#5575A3';}
  else if (num > 15.4){
    return '#5a8bbc';
  }
  else if (num > 14.3){
    return '#67a2ca';
  }
  else if (num > 12.8){
    return '#75b7d4';
  }
  else if (num > 11.4){
    return '#8ac9db';
  }
  else if (num > 10.2){
    return '#9dd5cf';
  }
  else if (num > 9.3){
    return '#b8e0c8';
  }
  else if (num > 8.4){
    return '#cee8cf';
  }
  else{
    return '#ddefd9';}
}


// cee8cf
//ddefd9
