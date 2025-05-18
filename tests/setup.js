const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');

global.expect = chai.expect;
global.sinon = sinon;

// Setup chai-http middleware
chai.use(chaiHttp);

// Hooks
beforeEach(() => {});
afterEach(() => {sinon.restore();});// Reset mock after each test