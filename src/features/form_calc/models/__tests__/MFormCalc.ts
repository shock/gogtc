import { TierNum, toInt } from '../../types';
import { MFormCalc, MTierDef, MTroopDef, FCState, BlankFCState } from '..';
import { buildTierWithTroopDefs, buildFormCalcWithTiers } from '../test_helper';

describe( 'MTierDef', () => {

  describe('constructor', () => {
    it('should return an instance of MFormCalc', () => {
      let instance = new MFormCalc('test');
      expect(instance instanceof MFormCalc).toEqual(true);
    });
      it('should set the name property', () => {
        let instance = new MFormCalc('test');
        expect(instance.name).toEqual('test');
    });
  });

  describe('getState()', () => {
    it('should return the appropriate state', () => {
      const formCalc = new MFormCalc('test');
      let tierDef = buildTierWithTroopDefs(TierNum.T12, formCalc);
      formCalc.tierDefs = [tierDef];
      const testState:FCState = BlankFCState;
      const state = formCalc.getState();
    });
  });

  describe('findTierDef()', () => {
    describe('with no tierDefs', () => {
      it('should throw an Error', () => {
        const formCalc = new MFormCalc('test');
        expect(
          () => {formCalc.findTierDef(':'+TierNum.T12)}
        ).toThrow(Error);
      });
    });
    describe('with tierDefs', () => {
      describe('with valid TierNum', () => {
        it('should find the tierDef ', () => {
          const formCalc = buildFormCalcWithTiers();
          const found = formCalc.findTierDef(':'+TierNum.T12);
          expect( found instanceof MTierDef ).toBe(true);
          expect( found.tierNum ).toEqual( TierNum.T12 );
        });
      });
      describe('with invalid TierNum', () => {
        it('should throw an Error', () => {
          const formCalc = buildFormCalcWithTiers();
          expect(
            () => {formCalc.findTierDef(':'+TierNum.T1)}
          ).toThrow(Error);
        });
      });
    });
  });

  describe('getCapFromTierDefs()', () => {
    it('should return the appropriate integer', () => {
      const formCalc = buildFormCalcWithTiers();
      expect(formCalc.getCapFromTierDefs()).toBe(toInt(12000));
      formCalc.tierDefs[0].troopDefs[0].updateCount(formCalc.tierDefs[0].troopDefs[0].count-1000);
      expect(formCalc.getCapFromTierDefs()).toBe(toInt(11000));
    });

  });

});
