export namespace IOutlookHelper {
  export namespace Methods {
    export namespace Connect {
      export type Response = Promise<void>;
    }

    export namespace Available {
      export type Response = Promise<boolean>;
    }

    export namespace Send {
      export type Request = {
        text: string;
        to: string;
        subject: string;
      };
      export type Response = Promise<void>;
    }
  }

  export namespace Graph {
    export interface SchemaMessage {
      bccRecipients: Recipient[];
      body: ItemBody;
      bodyPreview: string;
      categories: string[];
      ccRecipients: Recipient[];
      changeKey: string;
      conversationId: string;
      conversationIndex: string;
      createdDateTime: string;
      flag: FollowupFlag;
      from: Recipient;
      hasAttachments: boolean;
      id: string;
      importance: Property.Importance;
      inferenceClassification: Property.InferenceClassificationType;
      internetMessageHeaders: InternetMessageHeader[];
      internetMessageId: string;
      isDeliveryReceiptRequested: boolean;
      isDraft: boolean;
      isRead: boolean;
      isReadReceiptRequested: boolean;
      lastModifiedDateTime: string;
      parentFolderId: string;
      receivedDateTime: string;
      replyTo: Recipient[];
      sender: Recipient;
      sentDateTime: string;
      subject: string;
      toRecipients: Recipient[];
      uniqueBody: ItemBody;
      webLink: string;
      attachments?: Attachment[];
      extensions?: Extension;
      multiValueExtendedProperties?: MultiValueLegacyExtendedProperty[];
      singleValueExtendedProperties?: SingleValueLegacyExtendedProperty[];
    }

    export interface SingleValueLegacyExtendedProperty {
      id: string;
      value: string;
    }

    export interface MultiValueLegacyExtendedProperty {
      id: string;
      value: string[];
    }

    export interface Extension {
      id: string;
    }

    export interface Attachment {
      contentType: string;
      id: string;
      isInline: boolean;
      lastModifiedDateTime: string;
      name: string;
      size: number;
    }

    export interface InternetMessageHeader {
      name: string;
      value: string;
    }

    export interface Recipient {
      emailAddress: EmailAddress;
    }

    export interface EmailAddress {
      address: string;
      name?: string;
    }

    export interface ItemBody {
      content: string;
      contentType: Property.BodyType;
    }

    export interface FollowupFlag {
      completedDateTime: DateTimeTimeZone;
      dueDateTime: DateTimeTimeZone;
      flagStatus: Property.FollowupFlagStatus;
      startDateTime: DateTimeTimeZone;
    }

    export interface DateTimeTimeZone {
      dateTime: string;
      timeZone: string;
    }

    export interface MailFolder {
      childFolderCount: number;
      displayName: string;
      id: string;
      parentFolderId: string;
      totalItemCount: number;
      unreadItemCount: number;
      childFolders: MailFolder[];
      messageRules: MessageRule[];
      messages: SchemaMessage[];
      multiValueExtendedProperties: MultiValueLegacyExtendedProperty[];
      singleValueExtendedProperties: SingleValueLegacyExtendedProperty[];
    }

    export interface MessageRule {
      actions: MessageRuleAction;
      conditions: MessageRulePredicates;
      displayName: string;
      exceptions: MessageRulePredicates;
      hasError: boolean;
      id: string;
      isEnabled: boolean;
      isReadOnly: boolean;
      sequence: number;
    }

    export interface MessageRulePredicates {
      bodyContains: string[];
      bodyOrSubjectContains: string[];
      categories: string[];
      fromAddresses: Recipient[];
      hasAttachments: boolean;
      headerContains: string[];
      importance: string;
      isApprovalRequest: boolean;
      isAutomaticForward: boolean;
      isAutomaticReply: boolean;
      isEncrypted: boolean;
      isMeetingRequest: boolean;
      isMeetingResponse: boolean;
      isNonDeliveryReport: boolean;
      isPermissionControlled: boolean;
      isReadReceipt: boolean;
      isSigned: boolean;
      isVoicemail: boolean;
      messageActionFlag: string;
      notSentToMe: boolean;
      recipientContains: string;
      senderContains: string[];
      sensitivity: string[];
      sentCcMe: boolean;
      sentOnlyToMe: boolean;
      sentToAddresses: Recipient[];
      sentToMe: boolean;
      sentToOrCcMe: boolean;
      subjectContains: string[];
      withinSizeRange: SizeRange;
    }

    export interface SizeRange {
      maximumSize: number;
      minimumSize: number;
    }

    export interface MessageRuleAction {
      assignCategories: string[];
      copyToFolder: string[];
      delete: boolean;
      forwardAsAttachmentTo: Recipient[];
      forwardTo: Recipient[];
      markAsRead: boolean;
      markImportance: string;
      moveToFolder: string;
      permanentDelete: boolean;
      redirectTo: Recipient[];
      stopProcessingRules: boolean;
    }

    export namespace Property {
      export enum InferenceClassificationType {
        Focused = 'focused',
        Other = 'other',
      }

      export enum FollowupFlagStatus {
        NotFlagged = 'notFlagged',
        Complete = 'complete',
        Flagged = 'flagged',
      }

      export enum BodyType {
        HTML = 'html',
        TEXT = 'text',
      }

      export enum Importance {
        Low = 'Low',
        Normal = 'Normal',
        High = 'High',
      }

      export enum Folder {
        ArchiveDeletedItems = 'ArchiveDeletedItems',
        ArchiveMsgFolderRoot = 'ArchiveMsgFolderRoot',
        ArchiveRecoverableItemsDeletions = 'ArchiveRecoverableItemsDeletions',
        ArchiveRecoverableItemsPurges = 'ArchiveRecoverableItemsPurges',
        ArchiveRecoverableItemsRoot = 'ArchiveRecoverableItemsRoot',
        ArchiveRecoverableItemsVersions = 'ArchiveRecoverableItemsVersions',
        ArchiveRoot = 'ArchiveRoot',
        Calendar = 'Calendar',
        Conflicts = 'Conflicts',
        Contacts = 'Contacts',
        ConversationHistory = 'ConversationHistory',
        DeletedItems = 'DeletedItems',
        Drafts = 'Drafts',
        Inbox = 'Inbox',
        Journal = 'Journal',
        JunkEmail = 'JunkEmail',
        LocalFailures = 'LocalFailures',
        MsgFolderRoot = 'MsgFolderRoot',
        Notes = 'Notes',
        Outbox = 'Outbox',
        PublicFoldersRoot = 'PublicFoldersRoot',
        QuickContacts = 'QuickContacts',
        RecipientCache = 'RecipientCache',
        RecoverableItemsDeletions = 'RecoverableItemsDeletions',
        RecoverableItemsPurges = 'RecoverableItemsPurges',
        RecoverableItemsRoot = 'RecoverableItemsRoot',
        RecoverableItemsVersions = 'RecoverableItemsVersions',
        Root = 'Root',
        SearchFolders = 'SearchFolders',
        SentItems = 'SentItems',
        ServerFailures = 'ServerFailures',
        SyncIssues = 'SyncIssues',
        Tasks = 'Tasks',
        ToDoSearch = 'ToDoSearch',
        VoiceMail = 'VoiceMail',
      }
    }
  }
}
