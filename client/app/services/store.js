import { Promise } from 'rsvp';
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { run } from '@ember/runloop';
import $ from 'jquery';

const serverUrl = 'http://localhost:3000/';
export default Service.extend({

  createRecord(modelName) {
    return getOwner(this).lookup(`model:${modelName}`, { singleton: false });
  },

  findAll(modelName, { params = {} }) {
    let modelClass = getOwner(this).lookup(`model:${modelName}`, { singleton: false });
    modelClass.setProperties(params)
    let resourceUrl = modelClass.constructResourceUrl();

    return this.makeNetworkRequest(resourceUrl, { params }).then((json) => {
      return json.map((row) => {
        return this.createRecord(modelName).deserialize(row);
      });
    });
  },

  getJSON(url, params) {
    return this.makeNetworkRequest(url, { params });
  },

  stringifyParams(params = {}) {
    let queryString = $.param(params);
    return queryString ? `?${queryString}`: '';
  },

  makeNetworkRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      let { data = null, params = {}, type = 'GET' } = options;

      let xhr = new XMLHttpRequest();

      url = `${serverUrl}${url}${this.stringifyParams(params)}`;


      xhr.open(type, url);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');

      xhr.send(data);
      xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            let response = {}
            try {
              response = this.response;
            } catch (exception) {
              throw exception;
            }
            run(null, resolve, response);
          } else {
            let response = new Error('request: `' + url + '` failed with status: [' + this.status + ']');
            run(null, reject, response);
          }
        }
      };
    });
  }

});
