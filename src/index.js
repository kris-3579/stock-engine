import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import p5 from 'p5';
import {engine } from '../src/scripts/engine.tsx';

function updateOrdersTable() {
  try {
    let latestOrder = engine.currentOrder.display();
    const ordersTable = document.getElementById('orders-body');

    const orderParts = latestOrder.split('|').map(part => part.trim());
    if (orderParts.length !== 5) return;

    let orderType = orderParts[0];
    const stock = orderParts[1];
    let quantity = orderParts[2];
    const price = orderParts[3];
    const time = orderParts[4];



    const lastRow = ordersTable.lastElementChild;
    if (lastRow) {
      const lastRowData = lastRow.innerText.split('\t');
      if (
        lastRowData[0] === orderType &&
        lastRowData[1] === stock &&
        lastRowData[2] === quantity &&
        lastRowData[3] === `$${price}` &&
        lastRowData[4] === time
      ) {
        return;
      }
    }
    
    // Create new row for normal orders
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${orderType}</td>
      <td>${stock}</td>
      <td>${quantity}</td>
      <td>$${price}</td>
      <td>${time}</td>
    `;

    ordersTable.appendChild(row);

    // Keep the table scroll at the bottom to show the latest updates
    const tableContainer = document.querySelector('.table-container');
    tableContainer.scrollTop = tableContainer.scrollHeight;
  } catch (error) {
    console.error('Error updating orders table:', error);
  }
}


setInterval(updateOrdersTable, 100);

function updateLiveData() {
  try {

    let latestOrders = engine.currentOrder.display();
    // Join the order strings to display them
    document.getElementById('live-data').textContent = latestOrders;

  } catch (error) {
    console.error('Error fetching live-data', error);
  }
}
updateLiveData();
setInterval(updateLiveData, 1000);

function updateMatchData() {
  try {
      let matchString = engine.matchString;

      document.getElementById('live-match-data').textContent = matchString;
      
  } catch (error) {
    console.error('Error fetching live-match-data', error);
  }
}

setInterval(updateMatchData, 1000);


function updateLiveTime() {

  try {
    // const response = await fetch('your-data-source-url');
    const data =  new Date().toLocaleString();
    document.getElementById('live-time').textContent = data;
  } catch (error) {
    console.error('Error fetching time:', error);
  }
}

updateLiveTime();
setInterval(updateLiveTime, 1000);



const P5Sketch = () => {
  const sketchRef = useRef(null);

  useEffect(() => {
    const Sketch = (p) => {
      let time = 0; // Time variable for animation
  
      p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style("position", "absolute"); // Background effect
        canvas.style("top", "0");
        canvas.style("left", "0");
        canvas.style("z-index", "-1");
        p.noLoop(); // Only redraw when needed
      };
  
      p.draw = () => {
        time += 0.02; // Controls the speed of change (Lower = Slower, Higher = Faster)
        let width = p.windowWidth;
        let height = p.windowHeight;
      
        let c2 = p.color('#483D8B'); 
        //let c2 = p.color('#00008B');
        let c1 = p.color('#000000');
      
        drawInteractiveCurves(0, 0, width, height, c1, c2);
        drawBackgroundDesign(width, height);
      };
      
  

function drawInteractiveCurves(x, y, w, h, c1, c2) {
  for (let i = y; i <= y + h; i++) {
    let inter = p.map(i, y, y + h, 0, 1);

    let val = p.map(Math.sin(time), -1, 1, 0, w); // Controlled time
    
    let waveOffset = Math.sin(inter * p.TWO_PI + time) * 150; 
    waveOffset += p.noise(i * 0.01, time * 0.1) * 200; 
    waveOffset += p.map(val, 0, p.width, -100, 100); 

    let c = p.lerpColor(c1, c2, inter);

    p.stroke(c);
    p.line(x + waveOffset, i, x + w - waveOffset, i);
  }
}


    
  
      function drawBackgroundDesign(width, height) {
        p.noFill();
        p.stroke(255, 50); // Light stroke effect
  
        for (let i = 0; i < 50; i++) {
          let x = p.random(width);
          let y = p.random(height);
          let size = p.random(20, 80);
  
          // Draw abstract shapes
          p.ellipse(x, y, size);
          p.rect(x - size / 2, y - size / 2, size, size);
        }
  
        // Add a subtle noise texture to fill gaps
        for (let i = 0; i < width; i += 5) {
          for (let j = 0; j < height; j += 5) {
            let noiseVal = p.noise(i * 0.01, j * 0.01);
            let alpha = p.map(noiseVal, 0, 1, 0, 50);
            p.stroke(255, alpha);
            p.point(i, j);
          }
        }
      }
  
      setInterval(()=> {
        p.redraw()
      }, 0.5)
  
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.redraw(); // Redraw on window resize
      };
  
      p.frameRate(30); // Smooth motion
    };
  
    const myP5 = new p5(Sketch, sketchRef.current);
  
    return () => {
      myP5.remove();
    };
  }, []);
  
  
  

  return <div ref={sketchRef}></div>;
};

const App = () => {
  return (
    <div>
      <P5Sketch />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


