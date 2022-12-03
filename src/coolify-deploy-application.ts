import * as core from '@actions/core'
// import * as os from 'os'
// import {resolve} from 'path'
import {Inputs} from './constants'
import axios, { AxiosError } from 'axios';

async function run(): Promise<void> {
  try {
    const url = core.getInput(Inputs.CoolifyUrl, {required: true});
    const applicationId = core.getInput(Inputs.CoolifyAppId, {required: true});
    const token = core.getInput(Inputs.CoolifyToken, {required: true});
    const awaitFinish = core.getInput(Inputs.AwaitFinish, {required: false}) || true;
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

    const secrets: {key: string, value?: string}[] = [];

    Object.keys(process.env).forEach((key) => {
      const [,secretKey] = key.split('CO_SECRET_');
      if(secretKey){
        core.debug(`${secretKey} = ${process.env[key]}`);
        secrets.push({key: secretKey, value: process.env[key]});
      }
    })

    core.setOutput('build-id', data.buildId);

    if(awaitFinish){
      /**
       * 1 - Pega status
       *  se em queue - espera 5 segundos e tenta novamente
       *    esperar no máximo 1 minuto para iniciar
       * 2 - Pega log e imprime
       *  Se finalizar com sucesso, avisar
       *  Se der erro lançar exessão
       */
    }
  } catch (error) {
    if(axios.isAxiosError(error)){
      const axiosError = error as AxiosError<{message: string}>;

      return core.setFailed(`Status of Error: ${axiosError.response?.status}, message ${JSON.stringify(axiosError.response?.data?.message)}`);
    }
    
    return core.setFailed('Has unknown error');
  }
}

run()