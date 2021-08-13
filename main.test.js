const request = require('supertest')
const app = require('./main')


describe('User API', () => {
    it('user should signup successful', () => {
        return request(app)
            .post('api/users/signup')
            .send({
                email: "nadralia@gmail.com",
                username: "nadralia",
                firstName: "adralia",
                lastName: "nelson",
                password:"user@123",
                verifyPassword: "user@123"
            })
            .expect(200)
    })

    it('user should login successful', () => {
        return request(app)
            .post('api/users/login')
            .send({
                email: 123,
                password: 'test@123'
            })
            .expect(200)
    })

    it('user get user details', () => {
        return request(app)
            .get(`api/users/user`, tokenheader)
            .expect(200)
    })
})