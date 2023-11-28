// Bed - Change colours
var myModels = ["/models/bed-wood.glb", "/models/bed-white.glb", "/models/bed-black.glb"]
var counter = 0;
document.getElementById("change-bed").addEventListener("click", function() {
    counter++;
    if (counter==3) { 
        counter = 0;
    }
    document.getElementById("bed").src = myModels[counter];
});

// Chair - Show dimensions
  const viewDimension = document.querySelector('#chair');

  const checkbox = viewDimension.querySelector('#show-dimensions');

  const dimElements = [...viewDimension.querySelectorAll('button'), viewDimension.querySelector('#dimLines')];

  function setVisibility(visible) {
    dimElements.forEach((element) => {
      if (visible) {
        element.classList.remove('hide');
      } else {
        element.classList.add('hide');
      }
    });
  }

  checkbox.addEventListener('change', () => {
    setVisibility(checkbox.checked);
  });

  viewDimension.addEventListener('ar-status', (event) => {
    setVisibility(event.detail.status !== 'session-started');
  });

  function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
    if (dotHotspot1 && dotHotspot2) {
      svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
      svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
      svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
      svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

      if (dimensionHotspot && !dimensionHotspot.facingCamera) {
        svgLine.classList.add('hide');
      } else {
        svgLine.classList.remove('hide');
      }
    }
  }

  const dimLines = viewDimension.querySelectorAll('line');

  const renderSVG = () => {
    drawLine(dimLines[0], viewDimension.queryHotspot('hotspot-dot+X-Y+Z'), viewDimension.queryHotspot('hotspot-dot+X-Y-Z'), viewDimension.queryHotspot('hotspot-dim+X-Y'));
    drawLine(dimLines[1], viewDimension.queryHotspot('hotspot-dot+X-Y-Z'), viewDimension.queryHotspot('hotspot-dot+X+Y-Z'), viewDimension.queryHotspot('hotspot-dim+X-Z'));
    drawLine(dimLines[2], viewDimension.queryHotspot('hotspot-dot+X+Y-Z'), viewDimension.queryHotspot('hotspot-dot-X+Y-Z')); // always visible
    drawLine(dimLines[3], viewDimension.queryHotspot('hotspot-dot-X+Y-Z'), viewDimension.queryHotspot('hotspot-dot-X-Y-Z'), viewDimension.queryHotspot('hotspot-dim-X-Z'));
    drawLine(dimLines[4], viewDimension.queryHotspot('hotspot-dot-X-Y-Z'), viewDimension.queryHotspot('hotspot-dot-X-Y+Z'), viewDimension.queryHotspot('hotspot-dim-X-Y'));
  };

  viewDimension.addEventListener('load', () => {
    const center = viewDimension.getBoundingBoxCenter();
    const size = viewDimension.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    viewDimension.updateHotspot({
      name: 'hotspot-dot+X-Y+Z',
      position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
    });

    viewDimension.updateHotspot({
      name: 'hotspot-dim+X-Y',
      position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
    });
    viewDimension.querySelector('button[slot="hotspot-dim+X-Y"]').textContent =
      `${(size.z * 100).toFixed(0)} cm`;

    viewDimension.updateHotspot({
      name: 'hotspot-dot+X-Y-Z',
      position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
    });

    viewDimension.updateHotspot({
      name: 'hotspot-dim+X-Z',
      position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
    });
    viewDimension.querySelector('button[slot="hotspot-dim+X-Z"]').textContent =
      `${(size.y * 100).toFixed(0)} cm`;

    viewDimension.updateHotspot({
      name: 'hotspot-dot+X+Y-Z',
      position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
    });

    viewDimension.updateHotspot({
      name: 'hotspot-dim+Y-Z',
      position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
    });
    viewDimension.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent =
      `${(size.x * 100).toFixed(0)} cm`;

    viewDimension.updateHotspot({
      name: 'hotspot-dot-X+Y-Z',
      position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
    });

    viewDimension.updateHotspot({
      name: 'hotspot-dim-X-Z',
      position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
    });
    viewDimension.querySelector('button[slot="hotspot-dim-X-Z"]').textContent =
      `${(size.y * 100).toFixed(0)} cm`;

    viewDimension.updateHotspot({
      name: 'hotspot-dot-X-Y-Z',
      position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
    });

    viewDimension.updateHotspot({
      name: 'hotspot-dim-X-Y',
      position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
    });
    viewDimension.querySelector('button[slot="hotspot-dim-X-Y"]').textContent =
      `${(size.z * 100).toFixed(0)} cm`;

    viewDimension.updateHotspot({
      name: 'hotspot-dot-X-Y+Z',
      position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
    });

    renderSVG();

    viewDimension.addEventListener('camera-change', renderSVG);
  });

// Desk - Set different camera views
const modelViewer = document.getElementById('desk');
const hotspotButtons = modelViewer.querySelectorAll('.view-btn');

hotspotButtons.forEach(button => {
    button.addEventListener('click', () => {
        const orbit = button.getAttribute('data-orbit');

        // Set the camera's orbit based on the clicked hotspot value
        modelViewer.cameraOrbit = orbit;
    });
});

// Inspiration - change environmental light using own image
(() => {
  const modelViewer = document.querySelector('#room');
  const checkbox = document.querySelector('#neutral');
  
  checkbox.addEventListener('change', () => {
    modelViewer.environmentImage = checkbox.checked ? '' : './images/light-1.jpg';
  });
})();


