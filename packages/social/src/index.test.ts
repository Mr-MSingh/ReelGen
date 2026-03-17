import { describe, expect, it } from "vitest";
import { YouTubePublisher } from "./index";

describe("YouTubePublisher", () => {
  it("publishes and returns a post URL", async () => {
    const publisher = new YouTubePublisher();
    const result = await publisher.publish({
      videoAssetKey: "mock",
      title: "Test",
    });
    expect(result.remotePostId).toBeTruthy();
    expect(result.postUrl).toContain("youtube");
  });
});
