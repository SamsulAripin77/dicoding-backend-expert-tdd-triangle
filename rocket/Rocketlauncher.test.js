const Rocket = require('./Rocket');
const RocketLauncher = require('./Rocketlauncher');
const RocketRepairKit = require('./RocketRepairKit')

describe('A RocketLauncher', () => {
    it('should launch all rockets', () => {
        const nasaRocket = new Rocket('Nasa');
        const spaceXRocket = new Rocket('SpaceX');
        const rocketlauncher = new RocketLauncher({},[nasaRocket, spaceXRocket]);
      
        rocketlauncher.launchAllRockets();

        //assert
        expect(nasaRocket.engineStatus).toEqual('active');
        expect(spaceXRocket.engineStatus).toEqual('active');
        expect(rocketlauncher.rockets.length).toEqual(0);
    });

    it('should launch only one rocket by queue', () =>{
        const nasaRocket = new Rocket('Nasa');
        const spaceXRocket = new Rocket('SpaceX');
        const rocketlauncher = new RocketLauncher({},[nasaRocket, spaceXRocket]);

        rocketlauncher.launchRocketbyQueue();

        //assert
        expect(nasaRocket.engineStatus).toEqual('active');
        expect(spaceXRocket.engineStatus).toEqual('inactive');
        expect(rocketlauncher.rockets.length).toEqual(1)
    });

    it('should return correct result when repair kit cannot repair', async () =>{

        const fakeRocketRepairKit = {
            repair: () => Promise.reject('failed to repair the rocket'),
        }

        const rocketlauncher = new RocketLauncher(fakeRocketRepairKit,[{}]);

        const result = await rocketlauncher.repairAllRockets();

        expect(result).toEqual('there was 1 of 1 rocket fail to repair!');
    });

    it('should repair some repairable rocket when repair kti cannot', async () => {
        const repairableRocket = new Rocket('repairableRocket');
        const unrepairableRocket = new Rocket('unrepairableRocket');

        const fakeRocketRepairKit = {
            repair: jest.fn().mockImplementation((rocket) => {
                if(rocket.name === 'repairableRocket'){
                    return Promise.resolve();
                }

                return Promise.reject('failed to repair the rocket');
            }),
        }
        const rocketLauncher = new RocketLauncher(fakeRocketRepairKit, [repairableRocket, unrepairableRocket]);

        //action
        const result = await rocketLauncher.repairAllRockets();

        //assert
        expect(result).toEqual(`there was 1 of 2 rocket fail to repair!`);

        expect(fakeRocketRepairKit.repair).toBeCalled();
        expect(fakeRocketRepairKit.repair).toBeCalledWith(repairableRocket);

    });

    //spy example
    it('should repair all the rockets with repair kit correctly', async() =>{
        const nasaRocket = new Rocket('Nasa');
        const spaceXRocket = new Rocket('SpaceX');

        const rocketRepairKit = new RocketRepairKit({},{},{});
        const spyRepair = jest.spyOn(rocketRepairKit,'repair');
        const rocketLauncher = new RocketLauncher(rocketRepairKit,[nasaRocket, spaceXRocket]);
       
        //action
        const result = await rocketLauncher.repairAllRockets();

        //assert
        expect(spyRepair).toBeCalledTimes(2);
        expect(spyRepair).toBeCalledWith(nasaRocket);
        expect(spyRepair).toBeCalledWith(spaceXRocket);
        expect(result).toEqual('all rocket repaired!');
    });
})