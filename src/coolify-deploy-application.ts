import * as core from '@actions/core'
// import * as artifact from '@actions/artifact'
// import * as os from 'os'
// import {resolve} from 'path'
import {Inputs} from './constants'

async function run(): Promise<void> {
  try {
    const url = core.getInput(Inputs.Url, {required: false});
    const applicationId = core.getInput(Inputs.ApplicationId, {required: false});

    core.debug(`Resolved url is ${url}`);
    core.debug(`Resolved applicationId is ${applicationId}`);
  } catch (err) {
    core.setFailed('Has a Error')
  }
}