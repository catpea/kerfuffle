import Queue from './queue/Queue.js';
import Filter from './filter/Filter.js';
import Map from './map/Map.js';
import Reduce from './reduce/Reduce.js';

// Dependency Injection Pattern

const components = {
  Queue,
  Filter,
  Map,
  Reduce,
}

export default components;
