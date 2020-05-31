import { toInt, TroopType } from '../../types';
import { MTroopDef } from '../';

describe( 'MTroopDef', () => {

  describe('constructor', () => {
    it('should return an instance of MTroopDef', () => {
      let instance = new MTroopDef(TroopType.Infantry, toInt(1000));
      expect(instance instanceof MTroopDef).toEqual(true);
    });
      it('should set the constructor properties', () => {
        let instance = new MTroopDef(TroopType.Infantry, toInt(1000));
        expect(instance.type).toEqual(TroopType.Infantry);
        expect(instance.count).toEqual(toInt(1000));
    });
  });

});
