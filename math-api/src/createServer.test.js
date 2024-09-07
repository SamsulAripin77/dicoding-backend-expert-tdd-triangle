const createServer = require('./createServer');
const MathBasic = require('./MathBasic');

describe('A HTTP Server', () => {
    describe('when GET /add', () => {
        it('should respond with a status code of 200 and the payload value is addition', async () => {
            const a = 10;
            const b = 20;

            const spyAdd = jest.spyOn(MathBasic, 'add');
            const server = createServer({mathBasic: MathBasic});

            //action
            const response = await server.inject({
                method: 'GET',
                url: `/add/${a}/${b}`
            })

            //assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.value).toEqual(30);
            expect(spyAdd).toHaveBeenCalledWith(a,b);
        })
    })
})

describe('when GET /substract', () => {
    it('should respond with a status code of 200 and the payload value is substraction', async () => {
        const [a,b] = [12,8];
        const spySubstract = jest.spyOn(MathBasic, 'subtract');
        const server = createServer({mathBasic: MathBasic});

        //action
        const response = await server.inject({
            method: 'GET',
            url: `/substract/${a}/${b}`,
        });

        //assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.value).toEqual(4); // a -b
        expect(spySubstract).toHaveBeenCalledWith(a,b);
    })
})