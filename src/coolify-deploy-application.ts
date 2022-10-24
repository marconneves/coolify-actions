import * as core from '@actions/core'
// import * as os from 'os'
// import {resolve} from 'path'
import {Inputs} from './constants'
import axios, { AxiosError } from 'axios';

async function run(): Promise<void> {
  try {
    const url = core.getInput(Inputs.CoolifyUrl, {required: false});
    const applicationId = core.getInput(Inputs.CoolifyAppId, {required: false});
    const token = core.getInput(Inputs.CoolifyToken, {required: false});
    const branch = process.env.GITHUB_REF_NAME;

    core.debug(`Start deploy of application ${applicationId} of branch ${branch}`);

   const { data } = await axios({
      method: 'post',
      url: `${url}/api/v1/applications/${applicationId}/deploy`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
      data: {
        "pullmergeRequestId": null,
        "branch": branch,
        "forceRebuild": true
      }
    });

    core.setOutput('build-id', data.buildId);
  } catch (error) {
    if(axios.isAxiosError(error)){
      const axiosError = error as AxiosError<{message: string}>;

      return core.setFailed(`Status of Error: ${axiosError.response?.status}, message ${JSON.stringify(axiosError.response?.data?.message)}`);
    }
    
    return core.setFailed('Has unknown error');
  }
}

run()