// const chai = require('chai');
import chai from 'chai'
// const chaiHttp = require('chai-http');
import chaiHttp from 'chai-http'
// const app = require('../app'); // if you export your Express app from app.js
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);
describe('FAQ API Tests', () => {
    let createdFAQId;
    it('should create a new FAQ', (done) => {
        chai
            .request(app)
            .post('/api/faqs')
            .send({
                question: 'What is Node.js?', answer:
                    '<p>Node.js is runtime environment.</p>'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.data).to.have.property('_id');
                createdFAQId = res.body.data._id;
                done();
            });
    });
    it('should fetch all FAQs', (done) => {
        chai
            .request(app)
            .get('/api/faqs')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.data).to.be.an('array');
                done();
            });
    });
    it('should fetch the created FAQ by ID', (done) => {
        chai
            .request(app)
            .get(`/api/faqs/${createdFAQId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.data._id).to.equal(createdFAQId);
                done();
            });
    });
    it('should update the created FAQ', (done) => {
        chai
            .request(app)
            .put(`/api/faqs/${createdFAQId}`)
            .send({ question: 'Updated question' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.data.question).to.equal('Updated question');
                done();
            });
    });
    it('should delete the created FAQ', (done) => {
        chai
            .request(app)
            .delete(`/api/faqs/${createdFAQId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
