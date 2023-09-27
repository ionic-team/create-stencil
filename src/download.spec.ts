import { verifyStarterExists } from './download';

describe('download', () => {
  describe('verifyStarterExists', () => {
    it('returns false if starter does not exist', async () => {
      expect(await verifyStarterExists({
        repo: 'foo/bar',
        name: 'foo-bar-starter'
      })).toBe(false);
    });

    it('returns true if starter does exist', async () => {
      expect(await verifyStarterExists({
        repo: 'ionic-team/stencil',
        name: 'stencil'
      })).toBe(true);
    });
  });
});
