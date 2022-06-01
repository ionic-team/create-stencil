import { getPkgVersion } from './version';
import * as utils from './utils';

describe('version', () => {
  describe('getPkgVersion', () => {
    let getPackageJsonSpy: jest.SpyInstance<
      ReturnType<typeof utils.getPackageJson>,
      Parameters<typeof utils.getPackageJson>
    >;

    beforeEach(() => {
      getPackageJsonSpy = jest.spyOn(utils, 'getPackageJson');
      getPackageJsonSpy.mockImplementation(() => ({ version: '0.0.0' }));
    });

    afterEach(() => {
      getPackageJsonSpy.mockRestore();
    });

    it('throws if package.json cannot be found', () => {
      getPackageJsonSpy.mockImplementation(() => null);
      expect(() => getPkgVersion()).toThrow('the version of this package could not be determined');
    });

    it('throws if the version number cannot be found in package.json', () => {
      getPackageJsonSpy.mockImplementation(() => ({}));
      expect(() => getPkgVersion()).toThrow('the version of this package could not be determined');
    });

    it('returns the version number found in package.json', () => {
      expect(getPkgVersion()).toBe('0.0.0');
    });
  });
});
