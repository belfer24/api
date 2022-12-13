import { CloudTasksClient } from '@google-cloud/tasks';
import { ICloudTasks } from '@/helpers/cloud-tasks/cloud-tasks.interface';
import { google } from '@google-cloud/tasks/build/protos/protos';

import { cloudTasksUrl } from '@/constants/urls';

export class CloudTasks {
  async CreateCloudTask({ payload, delay }: ICloudTasks.Task) {
    const client = new CloudTasksClient({ fallback: true });

    const project = 'outlook-extension-14ab7';
    const queue = 'mails';
    const location = 'us-central1';

    const parent = client.queuePath(project, location, queue);

    const task: google.cloud.tasks.v2.ITask = {
      httpRequest: {
        httpMethod: ICloudTasks.Enum.RequestMethod.Post,
        url: cloudTasksUrl,
      },
    };

    if (task && payload) {
      task.httpRequest!.body = Buffer.from(JSON.stringify(payload)).toString(
        'base64',
      );
      task.httpRequest!.headers = { 'Content-Type': 'application/json' };
    }

    if (delay) {
      task.scheduleTime = {
        seconds: delay + Date.now() / 1000,
      };
    }

    return client.createTask({ parent, task });
  }
}
