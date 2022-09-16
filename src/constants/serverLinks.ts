const apiLink = process.env.API_LINK;

const serverLinks = {
  outlookRedirectLink: `${apiLink}/auth/redirect`,
  cloudTasksRedirectLink: `${apiLink}/mails/send-mails`,
};

export default serverLinks;
