import EmObject from '@ember/object';


export default EmObject.extend({

  deserializeProperty(prop, value) {
    return this.set(prop, value);
  },

  deserialize(hash = {}) {
    let value;

    Object.keys(hash).map((prop) => {
      value = hash[prop];
      this.deserializeProperty(prop, value);
    });
    return this;
  },


  serialize() {
    let hash = {};

    this.resourceProperties.forEach((prop) => {
      let value = this.serializeProperty(prop);
      hash[prop] = value;
    });
    return hash;
  },

  serializeProperty(prop) {
    let value = this[prop];

    if (value === null) {
      value = undefined;
    }

    return value;
  },


  validate() {
    return [];
  },

  saveRecord() {

    let errors = this.validate();

    if (errors.length) {
      this.set('errorMessages', errors);
      throw new Error();
    }

    let data = {
      JSONString: JSON.stringify(this.serialize())
    };

    return this.store.makeNetworkRequest(this.resourceUrl, {
      type: 'POST',
      data
    });
  },

  constructResourceUrl() {
    let { resourceUrl, resourceIdField } = this;
    let url  = `${resourceUrl}`;
    return this[resourceIdField] ? `${url}/${this[resourceIdField]}` : url;
  },

  sendRequest(params = {}) {
    let url;
  let { resourceIdField } = this;

    if (this[resourceIdField]) {
      url = this.constructResourceUrl()
    }

    params.type = 'GET';

    return this.store.makeNetworkRequest(url, params);
  },

  deleteRecord() {

    let url;
    let { resourceUrl, resourceIdField } = this;

    if (this[resourceIdField]) {
      url = `${resourceUrl}/${resourceIdField}`;
    }

    return this.store.makeNetworkRequest(url, { type: 'DELETE '});
  },

  updateRecord() {
    let errors = this.validate();

    if (errors.length) {
      this.set('errorMessages', errors);
      throw new Error();
    }
    let data = {
      JSONString: JSON.stringify(this.serialize())
    };

    return this.store.makeNetworkRequest(this.resourceUrl, {
      type: 'PUT',
      data
    });
  },
});
