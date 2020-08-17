const { transformPullRequest } = require('../../../lib/transforms/pull-request');

describe('transforms/pull_request', () => {
  it('should return no data if there are no issue keys', () => {
    const event = JSON.parse(JSON.stringify(require('../../fixtures/pull-request-remove-keys.json')));

    Date.now = jest.fn(() => 12345678);

    const { data } = transformPullRequest(event.payload, null, null);
    expect(data).toBeUndefined();
  });

  it('should return the latest status of reviews', async () => {
    const event = JSON.parse(JSON.stringify(require('../../fixtures/pull-request-basic.json')));
    const author = {
      avatar_url: 'test-author-avatar-url',
      login: 'test-author-login',
      html_url: 'test-author-url',
    };
    const reviews = require('../../fixtures/api/reviews-multiple.json');

    Date.now = jest.fn(() => 12345678);

    const { data } = await transformPullRequest(event.payload, author, reviews);
    expect(data).toMatchObject({
      id: 'test-repo-id',
      name: 'example/test-repo-name',
      url: 'test-repo-url',
      branches: [
        {
          createPullRequestUrl: 'test-pull-request-head-url/pull/new/TEST-321-test-pull-request-head-ref',
          lastCommit: {
            author: {
              name: 'test-author-login',
            },
            authorTimestamp: 'test-pull-request-update-time',
            displayId: 'test-p',
            fileCount: 0,
            hash: 'test-pull-request-sha',
            id: 'test-pull-request-sha',
            issueKeys: ['TEST-123', 'TEST-321'],
            message: 'n/a',
            updateSequenceId: 12345678,
            url: 'test-pull-request-head-url/commit/test-pull-request-sha',
          },
          id: 'TEST-321-test-pull-request-head-ref',
          issueKeys: ['TEST-123', 'TEST-321'],
          name: 'TEST-321-test-pull-request-head-ref',
          url: 'test-pull-request-head-url/tree/TEST-321-test-pull-request-head-ref',
          updateSequenceId: 12345678,
        },
      ],
      pullRequests: [
        {
          author: {
            avatar: 'test-author-avatar-url',
            name: 'test-author-login',
            url: 'test-author-url',
          },
          reviewers: [
            {
              name: 'test-reviewer-name',
              url: 'test-reviewer-url',
              avatar: 'test-reviewer-avatar',
              approved: true,
            },
            {
              name: 'test-reviewer-name-2',
              url: 'test-reviewer-url-2',
              avatar: 'test-reviewer-avatar-2',
              approved: false,
            },
          ],
          commentCount: 'test-pull-request-comment-count',
          destinationBranch: 'test-pull-request-base-url/tree/test-pull-request-base-ref',
          displayId: '#1',
          id: 1,
          issueKeys: ['TEST-123', 'TEST-321'],
          lastUpdate: 'test-pull-request-update-time',
          sourceBranch: 'TEST-321-test-pull-request-head-ref',
          sourceBranchUrl: 'test-pull-request-head-url/tree/TEST-321-test-pull-request-head-ref',
          status: 'OPEN',
          timestamp: 'test-pull-request-update-time',
          title: '[TEST-123] Test pull request.',
          url: 'test-pull-request-url',
          updateSequenceId: 12345678,
        },
      ],
      updateSequenceId: 12345678,
    });
  });
});
