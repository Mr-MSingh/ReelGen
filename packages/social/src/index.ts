export type ConnectionValidationResult = {
  ok: boolean;
  reason?: string;
};

export type PublishInput = {
  videoAssetKey: string;
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "unlisted" | "private";
};

export type PublishResult = {
  remotePostId: string;
  postUrl: string;
};

export interface SocialPublisher {
  validateConnection(accountId: string): Promise<ConnectionValidationResult>;
  refreshAuth(accountId: string): Promise<void>;
  publish(input: PublishInput): Promise<PublishResult>;
}

export class YouTubePublisher implements SocialPublisher {
  async validateConnection(): Promise<ConnectionValidationResult> {
    return { ok: true };
  }

  async refreshAuth(): Promise<void> {
    return;
  }

  async publish(): Promise<PublishResult> {
    return {
      remotePostId: "yt_mock_id",
      postUrl: "https://youtube.com/shorts/mock",
    };
  }
}

export class InstagramPublisher implements SocialPublisher {
  async validateConnection(): Promise<ConnectionValidationResult> {
    return { ok: false, reason: "Not implemented" };
  }

  async refreshAuth(): Promise<void> {
    return;
  }

  async publish(): Promise<PublishResult> {
    throw new Error("Instagram publishing not implemented");
  }
}

export class TikTokPublisher implements SocialPublisher {
  async validateConnection(): Promise<ConnectionValidationResult> {
    return { ok: false, reason: "Not implemented" };
  }

  async refreshAuth(): Promise<void> {
    return;
  }

  async publish(): Promise<PublishResult> {
    throw new Error("TikTok publishing not implemented");
  }
}
