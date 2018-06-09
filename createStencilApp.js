#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const appName = process.argv.slice(2)[0];
const appKind = process.argv.slice(2)[1] !== "--app";
let appDirectory = `${process.cwd()}/${appName}`

const componentStarter = "stencil-component-starter"
const appStarter = "stencil-app-starter"

let kind = appKind ? "stencil-component-starter" : "stencil-app-starter";

const run = async () => {
  console.log(`\nGetting started! 💎 ${kind}`)

  let success = await createStencilApp()
  if (!success) {
    console.log(`\n⚠️  Something went wrong while trying to create a new Stencil app using ${kind}\n`)
    return false;
  } else {
    await cdIntoNewApp()
    await removeOrigin()
    await installPackages()
    console.log("\n🎉  All done!\n")
  }
}

const createStencilApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      try {
        exec(`git clone https://github.com/ionic-team/${kind} "${appName}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`\n⚠️  Couldn't check out "${appName}"`)
            resolve(false)
          } else {
            console.log(`\nChecked out Stencil ${kind} into "${appName}"`)
            resolve(true)
          }
        })
      } catch(e) {
        console.log(`\nCouldn't check out Stencil ${kind} into "${appName}"`)
        resolve(false)
      }
    } else {
      console.log("\nNo app name was provided.")
      console.log("\nProvide an app name in the following format: ")
      console.log("\ncreate-stencil-app", `"app-name"\n`)
        resolve(false)
    }
  })
}

const cdIntoNewApp = () => {
  return new Promise((resolve) => {
    console.log("\n🏃‍♀️  Changing Directories...")
    process.chdir(`${appName}`);
    resolve()
  })
}

const removeOrigin = () => {
  return new Promise((resolve) => {
    console.log("\n✂️  Removing remotes in Git...")
    exec(`git remote rm origin`, () => {
      resolve()
    })
    resolve()
  })
}

const installPackages = () => {
  return new Promise((resolve) => {
    console.log("\n📦  Installing packages...")
    exec(`npm install --save`, () => {
      resolve()
    })
  })
}

run();
