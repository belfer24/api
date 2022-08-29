import { CloudTasksClient } from '@google-cloud/tasks';
import { ICloudTasks } from 'src/helpers/cloud-tasks/cloud-tasks.interface';
import { google } from '@google-cloud/tasks/build/protos/protos';

import cloudTasksCreds from 'src/constants/google';

export class CloudTasks {
  async createCloudTask({ payload, delay }: { payload: any; delay: number }) {
    const client = new CloudTasksClient({ fallback: true });

    const parent = client.queuePath(
      cloudTasksCreds.project,
      cloudTasksCreds.location,
      cloudTasksCreds.queue,
    );

    const task: google.cloud.tasks.v2.ITask = {
      httpRequest: {
        httpMethod: ICloudTasks.Enum.RequestMethod.Post,
        url: cloudTasksCreds.url,
      },
    };

    if (payload) {
      task.httpRequest.body = Buffer.from(JSON.stringify(payload)).toString(
        'base64',
      );
      task.httpRequest.headers = { 'Content-Type': 'application/json' };
    }

    if (delay) {
      task.scheduleTime = {
        seconds: delay + Date.now() / 1000,
      };
    }

    const request = { parent, task };

    return client.createTask(request);
  }
}
