import * as cp from 'child_process';
import { commitAllFiles, hasGit, inExistingGitTree, initGit } from './git';
import * as Version from './version';

describe('git', () => {
  let execSyncSpy: jest.SpyInstance<ReturnType<typeof cp.execSync>, Parameters<typeof cp.execSync>>;

  beforeEach(() => {
    execSyncSpy = jest.spyOn(cp, 'execSync');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('hasGit', () => {
    it('returns true when git is on the path', () => {
      execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
        switch (cmd) {
          case 'git --version':
            return Buffer.alloc(0);
          default:
            throw new Error(`unmocked command ${cmd}`);
        }
      });

      expect(hasGit()).toBe(true);
    });

    it('returns false when git is not on the path', () => {
      execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
        switch (cmd) {
          case 'git --version':
            throw new Error('`git` could not be found');
          default:
            throw new Error(`unmocked command ${cmd}`);
        }
      });

      expect(hasGit()).toBe(false);
    });
  });

  describe('inExistingGitTree', () => {
    it('returns status of true when a project is in existing git repo', () => {
      execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
        switch (cmd) {
          case 'git rev-parse --is-inside-work-tree':
            return Buffer.alloc(0);
          default:
            throw new Error(`unmocked command ${cmd}`);
        }
      });

      expect(inExistingGitTree()).toBe(true);
    });

    it('returns status of false when a project is not in existing git repo', () => {
      execSyncSpy.mockImplementation(() => {
        throw new Error('fatal: not a git repository (or any of the parent directories): .git');
      });
      expect(inExistingGitTree()).toBe(false);
    });
  });

  describe('initGit', () => {
    it('returns true when git is successfully initialized', () => {
      execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
        switch (cmd) {
          case 'git init':
            return Buffer.alloc(0);
          default:
            throw new Error(`unmocked command ${cmd}`);
        }
      });
      expect(initGit()).toBe(true);
    });

    it('returns false when git repo initialization fails', () => {
      execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
        switch (cmd) {
          case 'git init':
            throw new Error('`git init` failed for some reason');
          default:
            throw new Error(`unmocked command ${cmd}`);
        }
      });
      expect(initGit()).toBe(false);
    });
  });

  describe('commitGit', () => {
    const MOCK_PKG_JSON_VERSION = '3.0.0';
    let getPkgVersionSpy: jest.SpyInstance<
      ReturnType<typeof Version.getPkgVersion>,
      Parameters<typeof Version.getPkgVersion>
    >;

    beforeEach(() => {
      getPkgVersionSpy = jest.spyOn(Version, 'getPkgVersion');
      getPkgVersionSpy.mockImplementation(() => MOCK_PKG_JSON_VERSION);

      execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
        switch (cmd) {
          case 'git add -A':
            return Buffer.alloc(0);
          case `git commit -m "init with create-stencil v${MOCK_PKG_JSON_VERSION}"`:
          case `git commit -m "init with create-stencil"`:
            return Buffer.alloc(0);
          default:
            throw new Error(`unmocked command ${cmd}`);
        }
      });
    });

    afterEach(() => {
      getPkgVersionSpy.mockRestore();
    });

    it('returns true when files are committed', () => {
      expect(commitAllFiles()).toBe(true);
    });

    describe("'git add' fails", () => {
      beforeEach(() => {
        execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
          switch (cmd) {
            case 'git add -A':
              throw new Error('git add has failed for some reason');
            case `git commit -m "init with create-stencil v${MOCK_PKG_JSON_VERSION}"`:
              throw new Error('git commit should not have been reached!');
            default:
              throw new Error(`unmocked command ${cmd}`);
          }
        });
      });

      it('returns false ', () => {
        expect(commitAllFiles()).toBe(false);
      });

      it('does not attempt to commit files', () => {
        commitAllFiles();

        expect(execSyncSpy).toHaveBeenCalledTimes(1);
        expect(execSyncSpy).toHaveBeenCalledWith('git add -A', { stdio: 'ignore' });
      });
    });

    describe("'git commit' fails", () => {
      it("returns false when 'git commit' fails", () => {
        execSyncSpy.mockImplementation((cmd: string, _options: cp.ExecOptions | undefined) => {
          switch (cmd) {
            case 'git add -A':
              return Buffer.alloc(0);
            case `git commit -m "init with create-stencil v${MOCK_PKG_JSON_VERSION}"`:
              throw new Error('git commit has failed for some reason');
            default:
              throw new Error(`unmocked command ${cmd}`);
          }
        });
        expect(commitAllFiles()).toBe(false);
      });
    });
  });
});
