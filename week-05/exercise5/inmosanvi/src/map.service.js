import { View, Map, Feature } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { Point } from "ol/geom";
import { useGeographic } from "ol/proj";

export class MapService {
  #map;
  #view;
  #vectorLayer;

  constructor({ latitude, longitude }, divMapId, zoom = 14) {
    useGeographic();

    this.#view = new View({
      center: [longitude, latitude],
      zoom,
    });

    this.#map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: divMapId,
      view: this.#view,
    });

    this.#vectorLayer = new VectorLayer({
      map: this.#map,
      source: new VectorSource({
        features: [],
      }),
    });
  }

  get view() {
    return this.#view;
  }

  createMarker(
    { latitude, longitude },
    color = "#3399CC",
    fill = "#fff"
  ) {
    const positionFeature = new Feature({
      geometry: new Point([longitude, latitude]),
    });
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 9,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({
            color: fill,
            width: 3,
          }),
        }),
      })
    );

    this.#vectorLayer.getSource()?.addFeature(positionFeature);

    return positionFeature;
  }
	// Add this to be able to clear the map before adding a new point
  clearMarkers() {
    this.#vectorLayer.getSource()?.clear();
  }
}
